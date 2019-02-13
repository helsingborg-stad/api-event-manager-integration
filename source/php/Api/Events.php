<?php

namespace EventManagerIntegration\Api;

/**
 * Class Events
 * @package EventManagerIntegration\Api
 */
class Events
{
    private $postType = 'event';

    public function __construct()
    {
        add_action('rest_api_init', array($this, 'registerRestRoutes'));
    }

    /**
     * Registers all rest routes for events
     * @return void
     */
    public function registerRestRoutes()
    {
        register_rest_route(
            'wp/v2',
            '/'.$this->postType.'/'.'module',
            array(
                'methods' => \WP_REST_Server::READABLE,
                'callback' => array($this, 'getEvents'),
                'args' => $this->getCollectionParams(),
                //'permission_callback' => array($this, 'CheckUserAuthentication'), TODO Fix permissions
            )
        );
    }

    /**
     * Get the query params for collections
     * @return array
     */
    public function getCollectionParams()
    {
        return array(
            'page' => array(
                'description' => 'Current page of the collection.',
                'type' => 'integer',
                'default' => 1,
                'sanitize_callback' => 'absint',
            ),
        );
    }

    /**
     * Get all orders for n amount of time that i own / are the customer on
     * @param object $request Object containing request details
     * @return \WP_REST_Response|array
     */
    public function getEvents($request)
    {
        $parameters = $request->get_params();

        return "lol";
    }
}
