<?php

/**
 * Shortcodes to display events with meta data
 */

namespace EventManagerIntegration\Shortcodes;

class SingleEvent
{
    public function __construct()
    {
        add_action('init', array($this, 'addShortcodes'));
    }

    // Create shortcodes
    public function addShortcodes()
    {
        add_shortcode('single_event_information', array($this, 'singleEventInformation'));
    }

    // Shortcode to display complete event information
    public function singleEventInformation()
    {
        global $post;
        $id = $post->ID;
        $post_type = get_post_type($id);
        if ($post_type != 'event') {
            return;
        }

        // Get custom wrapper and div box classes
        $class = (! empty(get_field('event_shortc_wrapper', 'options'))) ? get_field('event_shortc_wrapper', 'options') : '';
        $class = str_replace(' ', '', $class);
        $wrapper_class = str_replace(',', ' ', $class);

        $class = (! empty(get_field('event_shortc_inner', 'options'))) ? get_field('event_shortc_inner', 'options') : '';
        $class = str_replace(' ', '', $class);
        $box_class = str_replace(',', ' ', $class);

        $fields = is_array(get_field('event_shortc_fields', 'options')) ? get_field('event_shortc_fields', 'options') : array();
        $get_meta = get_post_meta($id);

        $occasions = \EventManagerIntegration\Helper\QueryEvents::getEventOccasions($id);

        $query_var_date = (! empty (get_query_var('date'))) ? get_query_var('date') : false;

        $meta = array();
        foreach ($get_meta as $key => $value) {
            if (is_array($value) && count($value) == 1) {
                $meta[$key] = self::unserData($value[0]);
            } else {
                $meta[$key] = $value;
            }
        }

        $ret  = '<div class="event-info-shortcode '.$wrapper_class.'">';

        // Information
        if (in_array('information', $fields)) {
            $ret .= '<div class="shortcode-box shortcode-information '.$box_class.'">';
            $ret .= '<ul><li><h3>'.__('Information', 'event-integration').'</h3></li></ul>';

            // Get current occasion
            if ($query_var_date) {
                foreach ($occasions as $occasion) {
                    $event_date = preg_replace('/\D/', '', $occasion->start_date);
                    if ($query_var_date == $event_date) {
                        $ret .= '<ul>';
                        $ret .= '<li><strong>' . __('Occasion', 'event-integration') . '</strong></li>';
                        $ret .= (! empty($occasion->start_date) && ! empty($occasion->end_date)) ? '<li>' . \EventManagerIntegration\App::formatEventDate($occasion->start_date, $occasion->end_date) . '</li>' : '';
                        $ret .= '<li><strong>' . __('Door time', 'event-integration') . '</strong></li>';
                        $ret .= (! empty($occasion->door_time)) ? '<li>' . \EventManagerIntegration\App::formatDoorTime($occasion->door_time) . '</li>' : '';
                        $ret .= '</ul>';
                    }
                }
            }

            if (! empty($meta['categories']) && is_array($meta['categories'])) {
                $ret .= '<ul><li><strong>' . __('Categories', 'event-integration') . '</strong></li></ul>';
                $ret .= '<ul><li>' . implode(', ', $meta['categories']) . '</li></ul>';
            }

            if (! empty($meta['event_link'])) {
                $ret .= '<ul><li><strong>' . __('Link', 'event-integration') . '</strong></li></ul>';
                $ret .= '<ul><li>' . $meta['event_link'] . '</ul></li>';
            }

            if (! empty($meta['additional_links']) && is_array($meta['additional_links'])) {
                $ret .= '<ul><li><strong>' . __('Other links', 'event-integration') . '</strong></li></ul>';
                $ret .= '<ul>';
                foreach ($meta['additional_links'] as $link) {
                    $ret .= '<li>' . $link['link'] . '</li>';
                }
                $ret .= '</ul>';
            }
            if (! empty($meta['related_events']) && is_array($meta['related_events'])) {
                $ret .= '<ul><li><strong>'.__('Related events', 'event-integration').'</strong></li></ul>';
                $ret .= '<ul>';
                foreach ($meta['related_events'] as $event) {
                    $ret .= '<li>' . $event['post_title'] . '</li>';
                }
                $ret .= '</ul>';
            }
            $ret .= '</ul>';
            $ret .= '</div>';
        }

        // Location
        if (in_array('location', $fields) && ! empty($meta['location']['title'])) {
            $ret .= '<div class="shortcode-box shortcode-location '.$box_class.'">';
            $ret .= '<ul><li><h3>'.__('Location', 'event-integration').'</h3></li></ul>';
            $location = $meta['location'];
            if (is_array($location) && ! empty($location)) {
                $ret .= '<ul>';
                $ret .= (! empty($location['title'])) ? '<li><strong>' . $location['title'] . '</strong></li>' : '';
                $ret .= (! empty($location['street_address'])) ? '<li>' . $location['street_address'] . '</li>' : '';
                $ret .= (! empty($location['postal_code'])) ? '<li>' . $location['postal_code'] . '</li>' : '';
                $ret .= (! empty($location['city'])) ? '<li>' . $location['city'] . '</li>' : '';
                $ret .= '</ul>';
            }
        // Additional locations
        if (in_array('additional_locations', $fields) && ! empty($meta['additional_locations'])) {
            $ret .= '<ul><li><h4>'.__('Other locations', 'event-integration').'</li></ul></h4>';
            if (is_array($meta['additional_locations']) && ! empty($meta['additional_locations'])) {
                foreach ($meta['additional_locations'] as $location) {
                    $ret .= '<ul>';
                    $ret .= (! empty($location['title'])) ? '<li><strong>' . $location['title'] . '</strong></li>' : '';
                    $ret .= (! empty($location['street_address'])) ? '<li>' . $location['street_address'] . '</li>' : '';
                    $ret .= (! empty($location['postal_code'])) ? '<li>' . $location['postal_code'] . '</li>' : '';
                    $ret .= (! empty($location['city'])) ? '<li>' . $location['city'] . '</li>' : '';
                    $ret .= '</ul>';
                }
            }
        }
            $ret .= '</div>';
        }

        // Booking information
        if (in_array('booking', $fields)) {
            $ret .= '<div class="shortcode-box shortcode-booking '.$box_class.'">';
            $ret .= '<ul><li><h3>'.__('Booking information', 'event-integration').'</h3></li></ul>';
            $ret .= '<ul>';
            $ret .= (! empty($meta['booking_link'])) ? '<li>' . $meta['booking_link'] . '</li>' : '';
            $ret .= (! empty($meta['booking_phone'])) ? '<li>' . $meta['booking_phone'] . '</li>' : '';
            $ret .= (! empty($meta['age_restriction'])) ? '<li>' . __('Age restriction', 'event-manager') . ': ' . $meta['age_restriction'] . '</li>' : '';
            $ret .= (! empty($meta['price_adult'])) ? '<li>' . __('Price adult', 'event-manager') . ': ' . $meta['price_adult'] . '</li>' : '';
            $ret .= (! empty($meta['price_children'])) ? '<li>' . __('Price children', 'event-manager') . ': ' . $meta['price_children'] . '</li>' : '';
            $ret .= (! empty($meta['children_age'])) ? '<li>' . __('Children price is valid up to', 'event-manager') . ': ' . $meta['children_age'] . '</li>' : '';
            $ret .= (! empty($meta['price_student'])) ? '<li>' . __('Price student', 'event-manager') . ': ' . $meta['price_student'] . '</li>' : '';
            $ret .= (! empty($meta['price_senior'])) ? '<li>' . __('Price senior', 'event-manager') . ': ' . $meta['price_senior'] . '</li>' : '';
            $ret .= (! empty($meta['senior_age'])) ? '<li>' . __('Senior price is valid from', 'event-manager') . ': ' . $meta['senior_age'] . '</li>' : '';
            $ret .= '</ul>';
            $ret .= '</ul>';
            if (! empty($meta['booking_group']) && is_array($meta['booking_group'])) {
                $ret .= '<ul><li><strong>'.__('Group prices', 'event-integration').'</strong></li></ul>';
                $ret .= '<ul>';
                foreach ($meta['booking_group'] as $group) {
                    $ret .= '<li>' . $group['min_persons'] . ' - ' . $group['max_persons'] . ' '. 'persons' . ', ' . $group['price_group'] . '</li>';
                }
                $ret .= '</ul>';
            }
            $ret .= '</ul>';
            if (! empty($meta['membership_cards']) && is_array($meta['membership_cards'])) {
                $ret .= '<ul><li><strong>'.__('Included in membership cards', 'event-integration').'</strong></li></ul>';
                $ret .= '<ul>';
                foreach ($meta['membership_cards'] as $card) {
                    $ret .= '<li>' . $card['post_title'] . '</li>';
                }
                $ret .= '</ul>';
            }
            $ret .= (! empty($meta['price_information'])) ? '<ul><li><strong>' . __('Price information', 'event-manager') . '</strong></li></ul><ul><li> ' . $meta['price_information'] . '</li></ul>' : '';
            $ret .= (! empty($meta['ticket_includes'])) ? '<ul><li><strong>' . __('Ticket includes', 'event-manager') . '</strong></li></ul><ul><li> ' . $meta['ticket_includes'] . '</li></ul>' : '';
            $ret .= '</div>';
        }

        // Organizers
        if (! empty($meta['organizers']) && in_array('organizers', $fields)) {
            $ret .= '<div class="shortcode-box shortcode-organizer '.$box_class.'">';
            $ret .= '<ul><li><h3>'.__('Organizer', 'event-integration').'</h3></li></ul>';
            if (! empty($meta['organizers']) && is_array($meta['organizers'])) {
                foreach ($meta['organizers'] as $organizer) {
                        $ret .= '<ul>';
                        $ret .= (! empty($organizer['organizer'])) ? '<li>' . $organizer['organizer'] . '</li>' : '';
                        $ret .= (! empty($organizer['organizer_link'])) ? '<li>' . $organizer['organizer_link'] . '</li>' : '';
                        $ret .= (! empty($organizer['organizer_phone'])) ? '<li>' . $organizer['organizer_phone'] . '</li>' : '';
                        $ret .= '</ul>';
                }

            // Sponsors
            if (in_array('sponsors', $fields) && ! empty($meta['supporters'])) {
                $ret .= '<ul><li><h4>'.__('Sponsors', 'event-integration').'</li></ul></h4>';
                if (is_array($meta['supporters']) && ! empty($meta['supporters'])) {
                    foreach ($meta['supporters'] as $sponsor) {
                        $ret .= '<ul>';
                        $ret .= (! empty($sponsor['post_title'])) ? '<li>' . $sponsor['post_title'] . '</li>' : '';
                        $ret .= '</ul>';
                    }
                }
            }
                $ret .= '</div>';
            }
        }

        // Occasions
        if (in_array('occasion', $fields)) {
            $ret .= '<div class="shortcode-box shortcode-occasions '.$box_class.'">';
            $ret .= '<ul><li><h3>' . __('Occasions', 'event-integration') . '</h3></li></ul>';
            foreach ($occasions as $occasion) {
                $ret .= '<ul>';
                $ret .= (! empty($occasion->start_date) && ! empty($occasion->end_date)) ? '<li>' . \EventManagerIntegration\App::formatEventDate($occasion->start_date, $occasion->end_date) . '</li>' : '';
                $ret .= '</ul>';
            }
            $ret .= '</div>';
        }

        // Check if any links exist in array
        $link_keys = array('facebook', 'twitter', 'instagram', 'google_music', 'spotify', 'soundcloud', 'deezer', 'youtube', 'vimeo');
        $links_exist = (count(array_intersect_key(array_flip($link_keys), $meta)) > 0) ? true : false;

        // Social media and streaming links
        if ($links_exist && in_array('links', $fields)) {
            $ret .= '<div class="shortcode-box shortcode-links '.$box_class.'">';
            $ret .= '<ul><li><h3>' . __('Links', 'event-integration') . '</h3></li></ul>';
            $ret .= '<ul>';
            $ret .= (! empty($meta['facebook'])) ? '<li>' . $meta['facebook'] . '</li>' : '';
            $ret .= (! empty($meta['twitter'])) ? '<li>' . $meta['twitter'] . '</li>' : '';
            $ret .= (! empty($meta['instagram'])) ? '<li>' . $meta['instagram'] . '</li>' : '';
            $ret .= (! empty($meta['google_music'])) ? '<li>' . $meta['google_music'] . '</li>' : '';
            $ret .= (! empty($meta['spotify'])) ? '<li>' . $meta['spotify'] . '</li>' : '';
            $ret .= (! empty($meta['soundcloud'])) ? '<li>' . $meta['soundcloud'] . '</li>' : '';
            $ret .= (! empty($meta['deezer'])) ? '<li>' . $meta['deezer'] . '</li>' : '';
            if (! empty($meta['youtube']) && is_array($meta['youtube'])) {
                foreach ($meta['youtube'] as $youtube) {
                    $ret .= '<li>' . $youtube['youtube_link'] . '</li>';
                }
            }
            if (! empty($meta['vimeo']) && is_array($meta['vimeo'])) {
                foreach ($meta['vimeo'] as $vimeo) {
                    $ret .= '<li>' . $vimeo['vimeo_link'] . '</li>';
                }
            }
            $ret .= '</ul>';
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
    public function unserData($data)
    {
        $unserialized = @unserialize($data);
        if ($unserialized !== false) {
            return $unserialized;
        } else {
            return $data;
        }
    }
}
