<?php

namespace EventManagerIntegration\Admin;

class Options
{
    public function __construct()
    {
        if (function_exists('acf_add_options_sub_page')) {
            acf_add_options_sub_page(array(
                'page_title'    => _x('Event Manager Integration settings', 'ACF', 'event-integration'),
                'menu_title'    => _x('Options', 'Event Manager Integration settings', 'event-integration'),
                'menu_slug'     => 'event-options',
                'parent_slug'   => 'edit.php?post_type=event',
                'capability'    => 'manage_options'
            ));
        }

        add_action('wp_ajax_save_draw_points', array($this, 'saveDrawPoints'));
    }

    /**
     * Save area coordinates as option
     */
    public function saveDrawPoints()
    {
        if (!isset($_POST['coordinates']) && !empty($_POST['coordinates'])) {
            wp_send_json_error("Missing coordinates");
        }

        $points = $_POST['coordinates'];
        // Convert coordinates to float
        foreach ($points as &$point) {
            $point = array_map('floatval', $point);
        }
        update_option('event_import_area', $points);
        wp_send_json_success($points);
    }
}
