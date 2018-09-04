<?php

namespace EventManagerIntegration;

class EventArchive
{
    private $eventPostType = 'event';
    private $dbTable;

    public function __construct()
    {
        //Setup local wpdb instance
        global $wpdb;
        $this->db = $wpdb;
        $this->dbTable = $wpdb->prefix . "integrate_occasions";

        //Run functions if table exists
        if ($this->db->get_var("SHOW TABLES LIKE '" . $this->dbTable . "'") !== null) {
            add_action('pre_get_posts', array($this, 'filterEvents'), 100);
        }

        add_filter('post_type_link', array($this, 'addEventDateArgsToPermalinks'), 10, 3);
        add_filter('get_the_time', array($this, 'filterEventDate'), 10, 3);
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
        if (is_admin() || !is_post_type_archive($this->eventPostType)) {
            return $query;
        }

        $query->set('posts_per_page', 50);

        add_filter('posts_fields', array($this, 'eventFilterSelect'));
        add_filter('posts_join', array($this, 'eventFilterJoin'));
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
        return $select . ",{$this->dbTable}.start_date,{$this->dbTable}.end_date,{$this->dbTable}.door_time,{$this->dbTable}.status,{$this->dbTable}.exception_information,{$this->dbTable}.content_mode,{$this->dbTable}.content ";
    }

    /**
     * Join taxonomies and postmeta to sql statement
     * @param  string $join current join sql statement
     * @return string       updated statement
     */
    public function eventFilterJoin($join)
    {
        return $join . "LEFT JOIN {$this->dbTable} ON ({$this->db->posts}.ID = {$this->dbTable}.event_id) ";
    }

    /**
     * Add where statements
     * @param  string $where current where statement
     * @return string        updated statement
     */
    public function eventFilterWhere($where)
    {
        $from = null;
        $to = null;

        if (isset($_GET['from']) && !empty($_GET['from'])) {
            $from = sanitize_text_field($_GET['from']);
        }

        if (isset($_GET['to']) && !empty($_GET['to'])) {
            $to = date('Y-m-d', strtotime("+1 day", strtotime(sanitize_text_field($_GET['to']))));
        }

        if (!is_null($from) && !is_null($to)) {
            // USE BETWEEN ON START DATE
            $where = str_replace(
                "{$this->db->posts}.post_date >= '{$from}'",
                "{$this->dbTable}.start_date BETWEEN CAST('{$from}' AS DATE) AND CAST('{$to}' AS DATE)",
                $where
            );
            $where = str_replace(
                "AND {$this->db->posts}.post_date <= '{$to}'",
                "",
                $where
            );
        } elseif (!is_null($from) || !is_null($to)) {
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