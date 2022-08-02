<?php

namespace EventManagerIntegration\Module;

class Event extends \Modularity\Module
{
    public $slug = 'event';
    public $supports = array();
    public $templateDir = EVENTMANAGERINTEGRATION_PATH.'source/php/Module/Event/views/';
    public $template;
    public $lang;

    public function init()
    {
        $this->nameSingular = __('Event', 'event-integration');
        $this->namePlural = __('Events', 'event-integration');
        $this->description = __('Outputs a list if upcoming events', 'event-integration');
        $this->lang = function_exists('pll_current_language') ? pll_current_language('slug') : null;

        add_action('wp_ajax_nopriv_ajax_pagination', array($this, 'ajaxPagination'));
        add_action('wp_ajax_ajax_pagination', array($this, 'ajaxPagination'));

        add_filter(
            'acf/fields/taxonomy/wp_list_categories/name=mod_event_categories_list',
            array($this, 'filterEventCategories'),
            10,
            2
        );
    }

    public function template()
    {
        $this->getTemplateData($this->template);

        return 'event-'.$this->template.'.blade.php';
    }

    public function getTemplateData($template)
    {
        $template = explode('-', $template);
        $template = array_map('ucwords', $template);
        $template = implode('', $template);
        $class = '\EventManagerIntegration\Module\Event\TemplateController\\'.$template.'Template';

        if (class_exists($class)) {
            $controller = new $class($this, $this->args, $this->data);
            $this->data = array_merge($this->data, $controller->data);
        }
    }

    public function data(): array
    {
        if (get_option('timezone_string')) {
            date_default_timezone_set(get_option('timezone_string'));
        }

        $id = $this->ID ?? $_POST['id'] ?? null;
        $data = get_fields($id);

        parse_str($_SERVER['QUERY_STRING'], $queryArgList);
        $page = $queryArgList['paged'] ?? 1;

        global $post;

        // Cards module data
        $data['settings'] = $data;
        $this->template = !empty($data['mod_event_display']) ? $data['mod_event_display'] : 'list';
        $data['template'] = $this->template;
        $data['post_id'] = $post->ID;
        $data['archive_url'] = get_post_type_archive_link('event');
        $data['rest_url'] = get_rest_url();
        $days_ahead = isset($data['mod_event_interval']) ? $data['mod_event_interval'] : 0;
        $data['end_date'] = date('Y-m-d', strtotime("today midnight +$days_ahead days"));
        $data['only_todays_date'] = $data['mod_events_hide_past_events'] ?? false;
        $data['lat'] = (isset($data['mod_event_geographic']['lat'])) ? $data['mod_event_geographic']['lat'] : null;
        $data['lng'] = (isset($data['mod_event_geographic']['lng'])) ? $data['mod_event_geographic']['lng'] : null;
        $data['distance'] = (isset($data['mod_event_distance'])) ? $data['mod_event_distance'] : null;
        $data['age_range'] = ($this->template == 'index') ? json_encode($this->getAgeFilterRange($id)) : $this->getAgeFilterRange($id);
        // Taxonomies filter
        $data['categories'] = ($this->template == 'index') ? json_encode($this->getFilterableCategories($id)) : $this->getFilterableCategories($id);
        $data['groups'] = ($this->template == 'index') ? json_encode($this->getModuleGroups($id)) : $this->getModuleGroups($id);
        $data['tags'] = ($this->template == 'index') ? json_encode($this->getFilterableTags($id)) : $this->getFilterableTags($id);
        // List module data
        $data['pagesCount'] = $this->countPages($id);
        $data['events'] = $this->getEvents($id, $page);
        $data['mod_event_fields'] = isset($data['mod_event_fields']) && is_array($data['mod_event_fields'])
            ? $data['mod_event_fields'] : array();
        $data['descr_limit'] = !empty($data['mod_event_descr_limit']) ? $data['mod_event_descr_limit'] : null;
        $data['date_now'] = strtotime('now');

        // Language
        $data['lang'] = $this->lang;

        $data['classes'] = !empty($this->args) ? implode(
            ' ',
            apply_filters('Modularity/Module/Classes', array('c-card--panel'), 'mod-event', $this->args)
        ) : array();

        $data['events'] = $this->setOccassion($data['events']);
        $data['events'] = $this->setLocation($data['events']);
        $data['events'] = $this->setPermalink($data['events']);
        $data['paginationList'] = $this->getPagination($data['pagesCount']);
        $data['no_events'] = translate('No events found', 'event-integration');

        return $data;
    }

    /**
     * Get events on pagination click
     */
    public function ajaxPagination()
    {
        echo \EventManagerIntegration\Helper\RenderBlade::blade(
            'partials/list',
            $this->data(),
            $this->templateDir
        );

        wp_die();
    }

    public function countPages($module_id)
    {
        $fields = json_decode(json_encode(get_fields($module_id)));

        if (isset($fields->mod_event_limit) && $fields->mod_event_limit == 0) {
            return $fields->mod_event_limit;
        }

        $max_per_page = (isset($fields->mod_event_limit)) ? $fields->mod_event_limit : 10;
        $posts = self::getEvents($module_id, 1, array('display_limit' => -1));
        $total_posts = count($posts);
        $pages = ceil($total_posts / $max_per_page);

        if (isset($fields->mod_event_pagination_limit) && $fields->mod_event_pagination_limit >= 0
            && $fields->mod_event_pagination_limit <= $pages) {
            $pages = $fields->mod_event_pagination_limit;
        }

        return $pages;
    }

    /**
     * Get included Events
     * @param  int    $module_id  Module ID
     * @param  int    $page       Pagination page number
     * @param  array  $params     Query params
     * @return array              Array with event objects
     */
    public function getEvents($module_id, $page = 1, $params = [])
    {
        $fields = json_decode(json_encode(get_fields($module_id)));
        $eventPagination = $fields->mod_event_pagination;
        $display_limit = isset($fields->mod_event_limit) ? $fields->mod_event_limit : -1;
        $days_ahead = isset($fields->mod_event_interval) ? $fields->mod_event_interval : 0;

        // Set start and end date
        $start_date = date('Y-m-d H:i:s', strtotime("today midnight"));
        $end_date = date('Y-m-d H:i:s', strtotime("tomorrow midnight +$days_ahead days") - 1);

        $mod_events_hide_past_events = $fields->mod_events_hide_past_events ?? false;
        $mod_event_only_todays_date = $fields->mod_event_only_todays_date ?? false;

        // Save categories, groups and tags IDs as arrays
        $categories = $this->getModuleCategories($module_id);
        $tags = $this->getModuleTags($module_id);
        $groups = $this->getModuleGroups($module_id);

        $taxonomies = (!empty($taxonomies)) ? $taxonomies : null;
        $default_params = array(
            'start_date' => $start_date,
            'end_date' => $end_date,
            'display_limit' => $display_limit,
            'categories' => $categories,
            'tags' => $tags,
            'groups' => $groups,
            'location' => (isset($fields->mod_event_geographic)) ? $fields->mod_event_geographic : null,
            'distance' => (isset($fields->mod_event_distance)) ? $fields->mod_event_distance : null,
            'lang' => $this->lang,
            'hide_past_events' => $mod_events_hide_past_events,
            'only_todays_date' => $mod_event_only_todays_date
        );

        $params = array_merge($default_params, $params);
        $events = \EventManagerIntegration\Helper\QueryEvents::getEventsByInterval($params, $page);

        return $events;
    }

    private function setOccassion($events)
    {
        foreach ($events as $event) {
            $occasionStart = \EventManagerIntegration\App::formatShortDate($event->start_date);
            $occasionEnd = \EventManagerIntegration\App::formatShortDate($event->end_date);
            $occasionDateFormatted = \EventManagerIntegration\App::formatEventDate($event->start_date, $event->end_date);

            $event->occasionStart = $occasionStart;
            $event->occasionEnd = $occasionEnd;
            $event->occasionDateFormatted = $occasionDateFormatted;
        }

        return $events;
    }

    private function setLocation($events)
    {
        foreach ($events as $event) {
            $event->location_name = \EventManagerIntegration\Helper\SingleEventData::getEventLocation($event->ID, $event->start_date)['title'];
        }

        return $events;
    }

    private function setPermalink($events)
    {
        foreach ($events as $event) {
            $event->permalink = esc_url(
                add_query_arg(
                    'date',
                    preg_replace('/\D/', '', $event->start_date),
                    get_permalink($event->ID)
                )
            );
        }

        return $events;
    }

    protected function getPagination($numberOfPages)
    {
        global $wp_query;
        $pagination = [];
        $archiveUrl = get_post_type_archive_link('mod-event');
        $href = '';
        $currentPage = (get_query_var('paged')) ? get_query_var('paged') : 1;

        if ($numberOfPages > 1) {
            for ($i = 1; $i <= $numberOfPages; $i++) {
                $href = $archiveUrl . '?' . $this->setQueryString($i). "#event";

                $pagination[] = array(
                    'href' => $href,
                    'label' => (string) $i
                );
            }
        }

        return \apply_filters('Municipio/Controller/Archive/prepareSearchResultObject', $pagination);
    }

    protected function setQueryString($number)
    {
        parse_str($_SERVER['QUERY_STRING'], $queryArgList);
        $queryArgList['paged'] = $number;
        $queryString = http_build_query($queryArgList) . "\n";

        return \apply_filters('Municipio/Controller/Archive/setQueryString', $queryString);
    }

    /**
     * Return categories filter
     * @param int $moduleId The module ID
     * @return array|null
     */
    public function getModuleCategories($moduleId): array
    {
        $categories = array();
        $showAllCategories = get_field('mod_event_categories_show', $moduleId);

        $moduleCategories = get_field('mod_event_categories_list', $moduleId);
        if ($showAllCategories === false && !empty($moduleCategories) && is_array($moduleCategories)) {
            $categories = $moduleCategories;
        }

        return $categories;
    }

    /**
     * Return categories available for filtering
     * @param int $moduleId The module ID
     * @return array|null
     */
    public function getFilterableCategories($moduleId): array
    {
        $categories = array();
        $showAllCategories = get_field('mod_event_categories_show', $moduleId);

        $moduleCategories = get_field('mod_event_categories_list', $moduleId);
        if ($showAllCategories === false && !empty($moduleCategories) && is_array($moduleCategories)) {
            $categories = $moduleCategories;
            foreach ($categories as $key => &$category) {
                $category = get_term($category, 'event_categories');
                // If category is missing, remove it from the list
                if (!$category) {
                    unset($categories[$key]);
                }
            }
        } else {
            $categories = get_terms(
                'event_categories',
                array(
                    'hide_empty' => false,
                )
            );
        }

        $categories = \EventManagerIntegration\Helper\Translations::filterTermsByLanguage($categories);

        foreach ($categories as &$category) {
            $category = array(
                'id' => $category->term_id,
                'title' => $category->name,
                'checked' => false,
            );
        }

        return $categories;
    }


    /**
     * Return tags available for filtering
     * @param int $moduleId The module ID
     * @return array|null
     */
    public function getFilterableTags($moduleId): array
    {
        $tags = array();
        $showAllTags = get_field('mod_event_tags_show', $moduleId);

        $moduleTags = get_field('mod_event_tags_list', $moduleId);
        if ($showAllTags === false && !empty($moduleTags) && is_array($moduleTags)) {
            $tags = $moduleTags;
            foreach ($tags as $key => &$tag) {
                $tag = get_term($tag, 'event_tags');
                // If category is missing, remove it from the list
                if (!$tag) {
                    unset($tags[$key]);
                }
            }
        } else {
            $tags = get_terms(
                'event_tags',
                array(
                    'hide_empty' => false,
                )
            );
        }

        $tags = \EventManagerIntegration\Helper\Translations::filterTermsByLanguage($tags);

        foreach ($tags as &$tag) {
            $tag = array(
                'id' => $tag->term_id,
                'title' => $tag->name,
                'checked' => false,
            );
        }

        return $tags;
    }


    /**
     * Return tags filter
     * @param int $moduleId The module ID
     * @return array|null
     */
    public function getModuleTags($moduleId): array
    {
        $tags = array();
        $showAllTags = get_field('mod_event_tags_show', $moduleId);

        $moduleTags = get_field('mod_event_tags_list', $moduleId);
        if ($showAllTags === false && !empty($moduleTags) && is_array($moduleTags)) {
            $tags = $moduleTags;
        }

        return $tags;
    }

    /**
     * Return groups filter
     * @param int $moduleId The module ID
     * @return array|null
     */
    public function getModuleGroups($moduleId): array
    {
        $groups = array();
        $showAllGroups = get_field('mod_event_groups_show', $moduleId);

        $moduleGroups = get_field('mod_event_groups_list', $moduleId);
        if ($showAllGroups === false && !empty($moduleGroups) && is_array($moduleGroups)) {
            $groups = $moduleGroups;
        }
        return $groups;
    }


    /**
     * Return list with filterable ages
     * @param int $moduleId The module ID
     * @return array
     */
    public function getAgeFilterRange($moduleId): array
    {
        $years = array();
        $from = (int)get_field('mod_event_filter_age_range_from', $moduleId);
        $to = (int)get_field('mod_event_filter_age_range_to', $moduleId);

        if ($from < $to) {
            foreach (range($from, $to) as $value) {
                $years[] = array(
                    'value' => $value,
                    'id' => $value,
                    'checked' => false,
                );
            }
        }

        return $years;
    }

    /**
     * Enqueue your scripts and/or styles with wp_enqueue_script / wp_enqueue_style
     */
    public function script()
    {
        wp_enqueue_script(
            'vendor-pagination',
            EVENTMANAGERINTEGRATION_URL.'/source/js/vendor/simple-pagination/jquery.simplePagination.min.js',
            'jquery',
            false,
            true
        );

        // Enqueue React
        \EventManagerIntegration\Helper\React::enqueue();

        wp_enqueue_script(
            'modularity-'.$this->slug,
            EVENTMANAGERINTEGRATION_URL.'/dist/'.\EventManagerIntegration\Helper\CacheBust::name(
                'js/event-integration-module-event.js'
            ),
            array('jquery', 'react', 'react-dom'),
            false,
            true
        );

        wp_enqueue_style(
            'modularity-'.$this->slug,
            EVENTMANAGERINTEGRATION_URL.'/dist/'.\EventManagerIntegration\Helper\CacheBust::name(
                'js/event-integration-module-event.css'
            ),
            array()
        );

        wp_localize_script(
            'modularity-'.$this->slug,
            'modEvent',
            array(
                'moreEvents' => __('More events', 'event-integration'),
                'noEventsFound' => __('No events found', 'event-integration'),
                'next' => __('Next', 'event-integration'),
                'prev' => __('Previous', 'event-integration'),
                'search' => __('Search', 'event-integration'),
                'from' => __('From', 'event-integration'),
                'to' => __('To', 'event-integration'),
                'date' => __('date', 'event-integration'),
                'categories' => __('Categories', 'event-integration'),
                'tags' => __('Tags', 'event-integration'),
                'age' => __('Age', 'event-integration'),
                'ageGroupDescription' => __(
                    'Filter on events that is targeted for given the age',
                    'event-integration'
                ),
                'years' => __('years', 'event-integration'),
                'selectAge' => __('Select age', 'event-integration'),
            )
        );
    }

    /**
     * Filter to show categories in default language
     * @param  array $args  An array of arguments passed to the wp_list_categories function
     * @param  array $field An array containing all the field settings
     * @return array $args
     */
    public function filterEventCategories($args, $field)
    {
        if (function_exists('pll_default_language')) {
            $args['lang'] = pll_default_language();
        }

        return $args;
    }
}
