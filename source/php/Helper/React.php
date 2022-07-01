<?php

namespace EventManagerIntegration\Helper;

class React
{
    public static function enqueue()
    {

        // Un-enqueue if React files are enqueued elsewhere
        if (wp_script_is('react') || wp_script_is('react', 'registered')) {
            wp_deregister_script('react');      
            wp_dequeue_script('react');           
        }
        if (wp_script_is('react-dom') || wp_script_is('react-dom', 'registered')) {
            wp_deregister_script('react-dom'); 
            wp_dequeue_script('react-dom');   
        }

        // Use minified libraries if SCRIPT_DEBUG is turned off
        $suffix = (defined('DEV_MODE') && DEV_MODE) ? 'development' : 'production.min';
        $version = '17.0.1';

        //Enqueue react
        wp_enqueue_script('react', EVENTMANAGERINTEGRATION_URL.'/source/js/front/react/react.' . $suffix  . '.js', array(), null);
        wp_enqueue_script('react-dom', EVENTMANAGERINTEGRATION_URL.'/source/js/front/react/react-dom.' . $suffix  . '.js', array(), null);
        //wp_enqueue_script('react', 'https://unpkg.com/react@' . $version . '/umd/react.' . $suffix . '.js', array(), null);
        //wp_enqueue_script('react-dom', 'https://unpkg.com/react-dom@' . $version . '/umd/react-dom.' . $suffix . '.js', array(), null);
        

    }
}
