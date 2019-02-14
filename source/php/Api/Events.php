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
            'per_page' => array(
                'description' => 'Maximum number of items to be returned in result collection.',
                'type' => 'integer',
                'default' => 10,
                'sanitize_callback' => array($this, 'sanitizePerPage'),
            ),
            'start_date' => array(
                'description' => 'Get events from this date',
                'type' => 'string',
                'default' => date('Y-m-d H:i:s', strtotime("today midnight")),
                'sanitize_callback' => array($this, 'sanitizeDate'),
            ),
            'end_date' => array(
                'description' => 'Get events to this date',
                'type' => 'string',
                'default' => date('Y-m-d H:i:s', strtotime("today midnight")),
                'sanitize_callback' => array($this, 'sanitizeEndDate'),
            ),
            'taxonomies' => array(
                'description' => 'Filter by taxonomies',
                'type' => 'object',
                'default' => null,
            ),
            'lat' => array(
                'description' => 'Filter by coordinates',
                'type' => 'string',
                'default' => null,
            ),
            'lng' => array(
                'description' => 'Filter by coordinates',
                'type' => 'string',
                'default' => null,
            ),
            'distance' => array(
                'description' => 'Distance (km) radius from coordinates',
                'type' => 'float',
                'default' => null,
            ),
            'module_id' => array(
                'description' => 'The module ID',
                'type' => 'integer',
                'default' => 0,
                'sanitize_callback' => 'absint',
            ),
        );
    }

    /**
     * Sanitize date
     * @param $data
     * @return int
     */
    public function sanitizeDate($data)
    {
        $data = strtotime($data);

        if ($data == false) {
            $data = strtotime('today midnight');
        }

        return date('Y-m-d H:i:s', (int)$data);
    }

    /**
     * Sanitize end date. Add 1 day to include events occurring on end date
     * @param $data
     * @return int
     */
    public function sanitizeEndDate($data)
    {
        $data = strtotime($data);

        if ($data == false) {
            $data = strtotime('today midnight');
        }

        $data = strtotime('+1 day', $data) - 1;

        return date('Y-m-d H:i:s', $data);
    }

    /**
     * Return int between 1-100
     * @param $data
     * @return int
     */
    public function sanitizePerPage($data)
    {
        return intval($data);
    }

    /**
     * Get all events between two dates
     * @param object $request Object containing request details
     * @return array|\WP_REST_Response
     */
    public function getEvents($request)
    {
        // Get params
        $params = $request->get_params();

        // Replace per_page with display_limit for backward compatibility
        $params['display_limit'] = $params['per_page'];
        // Save coordinates to location array
        if (!empty($params['lat']) && !empty($params['lng'])) {
            $params['location'] = array(
                'lat' => $params['lat'],
                'lng' => $params['lng'],
            );
        }

        // Get events
        $events = \EventManagerIntegration\Helper\QueryEvents::getEventsByInterval($params, $params['page']);
        // Return error if result is empty
        if (empty($events)) {
            return new \WP_REST_Response(
                array(
                    'message' => __('No events could be found.', 'event-integration'),
                    'state' => 'empty_result',
                ),
                404
            );
        }

        return $events;
    }
}
