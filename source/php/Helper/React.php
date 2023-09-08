<?php

namespace EventManagerIntegration\Helper;

class React
{
    public static function enqueue()
    {
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
