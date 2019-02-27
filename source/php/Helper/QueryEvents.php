<?php

namespace EventManagerIntegration\Helper;

class QueryEvents
{
    /**
     * Get events with occurance date within date range and other parameters
     * @param  array       $params      array of query arguments:
     *                                  string      'start_date'    start date range
     *                                  string      'end_date'      end date range
     *                                  int         'limit'         maximum events to get
     *                                  array       'taxonomies'    array of taxonomies IDs
     *                                  object      'location'      object with location data
     *                                  string      'distance'      max distance from location
     * @param  int          $page       selected pagination page number
     * @return array                    Events list
     */
    public static function getEventsByInterval($params, $page = 1)
    {
        global $wpdb;

        $idString = null;
        // Get event near a location
        $location = !empty($params['location']) ? (array)$params['location'] : null;
        if (!empty($location['lat']) && !empty($location['lng'])) {
            $distance = (!empty($params['distance'])) ? $params['distance'] : 0;
            $locationIds = self::getNearbyLocations($location['lat'], $location['lng'], floatval($distance));
            $idString = ($locationIds) ? implode(',', array_column($locationIds, 'post_id')) : "0";
        }

        // Get taxonomy id string
        $taxonomies = (!empty($params['taxonomies']) && is_array($params['taxonomies'])) ? implode(
            ",",
            $params['taxonomies']
        ) : null;

        // Search by text string
        $searchString = !empty($params['search_string']) ? $params['search_string'] : null;

        // Filter by age
        $ageGroup = !empty($params['age']) ? $params['age'] : null;

        // Calculate offset
        $page = (!is_numeric($page)) ? 1 : $page;
        $limit = intval($params['display_limit']);
        $offset = ($page - 1) * $limit;

        $db_table = $wpdb->prefix."integrate_occasions";
        $query = "
        SELECT      *, $wpdb->posts.ID AS ID
        FROM        $wpdb->posts
        LEFT JOIN   $db_table ON ($wpdb->posts.ID = $db_table.event_id) ";
        $query .= ($ageGroup) ? "LEFT JOIN $wpdb->postmeta age_from ON $wpdb->posts.ID = age_from.post_id " : '';
        $query .= ($ageGroup) ? "LEFT JOIN $wpdb->postmeta age_to ON $wpdb->posts.ID = age_to.post_id " : '';
        $query .= "LEFT JOIN   $wpdb->term_relationships ON ($wpdb->posts.ID = $wpdb->term_relationships.object_id)
        WHERE $wpdb->posts.post_type = %s 
        AND $wpdb->posts.post_status = %s 
        AND ($db_table.start_date BETWEEN %s AND %s OR $db_table.end_date BETWEEN %s AND %s) ";
        $query .= ($ageGroup) ? "AND (age_from.meta_key = 'age_group_from' AND age_to.meta_key = 'age_group_to' AND $ageGroup BETWEEN age_from.meta_value AND age_to.meta_value) " : '';
        $query .= ($searchString) ? "AND (($wpdb->posts.post_title LIKE %s) OR ($wpdb->posts.post_content LIKE %s))" : '';
        $query .= ($taxonomies) ? "AND ($wpdb->term_relationships.term_taxonomy_id IN ($taxonomies))" : '';
        $query .= ($idString != null) ? "AND ($wpdb->posts.ID IN ($idString)) " : '';
        $query .= "GROUP BY $wpdb->posts.ID, $db_table.start_date, $db_table.end_date ";
        $query .= "ORDER BY $db_table.start_date ASC";
        $query .= ($limit == -1) ? '' : ' LIMIT'.' '.$offset.','.$limit;

        $placeholders = array(
            'event',
            'publish',
            $params['start_date'],
            $params['end_date'],
            $params['start_date'],
            $params['end_date'],
        );
        if ($searchString) {
            $placeholders[] = '%'.$wpdb->esc_like($searchString).'%';
            $placeholders[] = '%'.$wpdb->esc_like($searchString).'%';
        }

        $completeQuery = $wpdb->prepare(
            $query,
            $placeholders
        );
        $events = $wpdb->get_results($completeQuery);

        return $events;
    }

    /**
     * Get event occasions
     * @param  int $post_id post id
     * @param  bool $custom True to get occasions with custom content
     * @return array        object with occasions
     */
    public static function getEventOccasions($post_id, $custom = false)
    {
        global $wpdb;
        $db_table = $wpdb->prefix."integrate_occasions";

        $query = "
        SELECT      *
        FROM        $db_table
        WHERE       $db_table.event_id = %d
        ";
        $query .= ($custom == true) ? "AND $db_table.content_mode = 'custom'" : '';
        $query .= "ORDER BY $db_table.start_date ASC";

        $completeQuery = $wpdb->prepare($query, $post_id);
        $occasions = $wpdb->get_results($completeQuery);

        return $occasions;
    }

    /**
     * Get event meta data
     * @param  int $post_id post id
     * @return array        array with occasions
     */
    public static function getEventMeta($post_id)
    {
        global $wpdb;

        $query = "
        SELECT      *
        FROM        $wpdb->postmeta
        WHERE       $wpdb->postmeta.post_id = %s
        ";

        $completeQuery = $wpdb->prepare($query, $post_id);
        $event_meta = $wpdb->get_results($completeQuery);

        return $event_meta;
    }

    /**
     * Limits event description
     * @param  string $string content string to limit
     * @param  int    $limit  maximum number of letters
     * @return string
     */
    public static function stringLimiter($string, $limit)
    {
        if (strlen($string) <= $limit || $limit == -1) {
            return $string;
        } else {
            $y = mb_substr($string, 0, $limit, "utf-8").'...';

            return $y;
        }
    }

    /**
     * Get event that occurs nearby a locations and within given distance
     * @param  string       $lat       latitude
     * @param  string       $lng       longitude
     * @param  int/float    $distance  radius distance in km
     * @return array with locations
     */
    public static function getNearbyLocations($lat, $lng, $distance = 0)
    {
        global $wpdb;

        // Radius of the earth in kilometers.
        $earth_radius = 6371;
        $sql = $wpdb->prepare(
            "
                SELECT DISTINCT
                    latitude.post_id,
                    post.post_title,
                    latitude.meta_value as lat,
                    longitude.meta_value as lng,
                    (%s * ACOS(
                        COS(RADIANS( %s )) * COS(RADIANS(latitude.meta_value)) * COS(
                        RADIANS(longitude.meta_value) - RADIANS( %s )
                        ) + SIN(RADIANS( %s )) * SIN(RADIANS(latitude.meta_value))
                    )) AS distance
                    FROM $wpdb->posts post
                    INNER JOIN $wpdb->postmeta latitude ON post.ID = latitude.post_id
                    INNER JOIN $wpdb->postmeta longitude ON post.ID = longitude.post_id
                    AND post.post_type   = 'event'
                    AND post.post_status = 'publish'
                    AND latitude.meta_key = 'latitude'
                    AND longitude.meta_key = 'longitude'
                    HAVING distance <= %s
                    ORDER BY distance ASC",
            $earth_radius,
            $lat,
            $lng,
            $lat,
            $distance
        );

        $nearby_locations = $wpdb->get_results($sql, ARRAY_A);

        if ($nearby_locations) {
            return $nearby_locations;
        }
    }

}
