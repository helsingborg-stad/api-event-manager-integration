<?php

namespace EventManagerIntegration;

class App
{
    public function __construct()
    {
        add_action('wp_enqueue_scripts', array($this, 'enqueueStyles'));
        add_action('admin_enqueue_scripts', array($this, 'enqueueScripts'));

        /**
         * Widget
         */
        new \EventManagerIntegration\Widget\DisplayEvents();

        add_action( 'widgets_init', function(){
            register_widget( 'EventManagerIntegration\Widget\DisplayEvents' );
        });

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
    }
}
