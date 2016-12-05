<?php

namespace EventManagerIntegration\Helper;

class QueryEvents
{
    /**
     * Get events with occurance date within given date range
     * @param  string       $start_date  start date range
     * @param  string       $end_date    end date range
     * @param  int          $limit       maximum events to get
     * @param  array|bool   $categories  list of categories or false
     * @return array                     result with events
     */
    public static function getEventsOccasions($start_date, $end_date, $limit, $categories)
    {
        global $wpdb;
        $categories = ($categories && is_array($categories)) ? implode(",", $categories) : false;

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

        $query .= (! $categories) ? '' : "AND ($wpdb->term_relationships.term_taxonomy_id IN ($categories))";
        $query .= "GROUP BY $db_table.start_date, $db_table.end_date ";
        $query .= "ORDER BY $db_table.start_date ASC";
        $query .= ($limit == -1) ? '' : ' LIMIT'.' '.intval($limit);

        $postType = 'event';
        $postStatus = 'publish';
        $completeQuery = $wpdb->prepare($query, $postType, $postStatus, $start_date, $end_date, $start_date, $end_date);
        $events = $wpdb->get_results($completeQuery);

        return $events;
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
