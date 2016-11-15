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
     * Used to start the parsing
     */
    abstract public function start();
}
