<?php

namespace EventManagerIntegration\Helper;

class React
{
    public static function enqueue()
    {
        // Use minified libraries if SCRIPT_DEBUG is turned off
        $suffix = (defined('DEV_MODE') && DEV_MODE) ? 'development' : 'production.min';
        $version = '17.0.1';

        //Enqueue react    
        wp_enqueue_script(
            'react',
            EVENTMANAGERINTEGRATION_URL . '/dist/' . \EventManagerIntegration\Helper\CacheBust::name('js/event-integration-react.js'),
            array(),
            null
        );

        wp_enqueue_script(
            'react-dom',
            EVENTMANAGERINTEGRATION_URL . '/dist/' . \EventManagerIntegration\Helper\CacheBust::name('js/event-integration-react-dom.js'),
            array(),
            null
        );

    }
}
