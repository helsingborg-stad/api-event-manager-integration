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
        $this->template = !empty($data['mod_event_display']) ? $data['mod_event_display'] : 'list';
        $data['template'] = $this->template;
        $data['archive_url'] = get_post_type_archive_link('event');
        $data['rest_url'] = get_rest_url();
        $days_ahead = isset($data['mod_event_interval']) ? $data['mod_event_interval'] : 0;
        $data['end_date'] = date('Y-m-d', strtotime("today midnight +$days_ahead days"));
        $data['lat'] = (isset($data['mod_event_geographic']['lat'])) ? $data['mod_event_geographic']['lat'] : null;
        $data['lng'] = (isset($data['mod_event_geographic']['lng'])) ? $data['mod_event_geographic']['lng'] : null;
        $data['distance'] = (isset($data['mod_event_distance'])) ? $data['mod_event_distance'] : null;

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
     * @param  int  $module_id Module ID
     * @param  int  $page      Pagination page number
     * @param  bool $useLimit  True = limit by setting, false = get all
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
        $taxonomies = array();
        if (isset($fields->mod_event_categories_show) && $fields->mod_event_categories_show == false && isset($fields->mod_event_categories_list) && !empty($fields->mod_event_categories_list)) {
            foreach ($fields->mod_event_categories_list as $v) {
                $taxonomies[] = $v;
            }
        }
        if (isset($fields->mod_event_groups_show) && $fields->mod_event_groups_show == false && isset($fields->mod_event_groups_list) && !empty($fields->mod_event_groups_list)) {
            foreach ($fields->mod_event_groups_list as $v) {
                $taxonomies[] = $v;
            }
        }
        if (isset($fields->mod_event_tags_show) && $fields->mod_event_tags_show == false && isset($fields->mod_event_tags_list) && !empty($fields->mod_event_tags_list)) {
            foreach ($fields->mod_event_tags_list as $v) {
                $taxonomies[] = $v;
            }
        }

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
                array('jquery', 'react', 'react-dom')
            );

            wp_localize_script(
                'modularity-'.$this->slug,
                'modEvent',
                array(
                    'moreEvents' => __('More events', 'event-integration'),
                    'noEventsFound' => __('No events found', 'event-integration'),
                )
            );

        }
    }

    /**
     * Available "magic" methods for modules:
     * init()            What to do on initialization (if you must, use __construct with care, this will probably break
     * stuff!!) data()            Use to send data to view (return array) style()           Enqueue style only when
     * module is used on page script            Enqueue script only when module is used on page adminEnqueue()
     * Enqueue scripts for the module edit/add page in admin template()        Return the view template (blade) the
     * module should use when displayed
     */
}
