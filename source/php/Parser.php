<?php

namespace EventManagerIntegration;

abstract class Parser
{
    protected $url;
    protected $nrOfNewEvents;

    public function __construct($url)
    {
        ini_set('max_execution_time', 300);

        $this->url = $url;
        $this->nrOfNewEvents = 0;
        $this->start();
    }

    public function getCreatedData()
    {
        return array('events' => $this->nrOfNewEvents);
    }

    /**
     * Check if event already exist and return it's id
     * @param  [type] $event_manager_id [description]
     * @return [type]                   [description]
     */
    public function checkIfEventExists($event_manager_id)
    {
        global $wpdb;
        $results = $wpdb->get_results("SELECT post_id FROM $wpdb->postmeta WHERE meta_key = '_event_manager_id' AND meta_value = $event_manager_id LIMIT 1", ARRAY_A);
        if (!empty($results[0]['post_id'])) {
            return $results[0]['post_id'];
        } else {
            return false;
        }
    }

    /**
     * Used to start the parsing
     */
    abstract public function start();

    /**
     * Reuqest to Api
     * @param  string $url Request Url
     * @return array|bool
     */
    public static function requestApi($url)
    {
        // Dont verify ssl cert in dev mode
        $args = array(
            'timeout' => 120,
            'sslverify' => defined('DEV_MODE') && DEV_MODE == true ? false : true,
            'headers' => array(
                'ClientSolution' => 'WordPress Integration ' . EVENTMANAGERINTEGRATION_ID
                'PhpVersion' => phpversion(),
                'referrer' => get_home_url()
            )
        );
        $request        = wp_remote_get($url, $args);
        $responseCode   = wp_remote_retrieve_response_code($request);
        $body           = wp_remote_retrieve_body($request);

        // Test if response if WP_ERROR or response code is not 200 OK
        if (is_wp_error($request) || $responseCode != 200) {
            return false;
        }

        $events = json_decode($body, true);

        if (!is_array($events) || empty($events)) {
            return false;
        }

        return $events;
    }

}
