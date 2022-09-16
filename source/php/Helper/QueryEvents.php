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

        // Get events in given language
        $languageId = null;
        if (function_exists('pll_the_languages') && !empty($params['lang'])) {
            $languages = pll_the_languages(array('raw' => 1, 'hide_if_empty' => 0));
            $languageId = $languages[$params['lang']]['id'] ?? null;
        }

        // Build categories string
        $categories = (!empty($params['categories']) && is_array($params['categories'])) ? implode(
            ",",
            $params['categories']
        ) : null;

        // Build tags string
        $tags = (!empty($params['tags']) && is_array($params['tags'])) ? implode(
            ",",
            $params['tags']
        ) : null;

        // Build groups string
        $groups = (!empty($params['groups']) && is_array($params['groups'])) ? implode(
            ",",
            $params['groups']
        ) : null;

        // Search by text string
        $searchString = !empty($params['search_string']) ? $params['search_string'] : null;
        $hidePastEvents = !empty($params['hide_past_events']) ? $params['hide_past_events'] : false;
        $onlyTodaysDate = !empty($params['only_todays_date']) ? $params['only_todays_date'] : false;

        // Filter by age
        $ageMin = ('' !== $params['age_min']) ? (int) $params['age_min'] : false;
        $ageMax = ('' !== $params['age_max']) ? (int) $params['age_max'] : false;

        // Calculate offset
        $page = (!is_numeric($page)) ? 1 : $page;
        $limit = intval($params['display_limit']);
        $offset = ($page - 1) * $limit;

        $db_table = $wpdb->prefix."integrate_occasions";
        $query = "
        SELECT      *, $wpdb->posts.ID AS ID
        FROM        $wpdb->posts
        LEFT JOIN   $db_table ON ($wpdb->posts.ID = $db_table.event_id) ";

        $query .= "LEFT JOIN $wpdb->postmeta AS meta2 ON ( $wpdb->posts.ID = meta2.post_id ) ";
        $query .= "LEFT JOIN $wpdb->postmeta AS meta3 ON ( $wpdb->posts.ID = meta3.post_id ) ";

        $query .= ($categories) ? "LEFT JOIN $wpdb->term_relationships term1 ON ($wpdb->posts.ID = term1.object_id) " : '';
        $query .= ($tags) ? "LEFT JOIN $wpdb->term_relationships term2 ON ($wpdb->posts.ID = term2.object_id) " : '';
        $query .= ($groups) ? "LEFT JOIN $wpdb->term_relationships term3 ON ($wpdb->posts.ID = term3.object_id) " : '';
        $query .= ($languageId) ? "LEFT JOIN $wpdb->term_relationships term4 ON ($wpdb->posts.ID = term4.object_id) " : '';

        $query .= "
        WHERE $wpdb->posts.post_type = %s
        AND $wpdb->posts.post_status = %s
        AND ($db_table.start_date BETWEEN %s AND %s OR $db_table.end_date BETWEEN %s AND %s) ";

        if ($ageMin) {
            $query .= "AND ( ( meta2.meta_key = 'age_group_from' AND meta2.meta_value <= $ageMin ) OR ( meta2.meta_key = 'age_group_from' IS NULL ) ) ";
        } 
        if ($ageMax) {
            $query .= "AND ( ( meta3.meta_key = 'age_group_to' AND meta3.meta_value >= $ageMax ) OR ( meta3.meta_key = 'age_group_to' IS NULL ) ) ";
        }

        if ($hidePastEvents) {
            $query .= "AND $db_table.end_date > '". date('Y-m-d H:i:s')."' ";
        }

        if ($onlyTodaysDate) {
            $query .= "AND $db_table.end_date <= '". date('Y-m-d H:i:s', strtotime('tomorrow - 1 second'))."' ";
        }

        $query .= ($searchString) ? "AND (($wpdb->posts.post_title LIKE %s) OR ($wpdb->posts.post_content LIKE %s))" : '';
        $query .= ($categories) ? "AND (term1.term_taxonomy_id IN ($categories)) " : '';
        $query .= ($tags) ? "AND (term2.term_taxonomy_id IN ($tags)) " : '';
        $query .= ($groups) ? "AND (term3.term_taxonomy_id IN ($groups)) " : '';
        $query .= ($languageId) ? "AND (term4.term_taxonomy_id IN ($languageId)) " : '';
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

        // Unserialize array strings and format date
        foreach ($occasions as $key => &$occasion) {
            foreach ($occasion as &$field) {
                $field = maybe_unserialize($field);
            }
            $occasion->formatted = \EventManagerIntegration\App::formatEventDate($occasion->start_date, $occasion->end_date);
            $occasion->permalink = add_query_arg(
                'date',
                preg_replace('/\D/', '', $occasion->start_date),
                get_permalink($occasion->event_id)
            );
        }

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
