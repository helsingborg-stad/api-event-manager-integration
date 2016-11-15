<?php

namespace EventManagerIntegration;

class App
{

    public function __construct()
    {
        add_action('wp_enqueue_scripts', array($this, 'enqueueStyles'));
        add_action('admin_enqueue_scripts', array($this, 'enqueueScripts'));

        /**
         * Init Post types
         */
        $this->eventsPostType = new PostTypes\Events();

        /**
         * Widget
         */
        new \EventManagerIntegration\Widget\DisplayEvents();

        add_action( 'widgets_init', function(){
            register_widget( 'EventManagerIntegration\Widget\DisplayEvents' );
        });

        // TA BORT
        add_action('admin_menu', array($this, 'createParsePage'));
    }

    /**
     * Enqueue required style
     * @return void
     */
    public function enqueueStyles()
    {
        wp_enqueue_style('event-manager-integration', EVENTMANAGERINTEGRATION_URL . '/dist/css/event-manager-integration.min.css', null, '1.0.0');
    }

    /**
     * Enqueue required scripts
     * @return void
     */
    public function enqueueScripts()
    {
        wp_enqueue_script('event-manager-integration', EVENTMANAGERINTEGRATION_URL . '/dist/js/event-manager-integration.min.js', null, '1.0.0', true);
        wp_localize_script('event-manager-integration', 'eventintegration', array(
            'new_data_imported' => __("New data imported", 'eventintegration'),
            'events'            => __("Events", 'eventintegration'),
            'time_until_reload' => __("Time until reload", 'eventintegration'),
            'loading'           => __("Loading", 'eventintegration'),
        ));
    }

    // TA BORT
    /**
     * Creates a admin page to trigger update data function
     * @return void
     */
    public function createParsePage()
    {
        add_submenu_page(
            null,
            __('Import events', 'event-integration'),
            __('Import events', 'event-integration'),
            'edit_posts',
            'import-events',
            function () {
                new \EventManagerIntegration\Parser\HbgEventApi('http://eventmanager.dev/json/wp/v2/event/time?start=2016-11-15&end=2016-11-23');
            });

            add_submenu_page(
            null,
            __('Delete all events', 'event-integration'),
            __('Delete all events', 'event-integration'),
            'edit_posts',
            'delete-all-events',
            function () {
                global $wpdb;
                $delete = $wpdb->query("TRUNCATE TABLE `event_postmeta`");
                $delete = $wpdb->query("TRUNCATE TABLE `event_posts`");
                $delete = $wpdb->query("TRUNCATE TABLE `event_stream`");
                $delete = $wpdb->query("TRUNCATE TABLE `event_stream_meta`");
                $delete = $wpdb->query("TRUNCATE TABLE `event_term_relationships`");
                $delete = $wpdb->query("TRUNCATE TABLE `event_term_taxonomy`");
                $delete = $wpdb->query("TRUNCATE TABLE `event_termmeta`");
                $delete = $wpdb->query("TRUNCATE TABLE `event_terms`");
            });
    }

}
