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
                'menu_icon'            =>   'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9Ijk4NS4zMzNweCIgaGVpZ2h0PSI5ODUuMzM0cHgiIHZpZXdCb3g9IjAgMCA5ODUuMzMzIDk4NS4zMzQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDk4NS4zMzMgOTg1LjMzNDsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTg2OC41NjUsNDkyLjhjLTQuNCwyMi4xMDEtMjQsMzguMi00Ny41LDM5LjJjLTcuNCwwLjMtMTMuNyw1LjctMTUuMTAxLDEzYy0xLjUsNy4zLDIuMiwxNC43LDguOSwxNy44DQoJCWMyMS4zLDEwLDMzLjIsMzIuNCwyOC43LDU0LjVsLTQuMiwyMWMtNS41LDI3LjctMzYuMTAxLDQ1LTYyLjksMzguNGMtNy41LTEuOC0xNS4yLTMuMi0yMi44LTQuN2MtMTEuMi0yLjItMjIuNC00LjUtMzMuNi02LjcNCgkJYy0xNC44MDEtMy0yOS42MDEtNS44OTktNDQuNC04Ljg5OWMtMTcuNi0zLjUtMzUuMy03LjEwMS01Mi45LTEwLjYwMWMtMTkuNjk5LTQtMzkuMzk5LTcuODk5LTU5LjEtMTEuODk5DQoJCWMtMjEtNC4yLTQyLjEtOC40LTYzLjEtMTIuN2MtMjEuNjAxLTQuMy00My4yLTguNy02NC43LTEzYy0yMS40LTQuMy00Mi43LTguNjAxLTY0LjEwMS0xMi45Yy0yMC4zOTktNC4xLTQwLjgtOC4yLTYxLjE5OS0xMi4zDQoJCWMtMTguNy0zLjctMzcuMy03LjUtNTYtMTEuMmMtMTYuMi0zLjItMzIuNC02LjUtNDguNS05LjdjLTEyLjktMi42LTI1LjgtNS4xOTktMzguOC03LjhjLTguOS0xLjgtMTcuODAxLTMuNi0yNi43LTUuMzk5DQoJCWMtNC4xMDEtMC44MDEtOC4yLTEuNy0xMi4zLTIuNWMtMC4yLDAtMC40LTAuMTAxLTAuNjAxLTAuMTAxYzIuMiwxMC40LDEuMiwyMS41LTMuNiwzMS45Yy0xMC4xMDEsMjEuOC0zMy42MDEsMzMuMi01Ni4yLDI4LjgNCgkJYy02LjctMS4zLTE0LDEuMi0xNi45LDcuNGwtOSwxOS41Yy0yLjg5OSw2LjE5OSwwLDEzLjM5OSw1LjMwMSwxNy42OTljMSwwLjgwMSw3MjEuOCwzMzMuMTAxLDcyMi45OTksMzMzLjQNCgkJYzYuNywxLjMsMTQtMS4yLDE2LjktNy40bDktMTkuNWMyLjktNi4xOTksMC0xMy4zOTktNS4zLTE3LjY5OWMtMTgtMTQuMzAxLTI0LjYwMS0zOS42MDEtMTQuNS02MS40YzEwLjEtMjEuOCwzMy42LTMzLjIsNTYuMi0yOC44DQoJCWM2LjY5OSwxLjMsMTQtMS4yLDE2Ljg5OS03LjRsOS0xOS41YzIuOS02LjIsMC0xMy4zOTktNS4zLTE3LjdjLTE4LTE0LjMtMjQuNi0zOS42LTE0LjUtNjEuMzk5czMzLjYtMzMuMiw1Ni4yLTI4LjgNCgkJYzYuNywxLjMsMTQtMS4yLDE2LjktNy40bDktMTkuNWMyLjg5OS02LjIsMC0xMy40LTUuMzAxLTE3LjdjLTE4LTE0LjMtMjQuNi0zOS42LTE0LjUtNjEuNGMxMC4xMDEtMjEuOCwzMy42MDEtMzMuMTk5LDU2LjItMjguOA0KCQljNi43LDEuMywxNC0xLjIsMTYuOS03LjM5OWw5Ljg5OS0yMS42MDFjMi45LTYuMiwwLjItMTMuNS02LTE2LjM5OWwtMTA3LjY5OS00OS43TDg2OC41NjUsNDkyLjh6Ii8+DQoJPHBhdGggZD0iTTkuNjY1LDQ4NS45YzEuMiwwLjYsNzc5LjMsMTU2LjY5OSw3ODAuNiwxNTYuNjk5YzYuODAxLTAuMywxMy40LTQuNSwxNC43LTExLjFsNC4yLTIxYzEuMy02LjctMy4xLTEzLjEtOS4zLTE2DQoJCWMtMjAuOC05LjgtMzMuMTAxLTMyLjgtMjguNC01Ni40YzQuNy0yMy42LDI1LTQwLjEsNDgtNDEuMWM2LjgtMC4zLDEzLjQtNC41LDE0LjctMTEuMWwzLjEtMTUuNGwxLjEwMS01LjcNCgkJYzEuMy02LjctMy4xMDEtMTMuMS05LjMtMTZjLTIwLjgwMS05LjgtMzMuMTAxLTMyLjgtMjguNC01Ni4zOTljNC43LTIzLjYwMSwyNS00MC4xMDEsNDgtNDEuMTAxYzYuOC0wLjMsMTMuNC00LjUsMTQuNy0xMS4xDQoJCWw0LjItMjFjMS4zLTYuNy0zLjEwMS0xMy4xLTkuMzAxLTE2Yy0yMC44LTkuOC0zMy4xLTMyLjgtMjguMzk5LTU2LjRjNC43LTIzLjYsMjUtNDAuMSw0OC00MS4xYzYuOC0wLjMsMTMuMzk5LTQuNSwxNC43LTExLjENCgkJbDQuNjk5LTIzLjNjMS4zMDEtNi43LTMtMTMuMi05LjY5OS0xNC41YzAsMC03ODEuOS0xNTYuOC03ODIuNy0xNTYuOGMtNS44LDAtMTAuOSw0LjEtMTIuMSw5LjlsLTQuNywyMy4zDQoJCWMtMS4zLDYuNywzLjEsMTMuMSw5LjMsMTZjMjAuOCw5LjgsMzMuMSwzMi44LDI4LjQsNTYuNGMtNC43LDIzLjYtMjUsNDAuMS00OCw0MS4xYy02LjgwMSwwLjMtMTMuNCw0LjUtMTQuNywxMS4xbC00LjIsMjENCgkJYy0xLjMsNi43LDMuMSwxMy4xLDkuMywxNmMyMC44LDkuOCwzMy4xMDEsMzIuOCwyOC40LDU2LjRjLTQuNywyMy42LTI1LDQwLjEtNDgsNDEuMWMtNi44LDAuMy0xMy40LDQuNS0xNC43LDExLjFsLTQuMiwyMQ0KCQljLTEuMyw2LjcsMy4xMDEsMTMuMSw5LjMsMTZjMjAuODAxLDkuOCwzMy4xMDEsMzIuOCwyOC40LDU2LjRjLTQuNywyMy42MDEtMjUsNDAuMTAxLTQ4LDQxLjEwMWMtNi44LDAuMy0xMy40LDQuNS0xNC43LDExLjENCgkJbC00LjIsMjFDLTAuOTM1LDQ3Ni43LDMuNDY0LDQ4Myw5LjY2NSw0ODUuOXogTTY3Ni4xNjUsMjI5LjZjMi43LTEzLjUsMTUuOS0yMi4zLDI5LjQtMTkuNnMyMi4zLDE1LjksMTkuNiwyOS40bC0zMywxNjQuMg0KCQlsLTIwLjMsMTAxLjJjLTIuNCwxMS45LTEyLjgsMjAuMTAxLTI0LjUsMjAuMTAxYy0xLjYwMSwwLTMuMy0wLjItNC45LTAuNWMtMTMuNS0yLjctMjIuMy0xNS45LTE5LjYtMjkuNGwyMi43LTExMi45TDY3Ni4xNjUsMjI5LjYNCgkJeiBNMjI1LjM2NSwxMzkuMWMyLjctMTMuNSwxNS45LTIyLjMsMjkuNC0xOS42czIyLjMsMTUuOSwxOS42LDI5LjRsLTExLjQsNTYuN2wtMTIuODk5LDY0LjNsLTEwLjQsNTEuOGwtMTguNSw5Mi42DQoJCWMtMi4zOTksMTEuOS0xMi44LDIwLjEwMS0yNC41LDIwLjEwMWMtMS42LDAtMy4zLTAuMi00Ljg5OS0wLjVjLTAuNy0wLjEwMS0xLjQtMC4zMDEtMi0wLjVjLTEyLjQtMy42MDEtMjAuMTAxLTE2LjEwMS0xNy41LTI4LjkNCgkJbDMuNjk5LTE4LjdsOS43LTQ4LjRMMjI1LjM2NSwxMzkuMXoiLz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K',
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
                'supports'              =>  array('revisions'),
                // Disable create new post
                'capability_type' => 'post',
                'capabilities' => array(
                    'create_posts' => 'do_not_allow',
                ),
                'map_meta_cap' => true,
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
        $this->addTableColumn('acceptAndDeny', __('Public', 'event-manager'), false, function ($column, $postId) {
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

        add_action('init', array($this, 'registerEventCategories'));
        add_action('init', array($this, 'registerEventTags'));
        add_action('manage_posts_extra_tablenav', array($this, 'tablenavButtons'));
        add_action('wp_ajax_import_events', array($this, 'importEvents'));
        add_action('wp_ajax_accept_or_deny', array($this, 'acceptOrDeny'));

        add_filter('the_content', array($this, 'eventContent'));
        add_filter('the_lead', array($this, 'eventContentLead'));
        add_filter('query_vars', array($this, 'addDateQueryVar'));
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
     * Add image and date to single event content. Replace content if occasion has custom content.
     * @param  string $content Content of the current post.
     * @return string
     */
    public function eventContent($content)
    {
        if (! is_singular($this->slug)) {
            return $content;
        }

        global $post;

        $get_date = (! empty (get_query_var('date'))) ? get_query_var('date') : false;
        $display_image = (get_field('event_single_image', 'options')) ? get_field('event_single_image', 'options') : false;
        $thumbnail = (has_post_thumbnail() && $display_image) ? get_the_post_thumbnail() : '';

        // Add date below header
        if($get_date != false) {

            $occasions = \EventManagerIntegration\Helper\QueryEvents::getEventOccasions($post->ID, false);
            foreach ($occasions as $o) {
                $event_date = preg_replace('/\D/', '', $o->start_date);
                $date_div = '<div class="single-event-date"><p>' . date('Y-m-d', strtotime($o->start_date)) . '</p></div>';

                // Replace content with occasion custom content
                if ($get_date == $event_date && ! empty($o->content) && $o->content_mode == 'custom') {
                    $content = $date_div . $thumbnail . $o->content;
                } elseif ($get_date == $event_date) {
                    $content = $date_div . $thumbnail . $post->post_content;
                }
            }
        } else {
            $content = $thumbnail . $post->post_content;
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
        if (is_singular($this->slug)) {
            return;
        }
        return $lead;
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
     * Add buttons to start parsing event import
     * @return void
     */
    public function tablenavButtons($which)
    {
        global $current_screen;

        if ($current_screen->id != 'edit-event' || $which != 'top') {
            return;
        }

        if (current_user_can('manage_options')) {
            echo '<div class="alignleft actions" style="position: relative;">';
            echo '<div id="importevents" class="button-primary">' . __('Import', 'event-integration') . '</div>';
            // TA BORT
//echo '<a href="' . admin_url('options.php?page=import-events') . '" class="button-primary" id="post-query-submit">Debug</a>';
//echo '<a href="' . admin_url('options.php?page=delete-all-events') . '" class="button-primary" id="post-query-submit">Delete</a>';
            echo '</div>';
        }
    }

    /**
     * Start parsing event importer
     */
    public function importEvents()
    {
        global $wpdb;
        $db_table = $wpdb->prefix . "integrate_occasions";
        $occasion = $wpdb->get_results("SELECT start_date FROM $db_table ORDER BY start_date ASC LIMIT 1", OBJECT);

        $from_date = count($occasion) == 1 ? date('Y-m-d', strtotime($occasion[0]->start_date)) : date('Y-m-d');
        $days_ahead = ! empty(get_field('days_ahead', 'options')) ? absint(get_field('days_ahead', 'options')) : 30;
        $to_date = date('Y-m-d', strtotime("midnight now + {$days_ahead} days"));

        $api_url = 'http://eventmanager.dev/json/wp/v2/event/time?start=' . $from_date . '&end=' . $to_date;
        $importer = new \EventManagerIntegration\Parser\HbgEventApi($api_url);
        $data = $importer->getCreatedData();
        wp_send_json($data);
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
