<?php

namespace EventManagerIntegration;

class App
{
    /* Set to 'dev' or 'min' */
    public static $assetSuffix = 'min';

    public function __construct()
    {
        add_action('wp_enqueue_scripts', array($this, 'enqueueFront'), 950);
        add_action('admin_enqueue_scripts', array($this, 'enqueueAdmin'));

        new Install();
        new Cron();
        new Api\Events();
        new OAuth\OAuthAdmin();
        new OAuth\OAuthRequests();
        new PostTypes\Events();
        new EventArchive();
        new Acf\AcfConfig();
        new Widget\DisplayEvents();
        new Admin\Options();
        new Admin\AdminDisplayEvent();
        new Admin\MediaLibrary();
        new Shortcodes\SingleEventAdmin();
        new Shortcodes\SubmitForm();

        /* Register Modularity v2 modules */
        add_action('plugins_loaded', function () {
            if (function_exists('modularity_register_module')) {
                modularity_register_module(
                    EVENTMANAGERINTEGRATION_PATH . 'source/php/Module/Event',
                    'Event'
                );

                modularity_register_module(
                    EVENTMANAGERINTEGRATION_PATH . 'source/php/Module/Location',
                    'Location'
                );

                modularity_register_module(
                    EVENTMANAGERINTEGRATION_PATH . 'source/php/Module/SubmitForm',
                    'SubmitForm'
                );

                modularity_register_module(
                    EVENTMANAGERINTEGRATION_PATH . 'source/php/Module/EventForm',
                    'EventForm'
                );
            }
        });

        add_action('widgets_init', function () {
            register_widget('EventManagerIntegration\Widget\DisplayEvents');
        });

        // Add view paths
        add_action('template_redirect', function () {
            if (get_post_type() === 'event') {
                add_filter('Municipio/blade/view_paths', array($this, 'addViewPaths'), 2, 1);
            }
        }, 10);
    }

    /**
     * Add searchable blade template paths
     * @param array  $array Template paths
     * @return array        Modified template paths
     */
    public function addViewPaths($array)
    {
        // If child theme is active, insert plugin view path after child views path.
        if (is_child_theme()) {
            array_splice($array, 2, 0, array(EVENTMANAGERINTEGRATION_VIEW_PATH));
        } else {
            // Add view path first in the list if child theme is not active.
            array_unshift($array, EVENTMANAGERINTEGRATION_VIEW_PATH);
        }

        return $array;
    }

    /**
     * Enqueue required styles and scripts for admin ui
     * @return void
     */
    public function enqueueAdmin()
    {
        // Styles
        wp_register_style(
            'event-integration-admin',
            EVENTMANAGERINTEGRATION_URL . '/dist/' . Helper\CacheBust::name('css/event-manager-integration-admin.css')
        );
        wp_enqueue_style('event-integration-admin');

        // Scripts
        wp_register_script('event-integration-admin', EVENTMANAGERINTEGRATION_URL . '/dist/' . Helper\CacheBust::name('js/event-integration-admin.js'), true);
        wp_localize_script('event-integration-admin', 'eventintegration', array(
            'ajaxurl' => admin_url('admin-ajax.php')
        ));
        wp_localize_script('event-integration-admin', 'eventIntegrationAdmin', array(
            'loading' => __("Loading", 'event-integration'),
            'options' => array(
                'areaCoordinates' => get_option('event_import_area') ? get_option('event_import_area') : null
            )
        ));
        wp_enqueue_script('event-integration-admin');

        // Re-enqueue Google Maps JS Api with additional libraries: Places, Drawing
        if (isset($_GET['page']) && $_GET['page'] === 'event-options' && $googleApiKey = get_field('google_geocode_key', 'option')) {
            wp_enqueue_script('google-maps-api', '//maps.googleapis.com/maps/api/js?key=' . $googleApiKey . '&libraries=places,drawing', array(), '', true);
        }
    }

    /**
     * Enqueue required styles and scripts on front views
     * @return void
     */
    public function enqueueFront()
    {
        // Styles
        wp_enqueue_style(
            'event-integration',
            EVENTMANAGERINTEGRATION_URL . '/dist/' . Helper\CacheBust::name('css/event-manager-integration.css')
        );

        // Scripts

        // Google Maps JS Api
        if ($googleApiKey = get_field('google_geocode_key', 'option')) {
            wp_enqueue_script('google-maps-api', '//maps.googleapis.com/maps/api/js?key=' . $googleApiKey . '', array(), '', true);
        }

        wp_register_script('auto-complete', EVENTMANAGERINTEGRATION_URL . '/source/js/vendor/auto-complete/auto-complete.min.js', 'jquery', false, true);
        wp_enqueue_script('auto-complete');

        wp_register_script('event-integration', EVENTMANAGERINTEGRATION_URL . '/dist/' . Helper\CacheBust::name('js/event-integration-front.js'), 'jquery', false, true);
        wp_localize_script('event-integration', 'eventintegration', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'apiurl' => get_field('event_api_url', 'option'),
        ));
        wp_localize_script('event-integration', 'eventIntegrationFront', array(
            'event_pagination_error' => __("Something went wrong, please try again later.", 'event-integration'),
            'email_not_matching' => __("The email addresses does not match.", 'event-integration'),
            'must_upload_image' => __("You must upload an image.", 'event-integration'),
            'select_string' => __('Select...', 'event-integration'),
            'event_submitted_message' => __('The event has been submitted!', 'event-integration'),
            'event_end_date_invalid' => __('End date can not be before or equal to the start date.', 'event-integration')
        ));
        wp_enqueue_script('event-integration');
    }

    /**
     * Format start and end date
     * @param  string $start_date occasion start date
     * @param  string $end_date   occasion end date
     * @return string             formatted date
     */
    public static function formatEventDate($start_date, $end_date)
    {
        $start = date('Y-m-d H:i:s', strtotime($start_date));
        $end = date('Y-m-d H:i:s', strtotime($end_date));
        $date = mysql2date('j F Y, H:i', $start, true) . ' ' . __('to', 'event-integration') . ' ' . mysql2date('j F Y, H:i', $end, true);
        if (date('Y-m-d', strtotime($start)) == date('Y-m-d', strtotime($end))) {
            $date = mysql2date('j F Y, H:i', $start, true) . ' - ' . mysql2date('H:i', $end, true);
        }

        return $date;
    }

    /**
     * Format short start date
     * @param  string $start_date occasion start date
     * @return array              date values
     */
    public static function formatShortDate($start_date)
    {
        $start = date('Y-m-d H:i:s', strtotime($start_date));
        $today = (date('Ymd') == date('Ymd', strtotime($start_date))) ? true : false;
        $date = array(
            'today' => $today,
            'date' => mysql2date('j', $start, true),
            'month' => substr(mysql2date('F', $start, true), 0, 3),
            'time' => mysql2date('H:i', $start, true),
        );

        return $date;
    }

    /**
     * Format start and end date
     * @param  string $start_date occasion start date
     * @return string             formatted date
     */
    public static function formatDoorTime($door_time)
    {
        $start = date('Y-m-d H:i:s', strtotime($door_time));
        $date = mysql2date('j F Y', $start, true) . ', ' . mysql2date('H:i', $start, true);
        return $date;
    }


    /**
     * Format an event price
     * @param  number $price The price to format
     * @return string 
     */
    public static function formatPrice($price)
    {
        if ($price === 0) {
            $price = _x('Free', 'Free event entrance', 'event-integration');
        } elseif ($price !== '') {
            $price .= ' kr';
        }

        return $price;
    }

    /**
     * Import publishing groups from Event Manager API
     * @return void
     */
    public static function importPublishingGroups()
    {
        $apiUrl = get_field('event_api_url', 'option');
        if ($apiUrl) {
            $apiUrl = rtrim($apiUrl, '/') . '/user_groups';
            new Parser\EventManagerGroups($apiUrl);
        }
    }
}
