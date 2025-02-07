<?php

namespace EventManagerIntegration;

class EventArchive
{
    private $eventPostType = 'event';
    private $dbTable;
    private $db;

    public function __construct()
    {
        //Setup local wpdb instance
        global $wpdb;
        $this->db = $wpdb;
        $this->dbTable = $wpdb->prefix . "integrate_occasions";

        //Run functions if table exists
        if($this->occasionsTableExist()) {
            add_action('pre_get_posts', array($this, 'filterEvents'), 100);
        }

        add_filter('post_type_link', array($this, 'addEventDateArgsToPermalinks'), 10, 3);
        add_filter('get_the_time', array($this, 'filterEventDate'), 10, 3);

        add_filter('Municipio/Archive/showFilter', [$this, 'showFilter'], 999);
        add_filter('Municipio/Archive/getTaxonomyFilters/taxonomies', [$this, 'taxonomyFilters'], 999, 2);
        add_filter('Municipio/Helper/Post/postObject', [$this, 'getDate'], 10, 1);
    }

    private function occasionsTableExist() {
        if (wp_cache_get($this->dbTable) !== false) {
            return true;
        }
        if ($this->db->get_var("SHOW TABLES LIKE '" . $this->dbTable . "'") !== null) {
            wp_cache_set($this->dbTable, true);
            return true;
        }
        return false;
    }

    public function showFilter($enabledFilters)
    {
        $current = get_queried_object();
        if (is_a($current, 'WP_Term') && ('event_categories' === $current->taxonomy || 'event_tags' === $current->taxonomy)) {
            $enabledFilters = true;
        }
        return $enabledFilters;
    }
    public function taxonomyFilters($taxonomies, $taxonomy)
    {
        $current = get_queried_object();
        if ('event_categories' === $taxonomy || 'event_tags' === $taxonomy) {
            $taxonomies[] = $taxonomy;
        }
        return $taxonomies;
    }

    public function getDate($post)
    {
        if ($post->post_type != $this->eventPostType) {
            return $post;
        }

        if (isset($post->start_date)) {
            $post->post_date_gmt = get_gmt_from_date($post->start_date);
            $post->post_date = $post->post_date_gmt;
        } else {
            $timeNow = time();
            $eventOccasions = get_post_meta($post->ID, 'occasions_complete', true);
            
            if (empty($eventOccasions)) {
                return $post;
            }

            $selectedOccasion = array_reduce($eventOccasions, function ($carry, $item) use ($timeNow) {
                $itemTime = strtotime($item['start_date']);
                $carryTime = $carry ? strtotime($carry['start_date']) : null;
             
                if ($itemTime > $timeNow) {
                    // Select the closest future event
                    $isFirstFutureEvent = !$carry || $carryTime <= $timeNow;
                    $isEarlierFutureEvent = $carryTime && $itemTime < $carryTime;
             
                    if ($isFirstFutureEvent || $isEarlierFutureEvent) {
                        return $item;
                    }
                } else {
                    // Select the latest past event (only if no future event exists)
                    $isFirstPastEvent = !$carry;
                    $isLaterPastEvent = $carryTime && $itemTime > $carryTime;
             
                    if ($isFirstPastEvent || $isLaterPastEvent) {
                        return $item;
                    }
                }
             
                return $carry;
            }, null);

            $post->start_date = $selectedOccasion['start_date'];
            $post->post_date_gmt = get_gmt_from_date($selectedOccasion['start_date']);
            $post->post_date = $post->post_date_gmt;
        }

        return $post;
    }

    /**
     * Show event start & end date instead of publish date when calling "the_time()" within an event archive
     */
    public function filterEventDate($the_time, $d, $post)
    {
        if ($post->post_type != $this->eventPostType || !isset($post->start_date) || !isset($post->end_date)) {
            return $the_time;
        }

        if (get_option('time_format') == $d) {
            return '';
        }

        return App::formatEventDate($post->start_date, $post->end_date);
    }

    /**
     * Add date arguments to event permalink URL
     */
    public function addEventDateArgsToPermalinks($permalink, $post, $leavename)
    {
        if (!isset($post->start_date) || $post->post_type != $this->eventPostType) {
            return $permalink;
        }

        return esc_url(add_query_arg('date', preg_replace('/\D/', '', $post->start_date), $permalink));
    }

    /**
     * Filter events
     * @param  object $query object WP Query
     */
    public function filterEvents($query)
    {
        if (!is_post_type_archive($this->eventPostType)) {
            return $query;
        }

        // Run these in both admin and frontend to enshure that posts
        // will contain full dataset. This was made to add compability
        // with WordPress 6.1 cache logic.
        // See https://make.wordpress.org/core/2022/10/07/improvements-to-wp_query-performance-in-6-1/
        // for more details about this feature.
        add_filter('posts_fields', array($this, 'eventFilterSelect'));
        add_filter('posts_join', array($this, 'eventFilterJoin'));

        if (is_admin()) {
            return $query;
        }

        add_filter('posts_where', array($this, 'eventFilterWhere'), 10, 2);
        add_filter('posts_groupby', array($this, 'eventFilterGroupBy'));
        add_filter('posts_orderby', array($this, 'eventFilterOrderBy'));

        return $query;
    }

    /**
     * Select tables
     * @param  string $select Original query
     * @return string         Modified query
     */
    public function eventFilterSelect($select)
    {
        return $select . ",{$this->dbTable}.start_date,{$this->dbTable}.end_date,{$this->dbTable}.door_time,{$this->dbTable}.status,{$this->dbTable}.exception_information,{$this->dbTable}.content_mode,{$this->dbTable}.content,{$this->dbTable}.location_mode,{$this->dbTable}.location ";
    }

    /**
     * Join taxonomies and postmeta to sql statement
     * @param  string $join current join sql statement
     * @return string       updated statement
     */
    public function eventFilterJoin($join)
    {
        return $join . " LEFT JOIN {$this->dbTable} ON ({$this->db->posts}.ID = {$this->dbTable}.event_id) ";
    }

    /**
     * Add where statements
     * @param  string $where current where statement
     * @return string        updated statement
     */
    public function eventFilterWhere($where)
    {
        $fromDate = null;
        $toDate = null;

        global $wp_query;

        if (isset($_GET['from']) && !empty($_GET['from'])) {
            $fromDate = str_replace('/', '-', sanitize_text_field($_GET['from']));
            $fromDate = date('Y-m-d', strtotime($fromDate));
        }

        if (isset($_GET['to']) && !empty($_GET['to'])) {
            $toDate = str_replace('/', '-', sanitize_text_field($_GET['to']));
            $toDate = date('Y-m-d', strtotime("+1 day", strtotime($toDate)));
        }

        if (!is_null($fromDate) && !is_null($toDate)) {
            // USE BETWEEN ON START DATE
            $where = str_replace(
                "{$this->db->posts}.post_date >= '{$fromDate}'",
                "{$this->dbTable}.start_date BETWEEN CAST('{$fromDate}' AS DATE) AND CAST('{$toDate}' AS DATE)",
                $where
            );
            $where = str_replace(
                "AND {$this->db->posts}.post_date <= '{$toDate}'",
                "",
                $where
            );
        } elseif (!is_null($fromDate) || !is_null($toDate)) {
            // USE FROM OR TO
            $where = str_replace("{$this->db->posts}.post_date >=", "{$this->dbTable}.start_date >=", $where);
            $where = str_replace("{$this->db->posts}.post_date <=", "{$this->dbTable}.end_date <=", $where);
        }

        return $where;
    }

    /**
     * Add group by statement
     * @param  string $groupby current group by statement
     * @return string          updated statement
     */
    public function eventFilterGroupBy($groupby)
    {
        global $wpdb;
        $groupby = "{$wpdb->posts}.ID ,{$this->dbTable}.start_date, {$this->dbTable}.end_date";

        return $groupby;
    }

    /**
     * Add group by statement
     * @param  string $groupby current group by statement
     * @return string          updated statement
     */
    public function eventFilterOrderBy($orderby)
    {
        return "{$this->dbTable}.start_date ASC";
    }
}
