<?php

namespace EventManagerIntegration\PostTypes;

class Events extends \EventManagerIntegration\Entity\CustomPostType
{
    public function __construct()
    {
        parent::__construct(
            _x('Events', 'Post type plural', 'event-integration'),
            _x('Event', 'Post type singular', 'event-integration'),
            'event',
            array(
                'description'          =>   'Events',
                'menu_icon'            =>   'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiIHZpZXdCb3g9IjAgMCA5ODUuMzMzIDk4NS4zMzQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDk4NS4zMzMgOTg1LjMzNDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxwYXRoIGQ9Ik04NjguNTY1LDQ5Mi44Yy00LjQsMjIuMTAxLTI0LDM4LjItNDcuNSwzOS4yYy03LjQsMC4zLTEzLjcsNS43LTE1LjEwMSwxM2MtMS41LDcuMywyLjIsMTQuNyw4LjksMTcuOCAgIGMyMS4zLDEwLDMzLjIsMzIuNCwyOC43LDU0LjVsLTQuMiwyMWMtNS41LDI3LjctMzYuMTAxLDQ1LTYyLjksMzguNGMtNy41LTEuOC0xNS4yLTMuMi0yMi44LTQuN2MtMTEuMi0yLjItMjIuNC00LjUtMzMuNi02LjcgICBjLTE0LjgwMS0zLTI5LjYwMS01Ljg5OS00NC40LTguODk5Yy0xNy42LTMuNS0zNS4zLTcuMTAxLTUyLjktMTAuNjAxYy0xOS42OTktNC0zOS4zOTktNy44OTktNTkuMS0xMS44OTkgICBjLTIxLTQuMi00Mi4xLTguNC02My4xLTEyLjdjLTIxLjYwMS00LjMtNDMuMi04LjctNjQuNy0xM2MtMjEuNC00LjMtNDIuNy04LjYwMS02NC4xMDEtMTIuOWMtMjAuMzk5LTQuMS00MC44LTguMi02MS4xOTktMTIuMyAgIGMtMTguNy0zLjctMzcuMy03LjUtNTYtMTEuMmMtMTYuMi0zLjItMzIuNC02LjUtNDguNS05LjdjLTEyLjktMi42LTI1LjgtNS4xOTktMzguOC03LjhjLTguOS0xLjgtMTcuODAxLTMuNi0yNi43LTUuMzk5ICAgYy00LjEwMS0wLjgwMS04LjItMS43LTEyLjMtMi41Yy0wLjIsMC0wLjQtMC4xMDEtMC42MDEtMC4xMDFjMi4yLDEwLjQsMS4yLDIxLjUtMy42LDMxLjljLTEwLjEwMSwyMS44LTMzLjYwMSwzMy4yLTU2LjIsMjguOCAgIGMtNi43LTEuMy0xNCwxLjItMTYuOSw3LjRsLTksMTkuNWMtMi44OTksNi4xOTksMCwxMy4zOTksNS4zMDEsMTcuNjk5YzEsMC44MDEsNzIxLjgsMzMzLjEwMSw3MjIuOTk5LDMzMy40ICAgYzYuNywxLjMsMTQtMS4yLDE2LjktNy40bDktMTkuNWMyLjktNi4xOTksMC0xMy4zOTktNS4zLTE3LjY5OWMtMTgtMTQuMzAxLTI0LjYwMS0zOS42MDEtMTQuNS02MS40YzEwLjEtMjEuOCwzMy42LTMzLjIsNTYuMi0yOC44ICAgYzYuNjk5LDEuMywxNC0xLjIsMTYuODk5LTcuNGw5LTE5LjVjMi45LTYuMiwwLTEzLjM5OS01LjMtMTcuN2MtMTgtMTQuMy0yNC42LTM5LjYtMTQuNS02MS4zOTlzMzMuNi0zMy4yLDU2LjItMjguOCAgIGM2LjcsMS4zLDE0LTEuMiwxNi45LTcuNGw5LTE5LjVjMi44OTktNi4yLDAtMTMuNC01LjMwMS0xNy43Yy0xOC0xNC4zLTI0LjYtMzkuNi0xNC41LTYxLjRjMTAuMTAxLTIxLjgsMzMuNjAxLTMzLjE5OSw1Ni4yLTI4LjggICBjNi43LDEuMywxNC0xLjIsMTYuOS03LjM5OWw5Ljg5OS0yMS42MDFjMi45LTYuMiwwLjItMTMuNS02LTE2LjM5OWwtMTA3LjY5OS00OS43TDg2OC41NjUsNDkyLjh6IiBmaWxsPSIjRkZGRkZGIi8+PHBhdGggZD0iTTkuNjY1LDQ4NS45YzEuMiwwLjYsNzc5LjMsMTU2LjY5OSw3ODAuNiwxNTYuNjk5YzYuODAxLTAuMywxMy40LTQuNSwxNC43LTExLjFsNC4yLTIxYzEuMy02LjctMy4xLTEzLjEtOS4zLTE2ICAgYy0yMC44LTkuOC0zMy4xMDEtMzIuOC0yOC40LTU2LjRjNC43LTIzLjYsMjUtNDAuMSw0OC00MS4xYzYuOC0wLjMsMTMuNC00LjUsMTQuNy0xMS4xbDMuMS0xNS40bDEuMTAxLTUuNyAgIGMxLjMtNi43LTMuMTAxLTEzLjEtOS4zLTE2Yy0yMC44MDEtOS44LTMzLjEwMS0zMi44LTI4LjQtNTYuMzk5YzQuNy0yMy42MDEsMjUtNDAuMTAxLDQ4LTQxLjEwMWM2LjgtMC4zLDEzLjQtNC41LDE0LjctMTEuMSAgIGw0LjItMjFjMS4zLTYuNy0zLjEwMS0xMy4xLTkuMzAxLTE2Yy0yMC44LTkuOC0zMy4xLTMyLjgtMjguMzk5LTU2LjRjNC43LTIzLjYsMjUtNDAuMSw0OC00MS4xYzYuOC0wLjMsMTMuMzk5LTQuNSwxNC43LTExLjEgICBsNC42OTktMjMuM2MxLjMwMS02LjctMy0xMy4yLTkuNjk5LTE0LjVjMCwwLTc4MS45LTE1Ni44LTc4Mi43LTE1Ni44Yy01LjgsMC0xMC45LDQuMS0xMi4xLDkuOWwtNC43LDIzLjMgICBjLTEuMyw2LjcsMy4xLDEzLjEsOS4zLDE2YzIwLjgsOS44LDMzLjEsMzIuOCwyOC40LDU2LjRjLTQuNywyMy42LTI1LDQwLjEtNDgsNDEuMWMtNi44MDEsMC4zLTEzLjQsNC41LTE0LjcsMTEuMWwtNC4yLDIxICAgYy0xLjMsNi43LDMuMSwxMy4xLDkuMywxNmMyMC44LDkuOCwzMy4xMDEsMzIuOCwyOC40LDU2LjRjLTQuNywyMy42LTI1LDQwLjEtNDgsNDEuMWMtNi44LDAuMy0xMy40LDQuNS0xNC43LDExLjFsLTQuMiwyMSAgIGMtMS4zLDYuNywzLjEwMSwxMy4xLDkuMywxNmMyMC44MDEsOS44LDMzLjEwMSwzMi44LDI4LjQsNTYuNGMtNC43LDIzLjYwMS0yNSw0MC4xMDEtNDgsNDEuMTAxYy02LjgsMC4zLTEzLjQsNC41LTE0LjcsMTEuMSAgIGwtNC4yLDIxQy0wLjkzNSw0NzYuNywzLjQ2NCw0ODMsOS42NjUsNDg1Ljl6IE02NzYuMTY1LDIyOS42YzIuNy0xMy41LDE1LjktMjIuMywyOS40LTE5LjZzMjIuMywxNS45LDE5LjYsMjkuNGwtMzMsMTY0LjIgICBsLTIwLjMsMTAxLjJjLTIuNCwxMS45LTEyLjgsMjAuMTAxLTI0LjUsMjAuMTAxYy0xLjYwMSwwLTMuMy0wLjItNC45LTAuNWMtMTMuNS0yLjctMjIuMy0xNS45LTE5LjYtMjkuNGwyMi43LTExMi45TDY3Ni4xNjUsMjI5LjYgICB6IE0yMjUuMzY1LDEzOS4xYzIuNy0xMy41LDE1LjktMjIuMywyOS40LTE5LjZzMjIuMywxNS45LDE5LjYsMjkuNGwtMTEuNCw1Ni43bC0xMi44OTksNjQuM2wtMTAuNCw1MS44bC0xOC41LDkyLjYgICBjLTIuMzk5LDExLjktMTIuOCwyMC4xMDEtMjQuNSwyMC4xMDFjLTEuNiwwLTMuMy0wLjItNC44OTktMC41Yy0wLjctMC4xMDEtMS40LTAuMzAxLTItMC41Yy0xMi40LTMuNjAxLTIwLjEwMS0xNi4xMDEtMTcuNS0yOC45ICAgbDMuNjk5LTE4LjdsOS43LTQ4LjRMMjI1LjM2NSwxMzkuMXoiIGZpbGw9IiNGRkZGRkYiLz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PC9zdmc+',
                'public'               =>   true,
                'publicly_queriable'   =>   true,
                'show_ui'              =>   true,
                'show_in_nav_menus'    =>   true,
                'has_archive'          =>   true,
                'rewrite'              =>   array(
                    'slug'       =>   'event',
                    'with_front' =>   false
                ),
                'hierarchical'          =>  false,
                'exclude_from_search'   =>  false,
                'supports'              =>  is_admin() ? false : array('title'),
                // Disable create new post
                'capability_type' => 'post',
                'capabilities' => array(
                    'create_posts' => 'do_not_allow',
                ),
                'map_meta_cap' => true,
                'show_in_rest' => true,
                'rest_base'    => 'event'
            )
        );
        $this->addTableColumn('cb', '<input type="checkbox">');
        $this->addTableColumn('title', __('Title', 'event-integration'));
        $this->addTableColumn('occasion', __('Occasion', 'event-integration'), false, function ($columnKey, $postId) {
            $occasions = $this->getPostOccasions($postId);
            if (!$occasions) {
                return;
            }
            echo($occasions);
        });
        $this->addTableColumn('acceptAndDeny', __('Public', 'event-integration'), false, function ($column, $postId) {
            $post_status = get_post_status($postId);

            $first = '';
            $second = '';
            if ($post_status == 'publish') {
                $first = 'hidden';
            } elseif ($post_status == 'draft' || $post_status == 'trash') {
                $second = 'hidden';
            }
            echo '<a href="#" class="accept button-primary ' . $first . '" postid="' . $postId . '">' . __('Accept', 'event-integration') . '</a>
            <a href="#" class="deny button-primary ' . $second . '" postid="' . $postId . '">' . __('Deny', 'event-integration') . '</a>';
        });
        $this->addTableColumn('date', __('Date', 'event-integration'));
        add_action('init', array($this, 'registerEventCategories'), 1);
        add_action('init', array($this, 'registerEventTags'), 1);
        add_action('init', array($this, 'registerEventGroups'), 1);
        add_action('wp_ajax_import_events', array($this, 'importEvents'));
        add_action('wp_ajax_accept_or_deny', array($this, 'acceptOrDeny'));
        add_filter('views_edit-event', array($this, 'addImportButtons'));
        add_filter('the_content', array($this, 'eventContent'));
        add_filter('the_lead', array($this, 'eventContentLead'));
        add_filter('query_vars', array($this, 'addDateQueryVar'));

        add_filter('acf/fields/taxonomy/wp_list_categories/name=mod_event_groups_list', array($this, 'filterGroupTaxonomy'), 10, 3);
        add_filter('acf/update_value/name=event_filter_group', array($this, 'updateGroupValue'), 10, 3);
        add_filter('acf/update_value/name=mod_event_groups_list', array($this, 'updateGroupValue'), 10, 3);
        add_filter('acf/update_value/name=event_api_url', array($this, 'getUserGroups'), 10, 3);
    }

    /**
     * Import user groups when saving settings
     * @param  string $value   the value of the field
     * @param  int    $post_id the post id to save against
     * @param  array  $field   the field object
     * @return string          the new value
     */
    public function getUserGroups($value, $post_id, $field)
    {
        if (! empty($value)) {
            \EventManagerIntegration\App::importPublishingGroups();
        }

        return $value;
    }

    /**
     * Add term children to user group value
     * @param  string $value   the value of the field
     * @param  int    $post_id the post id to save against
     * @param  array  $field   the field object
     * @return string          the new value
     */
    public function updateGroupValue($value, $post_id, $field)
    {
        if (! empty($value)) {
            foreach ($value as $v) {
                $term_children = get_term_children($v, 'event_groups');
                if ($term_children) {
                    $value = array_merge($value, $term_children);
                }
            }
            $value = array_unique($value);
        }

        return $value;
    }

    /**
     * Filter to hide empty groups on module settings
     * @param  array  $args   An array of arguments passed to the wp_list_categories function
     * @param  array  $field  An array containing all the field settings
     * @return array  $args
     */
    public function filterGroupTaxonomy($args, $field)
    {
        $args['hide_empty'] = 1;
        return $args;
    }

    /**
     * Add date query var
     * @param array $vars query variables
     */
    public function addDateQueryVar($vars)
    {
        $vars[] = "date";
        return $vars;
    }

    /**
     * Replace content if occasion has custom content.
     * @param  string $content Content of the current post.
     * @return string
     */
    public function eventContent($content)
    {
        if (! is_singular($this->slug)) {
            return $content;
        }

        $custom_content = $this->getCustomContent();
        if ($custom_content) {
            $content = $custom_content;
        }

        return $content;
    }

    /**
     * Remove lead content if the occasion has custom content
     * @param  string $lead Lead content of the current post.
     * @return string
     */
    public function eventContentLead($lead)
    {
        if (! is_singular($this->slug)) {
            return $lead;
        }

        $custom_content = $this->getCustomContent();
        if ($custom_content) {
            $lead = null;
        }

        return $lead;
    }

    /**
     * Get custom occasion content
     * @return string
     */
    public function getCustomContent()
    {
        global $post;
        $get_date = (! empty(get_query_var('date'))) ? get_query_var('date') : false;

        if ($get_date != false) {
            $occasions = \EventManagerIntegration\Helper\QueryEvents::getEventOccasions($post->ID, false);
            foreach ($occasions as $o) {
                $event_date = preg_replace('/\D/', '', $o->start_date);
                // Replace content with occasion custom content
                if ($get_date == $event_date && ! empty($o->content) && $o->content_mode == 'custom') {
                    return $o->content;
                }
            }
        }
    }

    /**
     * Register event categories as taxonomy
     */
    public function registerEventCategories()
    {
        $labels = array(
            'name'                  => _x('Event categories', 'Taxonomy plural name', 'event-integration'),
            'singular_name'         => _x('Event category', 'Taxonomy singular name', 'event-integration'),
            'search_items'          => __('Search categories', 'event-integration'),
            'popular_items'         => __('Popular categories', 'event-integration'),
            'all_items'             => __('All categories', 'event-integration'),
            'parent_item'           => __('Parent category', 'event-integration'),
            'parent_item_colon'     => __('Parent category', 'event-integration'),
            'edit_item'             => __('Edit category', 'event-integration'),
            'update_item'           => __('Update category', 'event-integration'),
            'add_new_item'          => __('Add new category', 'event-integration'),
            'new_item_name'         => __('New category', 'event-integration'),
            'add_or_remove_items'   => __('Add or remove categories', 'event-integration'),
            'choose_from_most_used' => __('Choose from most used categories', 'event-integration'),
            'menu_name'             => __('Categories', 'event-integration'),
        );

        $args = array(
            'labels'                => $labels,
            'public'                => true,
            'show_in_nav_menus'     => true,
            'show_admin_column'     => true,
            'hierarchical'          => true,
            'show_tagcloud'         => true,
            'show_ui'               => false,
            'query_var'             => true,
            'rewrite'               => true
        );

        register_taxonomy('event_categories', array('event'), $args);
    }

    /**
     * Register event tags as taxonomy
     */
    public function registerEventTags()
    {
        $labels = array(
            'name'                  => _x('Event tags', 'Taxonomy plural name', 'event-integration'),
            'singular_name'         => _x('Event tag', 'Taxonomy singular name', 'event-integration'),
            'search_items'          => __('Search tags', 'event-integration'),
            'popular_items'         => __('Popular tags', 'event-integration'),
            'all_items'             => __('All tags', 'event-integration'),
            'parent_item'           => __('Parent', 'event-integration'),
            'parent_item_colon'     => __('Parent', 'event-integration'),
            'edit_item'             => __('Edit tag', 'event-integration'),
            'update_item'           => __('Update', 'event-integration'),
            'add_new_item'          => __('Add new tag', 'event-integration'),
            'new_item_name'         => __('New tag', 'event-integration'),
            'add_or_remove_items'   => __('Add or remove tags', 'event-integration'),
            'choose_from_most_used' => __('Choose from most used tags', 'event-integration'),
            'menu_name'             => __('Tags', 'event-integration'),
        );

        $args = array(
            'labels'                => $labels,
            'public'                => true,
            'show_in_nav_menus'     => true,
            'show_admin_column'     => true,
            'hierarchical'          => false,
            'show_tagcloud'         => true,
            'show_ui'               => false,
            'query_var'             => true,
            'rewrite'               => true
        );

        register_taxonomy('event_tags', array('event'), $args);
    }

    /**
     * Register event groups as taxonomy
     */
    public function registerEventGroups()
    {
        $labels = array(
            'name'                  => _x('Event groups', 'Taxonomy plural name', 'event-integration'),
            'singular_name'         => _x('Event group', 'Taxonomy singular name', 'event-integration'),
            'search_items'          => __('Search groups', 'event-integration'),
            'popular_items'         => __('Popular groups', 'event-integration'),
            'all_items'             => __('All groups', 'event-integration'),
            'parent_item'           => __('Parent group', 'event-integration'),
            'parent_item_colon'     => __('Parent group', 'event-integration'),
            'edit_item'             => __('Edit group', 'event-integration'),
            'update_item'           => __('Update group', 'event-integration'),
            'add_new_item'          => __('Add new group', 'event-integration'),
            'new_item_name'         => __('New group', 'event-integration'),
            'add_or_remove_items'   => __('Add or remove groups', 'event-integration'),
            'choose_from_most_used' => __('Choose from most used groups', 'event-integration'),
            'menu_name'             => __('Groups', 'event-integration'),
        );

        $args = array(
            'labels'                => $labels,
            'public'                => true,
            'show_in_nav_menus'     => true,
            'show_admin_column'     => true,
            'hierarchical'          => true,
            'show_tagcloud'         => true,
            'show_ui'               => false,
            'query_var'             => true,
            'rewrite'               => true
        );

        register_taxonomy('event_groups', array('event'), $args);
    }

    public function getPostOccasions($post_id)
    {
        global $wpdb;

        $db_table = $wpdb->prefix . "integrate_occasions";
        $occasions = $wpdb->get_results("SELECT start_date FROM $db_table WHERE $db_table.event_id = $post_id ORDER BY start_date ASC", ARRAY_A);

        if (count($occasions) == 0) {
            return;
        }

        return date('Y-m-d H:i', strtotime($occasions[0]['start_date']));
    }

    /**
     * Add buttons to start parsing xcap and Cbis
     * @return void
     */
    public function addImportButtons($views)
    {
        if (current_user_can('administrator')) {
            $button  = '<div class="import-buttons actions" style="position: relative;">';

            if (get_field('event_api_url', 'option')) {
                $button .= '<div id="importevents" class="button-primary">' . __('Import events', 'event-integration') . '</div>';
            }
            $button .= '</div>';
            $views['import-buttons'] = $button;
        }
        return $views;
    }

    /**event_api_url
     * Start parsing event importer
     */
    public function importEvents()
    {
        global $wpdb;
        $db_table   = $wpdb->prefix . "integrate_occasions";
        $occasion   = $wpdb->get_results(
        "SELECT     $db_table.start_date
        FROM        $db_table
        LEFT JOIN   $wpdb->posts ON ($wpdb->posts.ID = $db_table.event_id)
        WHERE       $wpdb->posts.post_type = 'event'
                    AND $wpdb->posts.post_status = 'publish'
        ORDER BY    $db_table.start_date
        ASC LIMIT 1", ARRAY_A);

        $from_date  = (is_array($occasion) && isset($occasion[0]['start_date']) && strtotime($occasion[0]['start_date']) < strtotime('now')) ? date('Y-m-d', strtotime($occasion[0]['start_date'])) : date('Y-m-d');
        $days_ahead = ! empty(get_field('days_ahead', 'options')) ? absint(get_field('days_ahead', 'options')) : 30;
        $to_date = date('Y-m-d', strtotime("midnight now + {$days_ahead} days"));

        // Get nearby events from location
        $location   = get_field('event_import_geographic', 'option');
        $latlng     = ($location) ? '&latlng=' . $location['lat'] . ',' . $location['lng'] : '';
        $distance   = (get_field('event_geographic_distance', 'option')) ? '&distance=' . get_field('event_geographic_distance', 'option') : '';

        $api_url = get_field('event_api_url', 'option');

        if ($api_url) {
            $api_url  = rtrim($api_url, '/') . '/event/time?start=' . $from_date . '&end=' . $to_date . $latlng . $distance;

            //Adds internal event parameter
            if (get_field('internal_event', 'option') == 1) {
                $api_url .= '&internal=1';
            }

            $importer = new \EventManagerIntegration\Parser\EventManagerApi($api_url);

            $data = $importer->getCreatedData();

            wp_send_json($data);
        }

        return;
    }

    /**
     * Accept or deny an event. Changes post status to draft if denied.
     * @return int $value
     */
    public function acceptOrDeny()
    {
        if (! isset($_POST['postId']) || ! isset($_POST['value'])) {
            echo _e('Something went wrong!', 'event-integration');
            die();
        }

        $postId =  $_POST['postId'];
        $value = $_POST['value'];

        $post = get_post($postId);
        if ($value == 0) {
            $post->post_status = 'draft';
        }
        if ($value == 1) {
            $post->post_status = 'publish';
        }

        $update = wp_update_post($post, true);
        if (is_wp_error($update)) {
            echo _e('Error', 'event-integration');
            die();
        }

        echo $value;
        die();
    }
}
