<?php

namespace EventManagerIntegration\Module;

class Location extends \Modularity\Module
{
    public $slug = 'location';
    public $supports = array();

    public function init()
    {
        $this->nameSingular = __('Location', 'event-integration');
        $this->namePlural = __('Locations', 'event-integration');
        $this->description = __('Displays a specific location', 'event-integration');

        add_action('add_meta_boxes_mod-' . $this->slug, array($this, 'registerMetaBoxes'), 10, 2);
        add_action('save_post_mod-' . $this->slug, array($this, 'saveLocation'), 10, 3);
    }

    public function data() : array
    {
        $fields = json_decode(json_encode(get_fields($this->ID)));
        $data['location'] = get_field('mod_location_data', $this->ID);

        $location_fields = (isset($fields->mod_location_fields) && is_array($fields->mod_location_fields)) ? $fields->mod_location_fields : array();
        $data['address'] = (in_array('address', $location_fields)) ? true : false;
        $data['open_hours'] = (in_array('open_hours', $location_fields)) ? true : false;
        $data['organizers'] = (in_array('organizers', $location_fields)) ? true : false;
        $data['prices'] = (in_array('prices', $location_fields)) ? true : false;
        $data['links'] = (in_array('links', $location_fields)) ? true : false;

        $data['classes'] = implode(' ', apply_filters('Modularity/Module/Classes', array('box', 'box-panel'), $this->post_type, $this->args));
        return $data;
    }

    /**
     * Register location meta box
     * @return void
     */
    public function registerMetaBoxes($post)
    {
        add_meta_box(
            'mod-location-meta',
            __('Choose location', 'event-integration'),
            array($this, 'renderLocationList'),
            $post->post_type,
            'normal',
            'default'
        );
    }

    /**
     * Display a list with location from API
     * @param  Obj $post Current post object
     * @return string Markup
     */
    public function renderLocationList($post)
    {
        $api_url = get_field('event_api_url', 'option');
        $location_endpoint = rtrim($api_url, '/') . '/location/complete';
        @$json = file_get_contents($location_endpoint);

        if ($json == false) {
            $markup = '<em>' . __('Something went wrong, pleae check your API url.', 'event-integration') . '</em>';
        } else {
            $locations = json_decode($json);
            $location_data = get_field('mod_location_data', $post->ID);
            $current = ($location_data) ? $location_data->id : false;

            if (!empty($locations)) {
                $markup = '<select name="mod_location">';
                foreach ($locations as $location) {
                    $selected = ($current == $location->id) ? 'selected' : '';
                    $markup .= '<option value="' . $location->id . '" ' . $selected . '>' . $location->title . '</option>';
                }
                $markup .= '</select>';
            } else {
                $markup = '<em>' . __('No locations found', 'event-integration') . '</em>';
            }
        }

        echo $markup;
    }

    /**
     * Save location module metadata on save
     * @param int   $post_id    The post ID
     * @param post  $post       The post object
     * @param bool  $update     Whether this is an existing post being updated or not
     */
    public function saveLocation($post_id, $post, $update)
    {
        $api_url = get_field('event_api_url', 'option');
        $location_endpoint = rtrim($api_url, '/') . '/location/';

        if (isset($_POST['mod_location'])) {
            $location_endpoint = rtrim($api_url, '/') . '/location/' . $_POST['mod_location'] . '?_embed';
            @$json = file_get_contents($location_endpoint);
            if ($json != false) {
                $location = json_decode($json);
                update_post_meta($post_id, 'mod_location_data', $location);
            }
        }

        return;
    }

    /**
     * Available "magic" methods for modules:
     * init()            What to do on initialization (if you must, use __construct with care, this will probably break stuff!!)
     * data()            Use to send data to view (return array)
     * style()           Enqueue style only when module is used on page
     * script            Enqueue script only when module is used on page
     * adminEnqueue()    Enqueue scripts for the module edit/add page in admin
     * template()        Return the view template (blade) the module should use when displayed
     */
}
