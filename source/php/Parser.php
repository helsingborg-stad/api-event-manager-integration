<?php

declare(strict_types=1);


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
        $results = $wpdb->get_results(
            "SELECT post_id FROM $wpdb->postmeta WHERE meta_key = '_event_manager_id' AND meta_value = $event_manager_id LIMIT 1",
            ARRAY_A
        );
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
     * Request to Api
     * @param  string $url Request Url
     * @return array|bool|\WP_Error
     */
    public static function requestApi($url)
    {
        // Dont verify ssl cert in dev mode
        $args = array(
            'timeout' => 120,
            'sslverify' => defined('DEV_MODE') && DEV_MODE == true ? false : true,
            'headers' => array(
                'ClientSolution' => 'WordPress Integration '.EVENTMANAGERINTEGRATION_ID,
                'PhpVersion' => phpversion(),
                'referrer' => get_home_url(),
            ),
        );
        $request = wp_remote_get($url, $args);
        $responseCode = wp_remote_retrieve_response_code($request);
        $body = wp_remote_retrieve_body($request);

        // Decode JSON
        $body = json_decode($body, true);

        // Return null if the request was successful but result is empty
        if (isset($body['code']) && $body['code'] === 'empty_result') {
            return null;
        }

        // Return WP_Error if response code is not 200 OK or result is empty
        if ($responseCode !== 200 || !is_array($body) || empty($body)) {
            return new \WP_Error('error', __('API request failed.', 'event-integration'));
        }

        return $body;
    }

}
