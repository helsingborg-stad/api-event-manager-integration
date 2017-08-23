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
        if (! empty($results[0]['post_id'])) {
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
        $events = file_get_contents($url);
        $events = json_decode($events, true);

        if (!$events || (is_object($events) && $events->code == 'Error')) {
            return false;
        }

        return $events;
    }

}
