<?php

namespace EventManagerIntegration\Module;

class Event extends \Modularity\Module
{
    public $slug = 'event';
    public $supports = array();
    public $templateDir = EVENTMANAGERINTEGRATION_PATH.'source/php/Module/Event/views/';
    public $template;

    public function init()
    {
        $this->nameSingular = __('Event', 'event-integration');
        $this->namePlural = __('Events', 'event-integration');
        $this->description = __('Outputs a list if upcoming events', 'event-integration');

        add_action('wp_ajax_nopriv_ajax_pagination', array($this, 'ajaxPagination'));
        add_action('wp_ajax_ajax_pagination', array($this, 'ajaxPagination'));
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
        $page = (!empty($_POST['page'])) ? $_POST['page'] : 1;
        $data = get_fields($id);

        // Cards module data
        $data['settings'] = $data;
        $data['nonce'] = wp_create_nonce('wp_rest');
        $this->template = !empty($data['mod_event_display']) ? $data['mod_event_display'] : 'list';
        $data['template'] = $this->template;
        $data['archive_url'] = get_post_type_archive_link('event');
        $data['rest_url'] = get_rest_url();
        $days_ahead = isset($data['mod_event_interval']) ? $data['mod_event_interval'] : 0;
        $data['start_date'] = date('Y-m-d', strtotime("now"));
        $data['end_date'] = date('Y-m-d', strtotime("today midnight +$days_ahead days"));
        $data['lat'] = (isset($data['mod_event_geographic']['lat'])) ? $data['mod_event_geographic']['lat'] : null;
        $data['lng'] = (isset($data['mod_event_geographic']['lng'])) ? $data['mod_event_geographic']['lng'] : null;
        $data['distance'] = (isset($data['mod_event_distance'])) ? $data['mod_event_distance'] : null;
        $data['age_range'] = $this->getAgeFilterRange($id);
        // Taxonomies filter
        $data['categories'] = $this->getFilterableCategories($id);
        $data['groups'] = $this->getModuleGroups($id);
        $data['tags'] = $this->getModuleTags($id);

        // List module data
        $data['pagesCount'] = $this->countPages($id);
        $data['events'] = $this->getEvents($id, $page);
        $data['mod_event_fields'] = isset($data['mod_event_fields']) && is_array($data['mod_event_fields'])
            ? $data['mod_event_fields'] : array();
        $data['descr_limit'] = !empty($data['mod_event_descr_limit']) ? $data['mod_event_descr_limit'] : null;
        $data['date_now'] = strtotime('now');

        $data['classes'] = !empty($this->args) ? implode(
            ' ',
            apply_filters('Modularity/Module/Classes', array('box', 'box-panel'), 'mod-event', $this->args)
        ) : array();

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
        $events = self::getEvents($module_id, 1, false);
        $total_posts = count($events);  //Total number of posts returned
        $pages = ceil($total_posts / $max_per_page);

        if (isset($fields->mod_event_pagination_limit) && $fields->mod_event_pagination_limit >= 0
            && $fields->mod_event_pagination_limit <= $pages) {
            $pages = $fields->mod_event_pagination_limit;
        }

        return $pages;
    }

    /**
     * Get included Events
     * @param  int $module_id Module ID
     * @param  int $page      Pagination page number
     * @param  bool $useLimit True = limit by setting, false = get all
     * @return array             Array with event objects
     */
    public function getEvents($module_id, $page = 1, $useLimit = true)
    {
        $fields = json_decode(json_encode(get_fields($module_id)));
        $display_limit = ($useLimit == true && isset($fields->mod_event_limit)) ? $fields->mod_event_limit : -1;
        $days_ahead = isset($fields->mod_event_interval) ? $fields->mod_event_interval : 0;

        // Set start and end date
        $start_date = date('Y-m-d H:i:s', strtotime("today midnight"));
        $end_date = date('Y-m-d H:i:s', strtotime("tomorrow midnight +$days_ahead days") - 1);

        // Save categories, groups and tags IDs to array
        $taxonomies = array_merge(
            $this->getModuleCategories($module_id),
            $this->getModuleGroups($module_id),
            $this->getModuleTags($module_id)
        );

        $taxonomies = (!empty($taxonomies)) ? $taxonomies : null;
        $params = array(
            'start_date' => $start_date,
            'end_date' => $end_date,
            'display_limit' => $display_limit,
            'taxonomies' => $taxonomies,
            'location' => (isset($fields->mod_event_geographic)) ? $fields->mod_event_geographic : null,
            'distance' => (isset($fields->mod_event_distance)) ? $fields->mod_event_distance : null,
        );

        $events = \EventManagerIntegration\Helper\QueryEvents::getEventsByInterval($params, $page);

        return $events;
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
            foreach ($categories as &$category) {
                $category = get_term($category, 'event_categories');
            }
        } else {
            $categories = get_terms(
                'event_categories',
                array(
                    'hide_empty' => false,
                )
            );
        }

        foreach ($categories as &$category) {
            $category = array(
                'id' => $category->term_id,
                'title' => $category->name,
                'checked' => true,
            );
        }

        return $categories;
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
     * Return list with filterable ages
     * @param int $moduleId The module ID
     * @return array
     */
    public function getAgeFilterRange($moduleId): array
    {
        $years = array();
        $from = (int) get_field('mod_event_filter_age_range_from', $moduleId);
        $to = (int) get_field('mod_event_filter_age_range_to', $moduleId);

        if ($from < $to) {
            foreach(range($from, $to) as $value) {
                $years[] = array(
                    'value' => $value,
                    'checked' => false
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

        if ($this->template === 'index') {
            // Enqueue React
            class_exists('\Modularity\Helper\React') ?
                \Modularity\Helper\React::enqueue() :
                \EventManagerIntegration\Helper\React::enqueue();

            wp_enqueue_script(
                'modularity-'.$this->slug,
                EVENTMANAGERINTEGRATION_URL.'/dist/'.\EventManagerIntegration\Helper\CacheBust::name(
                    'js/Module/Event/Index.js'
                ),
                array('jquery', 'react', 'react-dom'),
                false,
                true
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
    }
}
