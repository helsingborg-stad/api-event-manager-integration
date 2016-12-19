<?php

namespace EventManagerIntegration\Helper;

class QueryEvents
{
    /**
     * Get events with occurance date within date range and other parameters
     * @param  string       $start_date  start date range
     * @param  string       $end_date    end date range
     * @param  int          $limit       maximum events to get
     * @param  array|bool   $taxonomies  array of taxonomies IDs, false if not set
     * @param  int          $page        selected pagination page number
     * @return object                    post object with events
     */
    public static function getEventsByInterval($start_date, $end_date, $limit, $taxonomies = false, $page = 1)
    {
        global $wpdb;
        $taxonomies = (! empty($taxonomies) && is_array($taxonomies)) ? implode(",", $taxonomies) : false;

        // Calculate offset
        $page = (! is_numeric($page)) ?  1 : $page;
        $limit = intval($limit);
        $offset = ($page - 1) * $limit;

        $db_table = $wpdb->prefix . "integrate_occasions";
        $query = "
        SELECT      *, $wpdb->posts.ID AS ID
        FROM        $wpdb->posts
        LEFT JOIN   $db_table ON ($wpdb->posts.ID = $db_table.event_id)
        LEFT JOIN   $wpdb->term_relationships ON ($wpdb->posts.ID = $wpdb->term_relationships.object_id)
        WHERE       $wpdb->posts.post_type = %s
                    AND $wpdb->posts.post_status = %s
                    AND ($db_table.start_date BETWEEN %s AND %s OR $db_table.end_date BETWEEN %s AND %s)
        ";
        $query .= ($taxonomies) ? "AND ($wpdb->term_relationships.term_taxonomy_id IN ($taxonomies))" : '';
        $query .= "GROUP BY $db_table.start_date, $db_table.end_date ";
        $query .= "ORDER BY $db_table.start_date ASC";
        $query .= ($limit == -1) ? '' : ' LIMIT'.' '.$offset . ',' . $limit;

        $postType = 'event';
        $postStatus = 'publish';
        $completeQuery = $wpdb->prepare($query, $postType, $postStatus, $start_date, $end_date, $start_date, $end_date);
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
        $db_table = $wpdb->prefix . "integrate_occasions";

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
        if(strlen($string) <= $limit || $limit == -1) {
            return $string;
        } else {
            $y = mb_substr($string, 0, $limit, "utf-8") . '...';
            return $y;
        }
    }
}
