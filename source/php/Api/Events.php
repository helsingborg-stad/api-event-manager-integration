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

        // Set display limit to -1 to get all events
        $params['display_limit'] = -1;

        // Save coordinates to location array
        if (!empty($params['lat']) && !empty($params['lng'])) {
            $params['location'] = array(
                'lat' => $params['lat'],
                'lng' => $params['lng'],
            );
        }

        // Get events
        $events = \EventManagerIntegration\Helper\QueryEvents::getEventsByInterval($params,1);
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

        // Set total items & pages count
        $total = count($events);
        $totalPages = 1;

        // If per page param is not unlimited, get chunk of paged items
        if ($params['per_page'] !== -1) {
            // Calculate total pages
            $totalPages = ceil($total / $params['per_page']);
            $offset = ($params['page'] - 1) * $params['per_page'];
            $offset = $offset > 0 ? $offset : 0;
            $events = array_slice($events, $offset, $params['per_page']);
        }

        // Sanitize and add meta data to items list
        $events = $this->mapEventModuleData($params['module_id'], $events);

        $response = rest_ensure_response($events);
        // Set headers with total counts
        $response->header('X-WP-Total', $total);
        $response->header('X-WP-TotalPages', $totalPages);

        return $response;
    }

    /**
     * Sanitize and adds data to event list
     * @param int   $moduleId The module ID
     * @param array $events   List of events
     * @return array
     */
    public function mapEventModuleData($moduleId, $events)
    {
        $data = get_fields($moduleId);

        $template = $data['mod_event_display'] ?? 'list';

        $class = '\EventManagerIntegration\Module\Event\TemplateController\\'.ucwords($template).'Template';

        if (class_exists($class)) {
            $controller = new $class(array(), array(), $data);
            if (is_array($data) && isset($controller->data) && is_array($controller->data)) {
                $data = array_merge($data, $controller->data);
            }
        }

        foreach ($events as &$event) {
            // Set permalink url with date parameter
            $event->permalink = esc_url(
                add_query_arg('date', preg_replace('/\D/', '', $event->start_date), get_permalink($event->ID))
            );

            // Format occasion date
            $event->occasion = \EventManagerIntegration\App::formatEventDate($event->start_date, $event->end_date);

            // Set location
            $location = get_post_meta($event->ID, 'location', true);
            $event->location = !empty($location['title']) ? $location['title'] : null;

            // Get image url
            switch ($template) {
                case 'index':
                    if (function_exists('municipio_get_thumbnail_source') && municipio_get_thumbnail_source(
                            $event->ID,
                            array($data['imageDimensions']['width'], $data['imageDimensions']['height']),
                            $data['imageRatio']
                        )) {
                        $event->image_url = municipio_get_thumbnail_source(
                            $event->ID,
                            array($data['imageDimensions']['width'], $data['imageDimensions']['height']),
                            $data['imageRatio']
                        );
                    } elseif (!empty($data['mod_event_def_image'])) {
                        $src = wp_get_attachment_image_src(
                            $data['mod_event_def_image']['ID'],
                            municipio_to_aspect_ratio(
                                $data['imageRatio'],
                                array($data['imageDimensions']['width'], $data['imageDimensions']['height'])
                            )
                        );

                        $event->image_url = $src[0] ?? null;
                    }

                    break;
                default:
                    if (function_exists('municipio_get_thumbnail_source') && municipio_get_thumbnail_source(
                            $event->ID
                        )) {
                        $event->image_url = municipio_get_thumbnail_source($event->ID);
                    } elseif (!empty($data['mod_event_def_image'])) {
                        $src = wp_get_attachment_image_src(
                            $data['mod_event_def_image']['ID']
                        );

                        $event->image_url = $src[0] ?? null;
                    }
            }

        }

        return $events;
    }
}
