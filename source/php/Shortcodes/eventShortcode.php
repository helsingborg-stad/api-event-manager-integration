<?php

/**
 * Shortcodes to display events with meta data
 */

namespace EventManagerIntegration\Shortcodes;

class eventShortcode
{
    public function __construct()
    {
        add_action('init', array($this, 'addShortcodes'));
    }

    // Create shortcodes
    public function addShortcodes()
    {
        add_shortcode( 'single_event_image', array($this, 'singleEventImage') );
        add_shortcode( 'single_event_information', array($this, 'singleEventInformation') );
    }

    // Shortcode to display deatured image on single event
    function singleEventImage()
    {
        global $post;
        $id = $post->ID;
        $post_type = get_post_type($id);
        if ($post_type != 'event') {
            return;
        }

        // Get custom image classes
        $class = (! empty(get_field('event_shortc_class', 'options'))) ? get_field('event_shortc_class', 'options') : '';
        $class = str_replace(' ', '', $class);
        $class = str_replace(',', ' ', $class);

        $ret = '';
        if (get_the_post_thumbnail($id)) {
            $ret .= get_the_post_thumbnail( $id, 'large', array('class' => $class));
        }

        return $ret;
    }

    // Shortcode to display event information
    public function singleEventInformation() {
        global $post;
        $id = $post->ID;
        $post_type = get_post_type($id);
        if ($post_type != 'event') {
            return;
        }

        $wrapper_class = 'grid';
        $box_class = 'grid-md-6';

        $fields = is_array(get_field('event_shortc_fields', 'options')) ? get_field('event_shortc_fields', 'options') : array();
        $get_meta = get_post_meta($id);

        $meta = array();
        foreach ($get_meta as $key => $value) {
            if (is_array($value) && count($value) == 1) {
                $meta[$key] = self::unserData($value[0]);
            } else {
                $meta[$key] = $value;
            }
        }

        $ret  = '<div class="event-info-shortcode '.$wrapper_class.'">';

        // Location
        if (in_array('location', $fields) && ! empty($meta['location'])) {
        $ret .= '<div class="shortcode-box shortcode-loc '.$box_class.'">';
            $ret .= '<ul><li><h4>'.__('Location', 'event-integration').'</h4></li></ul>';
            $location = $meta['location'];
            if (is_array($location) && ! empty($location)) {
                $ret .= '<ul>';
                $ret .= (! empty($location['title'])) ? '<li>' . $location['title'] . '</li>' : '';
                $ret .= (! empty($location['street_address'])) ? '<li>' . $location['street_address'] . '</li>' : '';
                $ret .= (! empty($location['postal_code'])) ? '<li>' . $location['postal_code'] . '</li>' : '';
                $ret .= (! empty($location['city'])) ? '<li>' . $location['city'] . '</li>' : '';
                $ret .= '</ul>';
            }
        $ret .= '</div>';
        }

        // Additional locations
        if (in_array('additional_locations', $fields) && ! empty($meta['additional_locations'])) {
        $ret .= '<div class="shortcode-box shortcode-add-loc '.$box_class.'">';
            $ret .= '<ul><li><h4>'.__('Other location', 'event-integration').'</li></ul></h4>';
            foreach ($meta['additional_locations'] as $location) {
                if (is_array($location) && ! empty($location)) {
                    $ret .= '<ul>';
                    $ret .= (! empty($location['title'])) ? '<li>' . $location['title'] . '</li>' : '';
                    $ret .= (! empty($location['street_address'])) ? '<li>' . $location['street_address'] . '</li>' : '';
                    $ret .= (! empty($location['postal_code'])) ? '<li>' . $location['postal_code'] . '</li>' : '';
                    $ret .= (! empty($location['city'])) ? '<li>' . $location['city'] . '</li>' : '';
                    $ret .= '</ul>';
                }
            }
        $ret .= '</div>';
        }


        $ret .= '</div>'; // End event-info-shortcode

        return $ret;
    }


    /**
     * Unserialize arrays
     * @param  mixed $data data to be formatted
     * @return string
     */
    public function unserData($data) {
        $unserialized = @unserialize($data);
        if ($unserialized !== false) {
            return $unserialized;
        } else {
            return $data;
        }
    }



}
