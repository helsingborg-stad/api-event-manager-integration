<?php

namespace EventManagerIntegration;

class App
{
    /* Set to 'dev' or 'min' */
    public static $assetSuffix = 'min';

    public function __construct()
    {
        add_action('admin_init', array($this, 'checkDatabaseTable'));
        add_action('wp_enqueue_scripts', array($this, 'enqueueFront'), 950);
        add_action('admin_enqueue_scripts', array($this, 'enqueueAdmin'));

        /* Register cron action */
        add_action('import_events_daily', array($this, 'importEventsCron'));

        new OAuth\OAuthAdmin();
        new OAuth\OAuthRequests();
        new PostTypes\Events();
        new Acf\AcfConfig();
        new Widget\DisplayEvents();
        new Admin\Options();
        new Admin\AdminDisplayEvent();
        new Shortcodes\SingleEvent();
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
            }
        });

        add_action('widgets_init', function () {
            register_widget('EventManagerIntegration\Widget\DisplayEvents');
        });

        add_filter('Municipio/blade/view_paths', array($this, 'addTemplatePaths'));
    }

    /**
     * Enqueue required styles and scripts for admin ui
     * @return void
     */
    public function enqueueAdmin()
    {
        // Styles
        wp_register_style('event-integration-admin', EVENTMANAGERINTEGRATION_URL . '/dist/css/event-manager-integration-admin.' . self::$assetSuffix . '.css');
        wp_enqueue_style('event-integration-admin');

        // Scripts
        wp_register_script('event-integration-admin', EVENTMANAGERINTEGRATION_URL . '/dist/js/event-integration-admin.' . self::$assetSuffix . '.js', true);
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
        wp_register_style('event-integration', EVENTMANAGERINTEGRATION_URL . '/dist/css/event-manager-integration.' . self::$assetSuffix . '.css');
        wp_enqueue_style('event-integration');

        // Scripts
        wp_register_script('event-integration', EVENTMANAGERINTEGRATION_URL . '/dist/js/event-integration.' . self::$assetSuffix . '.js', 'jquery', false, true);
        wp_localize_script('event-integration', 'eventintegration', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'apiurl' => get_field('event_api_url', 'option'),
        ));
        wp_localize_script('event-integration', 'eventIntegrationFront', array(
            'event_pagination_error' => __("Something went wrong, please try again later.", 'event-integration'),
            'email_not_matching' => __("The email addresses does not match.", 'event-integration'),
            'must_upload_image' => __("You must upload an image.", 'event-integration'),
        ));
        wp_enqueue_script('event-integration');

        // Google Maps JS Api
        if ($googleApiKey = get_field('google_geocode_key', 'option')) {
            wp_enqueue_script('google-maps-api', '//maps.googleapis.com/maps/api/js?key=' . $googleApiKey . '', array(), '', true);
        }
    }

    /**
     * Add searchable blade template paths
     * @param array $array Template paths
     */
    public function addTemplatePaths($array)
    {
        $array[] = EVENTMANAGERINTEGRATION_PATH . 'source/php/Module';
        return $array;
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
     * Start cron jobs
     * @return void
     */
    public function importEventsCron()
    {
        if (get_field('event_daily_import', 'option') == true && $apiUrl = Helper\ApiUrl::buildApiUrl()) {
            new Parser\EventManagerApi($apiUrl);
        }
    }

    public static function addCronJob()
    {
        wp_schedule_event(time(), 'hourly', 'import_events_daily');
    }

    public static function removeCronJob()
    {
        wp_clear_scheduled_hook('import_events_daily');
    }

    /**
     * Import publishing groups from Event Manager API
     * @return void
     */
    public static function importPublishingGroups()
    {
        $api_url = get_field('event_api_url', 'option');
        if ($api_url) {
            $api_url = rtrim($api_url, '/') . '/user_groups';
            new \EventManagerIntegration\Parser\EventManagerGroups($api_url);
        }
    }

    /**
     * Create database table if not exist
     * @return void
     */
    public static function checkDatabaseTable()
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'integrate_occasions';
        if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
            self::databaseCreation();
        }

        return;
    }

    /**
     * Creates event occasion database table on plugin activation
     */
    public static function databaseCreation()
    {
        global $wpdb;
        global $event_db_version;
        $table_name = $wpdb->prefix . 'integrate_occasions';
        $charset_collate = $wpdb->get_charset_collate();
        $sql = "CREATE TABLE $table_name (
        ID BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        event_id BIGINT(20) UNSIGNED NOT NULL,
        start_date DATETIME NOT NULL,
        end_date DATETIME NOT NULL,
        door_time DATETIME DEFAULT NULL,
        status VARCHAR(50) DEFAULT NULL,
        exception_information VARCHAR(400) DEFAULT NULL,
        content_mode VARCHAR(50) DEFAULT NULL,
        content LONGTEXT DEFAULT NULL,
        PRIMARY KEY  (ID)
        ) $charset_collate;";
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
        add_option('event_db_version', $event_db_version);
    }
}
