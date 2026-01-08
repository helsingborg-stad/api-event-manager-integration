<?php

declare(strict_types=1);

namespace EventManagerIntegration\Admin;

class Options
{
    public function __construct()
    {
        if (function_exists('acf_add_options_sub_page')) {
            acf_add_options_sub_page(array(
                'page_title' => _x('Event Manager Integration: Settings', 'ACF', 'event-integration'),
                'menu_title' => _x('Event Manager Integration: Settings', 'Event Manager Integration settings', 'event-integration'),
                'menu_slug' => 'event-options',
                'parent_slug' => 'options-general.php',
                'capability' => 'manage_options',
                'position' => 1,
            ));
        }

        add_action('wp_ajax_save_draw_points', array($this, 'saveDrawPoints'));
        add_action('acf/render_field/type=message', array($this, 'renderAcfField'), 11, 1);
        add_filter('acf/update_value/name=event_import_from_location', array($this, 'updateLocationOption'), 10, 1);
        add_filter('acf/update_value/name=event_daily_import', array($this, 'updateCronOption'), 10, 1);

        add_filter('acf/load_field/key=field_61e1418a5107c', function ($field) {
            $field['value'] = \EventManagerIntegration\Helper\ApiUrl::buildApiUrl();
            return $field;
        });
    }

    /**
     * Add custom markup to ACF fields
     * @param $field
     */
    public function renderAcfField($field)
    {
        if ($field['key'] !== 'field_5b0e6394d6399') {
            return;
        }
        echo '<button class="button" id="clear-draw-map">' . __('Clear map', 'event-integration') . '</button><div id="draw-map-area"></div>';
    }

    /**
     * Remove area option if its not selected
     * @param  string $value   the value of the field
     * @return string          the new value
     */
    public function updateLocationOption($value)
    {
        if ($value != 'area') {
            update_option('event_import_area', null);
        }

        return $value;
    }

    /**
     * Unregister cron event when option is disabled
     * @param  string $value   the value of the field
     * @return string          the new value
     */
    public function updateCronOption($value)
    {
        if (!$value) {
            \EventManagerIntegration\Cron::removeCronJob();
        }

        return $value;
    }

    /**
     * Save area coordinates as option
     */
    public function saveDrawPoints()
    {
        if (!isset($_POST['coordinates']) && !empty($_POST['coordinates'])) {
            wp_send_json_error('Missing coordinates');
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
