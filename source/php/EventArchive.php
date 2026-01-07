<?php

declare(strict_types=1);


namespace EventManagerIntegration;

use Municipio\PostObject\Decorators\AbstractPostObjectDecorator;
use Municipio\PostObject\PostObjectInterface;

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

        add_filter('Municipio/DecoratePostObject', [$this, 'decoratePostObjectDate'], 10, 1);
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

    public function decoratePostObjectDate(PostObjectInterface $post): PostObjectInterface
    {
        if (!is_archive() || $post->getPostType() !== $this->eventPostType || !isset($post->startDate)) {
            return $post;
        }

        $startDateTimestamp = strtotime($post->startDate);
        return EventPostObject::create($post, $startDateTimestamp);        
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
    public function eventFilterWhere($where, \WP_Query $query)
    {
        /** @var \string|string[] $postType */
        $postType = $query->get('post_type');
        $postType = is_array($postType) ? $postType : [$postType];

        if (!in_array($this->eventPostType, $postType) || $query->query['date_query'] === null) {
            return $where;
        }

        $dateQuery = $query->query['date_query'];
        $fromDate = $dateQuery['after'] ?? null;
        $toDate = $dateQuery['before'] ?? null;

        if (!is_null($fromDate) && !is_null($toDate)) {
            // USE BETWEEN ON START DATE
            $toDatePlusOneDay = date('Y-m-d', strtotime($toDate . ' +1 day'));
            $where = str_replace(
                "{$this->db->posts}.post_date >= '{$fromDate} 00:00:00'",
                "{$this->dbTable}.start_date BETWEEN CAST('{$fromDate}' AS DATE) AND CAST('{$toDatePlusOneDay}' AS DATE)",
                $where
            );
            $where = str_replace(
                "AND {$this->db->posts}.post_date <= '{$toDate} 23:59:59'",
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
