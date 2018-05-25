<?php

/**
 * Shortcodes to display events with meta data
 */

namespace EventManagerIntegration\Shortcodes;

class SingleEvent
{
    public static $postTypeSlug = 'event';

    public function __construct()
    {
        add_action('init', array($this, 'addShortcodes'));
    }

    // Create shortcodes
    public function addShortcodes()
    {
        add_shortcode('single_event_information', array($this, 'singleEventInformation'));
        add_shortcode('single_event_accordion', array($this, 'singleEventAccordion'));
    }

    /**
     * Unserialize arrays
     * @param  mixed $data data to be formatted
     * @return string
     */
    public static function unserData($data)
    {
        $unserialized = @unserialize($data);
        if ($unserialized !== false) {
            return $unserialized;
        } else {
            return $data;
        }
    }

    /**
     * Shortcode to display complete event information
     * @return string
     */
    public function singleEventAccordion()
    {
        global $post;

        if(!(isset($post->post_type) && $post->post_type === self::$postTypeSlug)) {
            return;
        }

        $id = $post->ID;
        $fields = is_array(get_field('event_shortc_fields', 'options')) ? get_field('event_shortc_fields', 'options') : array();
        $get_meta = get_post_meta($id);
        $occasions = \EventManagerIntegration\Helper\QueryEvents::getEventOccasions($id);
        $query_var_date = (!empty(get_query_var('date'))) ? get_query_var('date') : false;
        $meta = array();

        if (is_array($get_meta) && !empty($get_meta)) {
            foreach ($get_meta as $key => $value) {
                if (is_array($value) && count($value) == 1) {
                    $meta[$key] = self::unserData($value[0]);
                } else {
                    $meta[$key] = $value;
                }
            }
        }

        $i = 0;
        $ret = '<div class="accordion accordion-icon accordion-list event-info-shortcode">';

        // Information
        $event_info = $this->eventInfo($query_var_date, $occasions, $meta);
        if (in_array('information', $fields) && !empty($event_info)) {
            $i++;
            $ret .= '<section class="accordion-section">';
            $ret .= '<input type="radio" name="active-section" id="accordion-section-' . $i . '">';
            $ret .= '<label class="accordion-toggle" for="accordion-section-' . $i . '">';
            $ret .= '<h3>' . __('Information', 'event-integration') . '</h3>';
            $ret .= '</label>';
            $ret .= '<div class="accordion-content">';
            $ret .= $event_info;
            $ret .= '</div>';
            $ret .= '</section>';
        }

        // Location
        if (in_array('location', $fields) && !empty($meta['location'])) {
            $i++;
            $ret .= '<section class="accordion-section">';
            $ret .= '<input type="radio" name="active-section" id="accordion-section-' . $i . '">';
            $ret .= '<label class="accordion-toggle" for="accordion-section-' . $i . '">';
            $ret .= '<h3>' . __('Location', 'event-integration') . '</h3>';
            $ret .= '</label>';
            $ret .= '<div class="accordion-content">';
            $ret .= $this->eventLocation($meta, $fields);
            $ret .= '</div>';
            $ret .= '</section>';
        }

        // Booking information
        $booking_info = $this->eventBooking($meta);
        if (in_array('booking', $fields) && strpos($booking_info, '<li>')) {
            $i++;
            $ret .= '<section class="accordion-section">';
            $ret .= '<input type="radio" name="active-section" id="accordion-section-' . $i . '">';
            $ret .= '<label class="accordion-toggle" for="accordion-section-' . $i . '">';
            $ret .= '<h3>' . __('Booking and tickets', 'event-integration') . '</h3>';
            $ret .= '</label>';
            $ret .= '<div class="accordion-content">';
            $ret .= $booking_info;
            $ret .= '</div>';
            $ret .= '</section>';
        }

        // Contact
        $contact_info = $this->eventContact($meta);
        if (in_array('contact', $fields) && !empty($contact_info)) {
            $i++;
            $ret .= '<section class="accordion-section">';
            $ret .= '<input type="radio" name="active-section" id="accordion-section-' . $i . '">';
            $ret .= '<label class="accordion-toggle" for="accordion-section-' . $i . '">';
            $ret .= '<h3>' . __('Contact', 'event-integration') . '</h3>';
            $ret .= '</label>';
            $ret .= '<div class="accordion-content">';
            $ret .= '<ul>' . $contact_info . '</ul>';
            $ret .= '</div>';
            $ret .= '</section>';
        }

        // Organizers
        if (!empty($meta['organizers']) && in_array('organizers', $fields)) {
            $i++;
            $ret .= '<section class="accordion-section">';
            $ret .= '<input type="radio" name="active-section" id="accordion-section-' . $i . '">';
            $ret .= '<label class="accordion-toggle" for="accordion-section-' . $i . '">';
            $ret .= '<h3>' . __('Organizer', 'event-integration') . '</h3>';
            $ret .= '</label>';
            $ret .= '<div class="accordion-content">';
            $ret .= $this->eventOrganizer($meta, $fields);
            $ret .= '</div>';
            $ret .= '</section>';
        }

        // Occasions
        if (in_array('occasion', $fields)) {
            $i++;
            $ret .= '<section class="accordion-section">';
            $ret .= '<input type="radio" name="active-section" id="accordion-section-' . $i . '">';
            $ret .= '<label class="accordion-toggle" for="accordion-section-' . $i . '">';
            $ret .= '<h3>' . __('Occasions', 'event-integration') . '</h3>';
            $ret .= '</label>';
            $ret .= '<div class="accordion-content">';
            $ret .= $this->eventOccasions($occasions);
            $ret .= '</div>';
            $ret .= '</section>';
        }

        // Check if any links exist in array
        $link_keys = array('facebook', 'twitter', 'instagram', 'google_music', 'spotify', 'soundcloud', 'deezer', 'youtube', 'vimeo');
        $links_exist = (count(array_intersect_key(array_flip($link_keys), $meta)) > 0) ? true : false;

        // Social media and streaming links
        if ($links_exist && in_array('links', $fields)) {
            $i++;
            $ret .= '<section class="accordion-section">';
            $ret .= '<input type="radio" name="active-section" id="accordion-section-' . $i . '">';
            $ret .= '<label class="accordion-toggle" for="accordion-section-' . $i . '">';
            $ret .= '<h3>' . __('Links', 'event-integration') . '</h3>';
            $ret .= '</label>';
            $ret .= '<div class="accordion-content">';
            $ret .= $this->eventLinks($meta);
            $ret .= '</div>';
            $ret .= '</section>';
        }

        $ret .= '</div>'; // End accordion

        return $ret;
    }

    /**
     * Shortcode to display complete event information
     * @return string
     */
    public function singleEventInformation()
    {
        global $post;

        if(!(isset($post->post_type) && $post->post_type === self::$postTypeSlug)) {
            return;
        }

        $id = $post->ID;
        // Get custom wrapper and div box classes
        $class = (!empty(get_field('event_shortc_wrapper', 'options'))) ? get_field('event_shortc_wrapper', 'options') : '';
        $class = str_replace(' ', '', $class);
        $wrapper_class = str_replace(',', ' ', $class);
        $class = (!empty(get_field('event_shortc_inner', 'options'))) ? get_field('event_shortc_inner', 'options') : '';
        $class = str_replace(' ', '', $class);
        $box_class = str_replace(',', ' ', $class);
        $fields = is_array(get_field('event_shortc_fields', 'options')) ? get_field('event_shortc_fields', 'options') : array();
        $get_meta = get_post_meta($id);
        $occasions = \EventManagerIntegration\Helper\QueryEvents::getEventOccasions($id);
        $query_var_date = (!empty(get_query_var('date'))) ? get_query_var('date') : false;

        $meta = array();
        foreach ($get_meta as $key => $value) {
            if (is_array($value) && count($value) == 1) {
                $meta[$key] = self::unserData($value[0]);
            } else {
                $meta[$key] = $value;
            }
        }

        $ret = '<div class="event-info-shortcode ' . $wrapper_class . '">';

        // Information
        $event_info = $this->eventInfo($query_var_date, $occasions, $meta);
        if (in_array('information', $fields) && !empty($event_info)) {
            $ret .= '<div class="shortcode-box shortcode-information ' . $box_class . '">';
            $ret .= '<ul><li><h3>' . __('Information', 'event-integration') . '</h3></li></ul>';
            $ret .= $event_info;
            $ret .= '</div>';
        }

        // Location
        if (in_array('location', $fields) && !empty($meta['location']['title'])) {
            $ret .= '<div class="shortcode-box shortcode-location ' . $box_class . '">';
            $ret .= '<ul><li><h3>' . __('Location', 'event-integration') . '</h3></li></ul>';
            $ret .= $this->eventLocation($meta, $fields);
            $ret .= '</div>';
        }

        // Booking information
        $booking_info = $this->eventBooking($meta);
        if (in_array('booking', $fields) && strpos($booking_info, '<li>')) {
            $ret .= '<div class="shortcode-box shortcode-booking ' . $box_class . '">';
            $ret .= '<ul><li><h3>' . __('Booking and tickets', 'event-integration') . '</h3></li></ul>';
            $ret .= $booking_info;
            $ret .= '</div>';
        }

        // Contact
        if (in_array('contact', $fields) && !empty($contact_info = $this->eventContact($meta))) {
            $ret .= '<div class="shortcode-box shortcode-contact ' . $box_class . '">';
            $ret .= '<ul><li><h3>' . __('Contact', 'event-integration') . '</h3></li></ul>';
            $ret .= '<ul>' . $contact_info . '</ul>';
            $ret .= '</div>';
        }

        // Organizers
        if (!empty($meta['organizers']) && in_array('organizers', $fields)) {
            $ret .= '<div class="shortcode-box shortcode-organizer ' . $box_class . '">';
            $ret .= '<ul><li><h3>' . __('Organizer', 'event-integration') . '</h3></li></ul>';
            $ret .= $this->eventOrganizer($meta, $fields);
            $ret .= '</div>';
        }

        // Occasions
        if (in_array('occasion', $fields)) {
            $ret .= '<div class="shortcode-box shortcode-occasions ' . $box_class . '">';
            $ret .= '<ul><li><h3>' . __('Occasions', 'event-integration') . '</h3></li></ul>';
            $ret .= $this->eventOccasions($occasions);
            $ret .= '</div>';
        }

        // Check if any links exist in array
        $link_keys = array('facebook', 'twitter', 'instagram', 'google_music', 'spotify', 'soundcloud', 'deezer', 'youtube', 'vimeo');
        $links_exist = (count(array_intersect_key(array_flip($link_keys), $meta)) > 0) ? true : false;

        // Social media and streaming links
        if ($links_exist && in_array('links', $fields)) {
            $ret .= '<div class="shortcode-box shortcode-links ' . $box_class . '">';
            $ret .= '<ul><li><h3>' . __('Links', 'event-integration') . '</h3></li></ul>';
            $ret .= $this->eventLinks($meta);
            $ret .= '</div>';
        }

        $ret .= '</div>'; // End event-info-shortcode

        return $ret;
    }

    public static function eventInfo($query_var_date = false, $occasions = array(), $meta = array())
    {
        $ret = '';
        // Get current occasion
        if ($query_var_date) {
            foreach ($occasions as $occasion) {
                $event_date = preg_replace('/\D/', '', $occasion->start_date);
                if ($query_var_date == $event_date) {
                    $ret .= '<ul>';
                    $ret .= '<li><strong>' . __('Occasion', 'event-integration') . '</strong></li>';
                    $ret .= (!empty($occasion->start_date) && !empty($occasion->end_date)) ? '<li>' . \EventManagerIntegration\App::formatEventDate($occasion->start_date, $occasion->end_date) . '</li>' : '';
                    $ret .= (!empty($occasion->door_time)) ? '<li><strong>' . __('Door time', 'event-integration') . '</strong></li>' : '';
                    $ret .= (!empty($occasion->door_time)) ? '<li>' . \EventManagerIntegration\App::formatDoorTime($occasion->door_time) . '</li>' : '';
                    $ret .= '</ul>';
                }
            }
        }

        if (!empty($meta['event_link'])) {
            $link = preg_replace("(^https?://)", "", $meta['event_link']);
            $ret .= '<ul><li><a href="' . $meta['event_link'] . '" class="link-item link-item-outbound" itemprop="telephone">' . $link . '</a></li></ul>';
        }

        if (!empty($meta['additional_links']) && is_array($meta['additional_links'])) {
            $ret .= '<ul><li><strong>' . __('Other links', 'event-integration') . '</strong></li></ul>';
            $ret .= '<ul>';
            foreach ($meta['additional_links'] as $link) {
                $ret .= '<li><a href="' . $link['link'] . '" class="link-item link-item-outbound">' . $link['link'] . '</a></li>';
            }
            $ret .= '</ul>';
        }
        if (!empty($meta['related_events']) && is_array($meta['related_events'])) {
            $ret .= '<ul><li><strong>' . __('Related events', 'event-integration') . '</strong></li></ul>';
            $ret .= '<ul>';
            foreach ($meta['related_events'] as $event) {
                $ret .= '<li>' . $event['post_title'] . '</li>';
            }
            $ret .= '</ul>';
        }

        return $ret;
    }

    public static function eventLocation($meta = array(), $fields = array('additional_locations'))
    {
        $ret = '';
        $location = (isset($meta['location'])) ? $meta['location'] : null;

        // Google Map
        if (in_array('map', $fields) && !empty($meta['latitude']) && !empty($meta['latitude'])) {
            $locationTitle = $location['title'] ?? '';
            $ret .= '<div id="event-map" data-lat="' . $meta['latitude'] . '" data-lng="' . $meta['longitude'] . '" data-title="' . $locationTitle . '"></div>';
        }
        if (is_array($location) && !empty($location)) {
            $ret .= '<ul>';
            $ret .= (!empty($location['title'])) ? '<li><strong>' . $location['title'] . '</strong></li>' : '';
            $ret .= (!empty($location['street_address'])) ? '<li>' . $location['street_address'] . '</li>' : '';
            $ret .= (!empty($location['postal_code'])) ? '<li>' . $location['postal_code'] . '</li>' : '';
            $ret .= (!empty($location['city'])) ? '<li>' . $location['city'] . '</li>' : '';
            $ret .= '</ul>';
        }
        // Additional locations
        if (in_array('additional_locations', $fields) && !empty($meta['additional_locations'])) {
            $ret .= '<ul><li><h4>' . __('Other locations', 'event-integration') . '</li></ul></h4>';
            if (is_array($meta['additional_locations']) && !empty($meta['additional_locations'])) {
                foreach ($meta['additional_locations'] as $location) {
                    $ret .= '<ul>';
                    $ret .= (!empty($location['title'])) ? '<li><strong>' . $location['title'] . '</strong></li>' : '';
                    $ret .= (!empty($location['street_address'])) ? '<li>' . $location['street_address'] . '</li>' : '';
                    $ret .= (!empty($location['postal_code'])) ? '<li>' . $location['postal_code'] . '</li>' : '';
                    $ret .= (!empty($location['city'])) ? '<li>' . $location['city'] . '</li>' : '';
                    $ret .= '</ul>';
                }
            }
        }

        return $ret;
    }

    public static function eventBooking($meta = array())
    {
        $ret = '<ul>';
        $ret .= (!empty($meta['booking_link'])) ? '<li><a href="' . $meta['booking_link'] . '" class="link-item link-item-outbound">' . __('Book here', 'event-integration') . '</a></li>' : '';
        $ret .= (!empty($meta['booking_phone'])) ? '<li><a href="tel:' . $meta['booking_phone'] . '" class="link-item link-item-outbound" itemprop="telephone">' . $meta['booking_phone'] . '</a></li>' : '';
        $ret .= (!empty($meta['booking_email'])) ? '<li><a href="mailto:' . $meta['booking_email'] . '" class="link-item link-item-outbound" itemprop="email">' . $meta['booking_email'] . '</a></li><br>' : '';
        $ret .= (isset($meta['price_adult']) && $meta['price_adult'] != '') ? '<li>' . __('Adult', 'event-integration') . ': ' . self::priceOutput($meta['price_adult']) . '</li>' : '';
        $children_age = (!empty($meta['children_age'])) ? ' (' . __('below', 'event-integration') . ' ' . $meta['children_age'] . ')' : '';
        $ret .= (isset($meta['price_children']) && $meta['price_children'] != '') ? '<li>' . __('Children', 'event-integration') . $children_age . ': ' .self::priceOutput($meta['price_children']) . '</li>' : '';
        $senior_age = (!empty($meta['senior_age'])) ? ' (' . __('above', 'event-integration') . ' ' . $meta['senior_age'] . ')' : '';
        $ret .= (isset($meta['price_senior']) && $meta['price_senior'] != '') ? '<li>' . __('Senior', 'event-integration') . $senior_age . ': ' . self::priceOutput($meta['price_senior']) . '</li>' : '';
        $ret .= (isset($meta['price_student']) && $meta['price_student'] != '') ? '<li>' . __('Student', 'event-integration') . ': ' . self::priceOutput($meta['price_student']) . '</li>' : '';
        $ret .= (!empty($meta['age_restriction'])) ? '<li>' . __('Age restriction', 'event-integration') . ': ' . $meta['age_restriction'] . ' ' . __('years', 'event-integration') . '</li>' : '';
        $ret .= (!empty($meta['ticket_release_date'])) ? '<li>' . __('Ticket release date', 'event-integration') . ': ' . mysql2date('j F Y, H:i', $meta['ticket_release_date'], true) . '</li>' : '';
        $ret .= (isset($meta['tickets_remaining']) && $meta['tickets_remaining'] != '') ? '<li>' . __('Tickets remaining', 'event-integration') . ': ' . $meta['tickets_remaining'] . '</li>' : '';
        $ret .= '</ul>';
        if (!empty($meta['additional_ticket_types']) && is_array($meta['additional_ticket_types'])) {
            $ret .= '<ul><li><strong>' . __('Ticket types', 'event-integration') . '</strong></li></ul>';
            foreach ($meta['additional_ticket_types'] as $index => $ticketType) {
                $ret .= '<ul>';
                $ret .= (!empty($ticketType['ticket_name'])) ? '<li><strong>' . $ticketType['ticket_name'] . '</strong></li>' : '';
                if (!empty($ticketType['ticket_type'])) {
                    switch (strtolower($ticketType['ticket_type'])) {
                        case('seated'):
                            $ret .= '<li>' . __('Seated', 'event-integration') . '</li>';
                            break;
                        case('standing'):
                            $ret .= '<li>' . __('Standing', 'event-integration') . '</li>';
                            break;
                    }
                }
                $ret .= (isset($ticketType['minimum_price']) && $ticketType['minimum_price'] != '') ? '<li>' . __('Minimum price', 'event-integration') . ': ' . self::priceOutput($ticketType['minimum_price']) . '</li>' : '';
                $ret .= (isset($ticketType['maximum_price']) && $ticketType['maximum_price'] != '') ? '<li>' . __('Maximum price', 'event-integration') . ': ' . self::priceOutput($ticketType['maximum_price']) . '</li>' : '';
                $ret .= '</ul>';
            }
        }
        $ret .= '</ul>';
        $ret .= '</ul>';
        $ret .= '</ul>';
        if (!empty($meta['price_range']) && is_array($meta['price_range']) && !empty(array_filter($meta['price_range']))) {
            $ret .= '<ul><li><strong>' . __('Price range', 'event-integration') . '</strong></li></ul>';
            $ret .= '<ul>';
            $ret .= (isset($meta['price_range']['seated_minimum_price']) && $meta['price_range']['seated_minimum_price'] != '') ? '<li>' . __('Seated minimum price', 'event-integration') . ': ' . self::priceOutput($meta['price_range']['seated_minimum_price']) . '</li>' : '';
            $ret .= (isset($meta['price_range']['seated_maximum_price']) && $meta['price_range']['seated_maximum_price'] != '') ? '<li>' . __('Seated maximum price', 'event-integration') . ': ' . self::priceOutput($meta['price_range']['seated_maximum_price']) . '</li>' : '';
            $ret .= (isset($meta['price_range']['standing_minimum_price']) && $meta['price_range']['standing_minimum_price'] != '') ? '<li>' . __('Standing minimum price', 'event-integration') . ': ' . self::priceOutput($meta['price_range']['standing_minimum_price']) . '</li>' : '';
            $ret .= (isset($meta['price_range']['standing_maximum_price']) && $meta['price_range']['standing_maximum_price'] != '') ? '<li>' . __('Standing maximum price', 'event-integration') . ': ' . self::priceOutput($meta['price_range']['standing_maximum_price']) . '</li>' : '';
            $ret .= '</ul>';
        }
        $ret .= '</ul>';
        $ret .= '</ul>';
        if (!empty($meta['additional_ticket_retailers']) && is_array($meta['additional_ticket_retailers'])) {
            $ret .= '<ul><li><strong>' . __('Ticket retailers', 'event-integration') . '</strong></li></ul>';
            foreach ($meta['additional_ticket_retailers'] as $index => $retailer) {
                $ret .= '<ul>';
                $ret .= (!empty($retailer['retailer_name'])) ? '<li><strong>' . $retailer['retailer_name'] . '</strong></li>' : '';
                $ret .= (!empty($retailer['booking_url'])) ? '<li><a href="' . $retailer['booking_url'] . '" class="link-item link-item-outbound">' . preg_replace("(^https?://)", "", $retailer['booking_url']) . '</a></li>' : '';
                $ret .= (!empty($retailer['ticket_release_date'])) ? '<li>' . __('Ticket release date', 'event-integration') . ': ' . mysql2date('j F Y, H:i', $retailer['ticket_release_date'], true) . '</li>' : '';
                $ret .= (!empty($retailer['ticket_stop_date'])) ? '<li>' . __('Ticket release date', 'event-integration') . ': ' . mysql2date('j F Y, H:i', $retailer['ticket_stop_date'], true) . '</li>' : '';

                $ret .= '</ul>';
            }
        }
        $ret .= '</ul>';
        $ret .= '</ul>';
        if (!empty($meta['booking_group']) && is_array($meta['booking_group'])) {
            $ret .= '<ul><li><strong>' . __('Group prices', 'event-integration') . '</strong></li></ul>';
            $ret .= '<ul>';
            foreach ($meta['booking_group'] as $group) {
                $ret .= '<li>' . $group['min_persons'] . ' - ' . $group['max_persons'] . ' ' . __('persons', 'event-integration') . ': ' . self::priceOutput($group['price_group']) . '</li>';
            }
            $ret .= '</ul>';
        }
        $ret .= '</ul>';
        if (!empty($meta['membership_cards']) && is_array($meta['membership_cards'])) {
            $ret .= '<ul><li><strong>' . __('Included in membership cards', 'event-integration') . '</strong></li></ul>';
            $ret .= '<ul>';
            foreach ($meta['membership_cards'] as $card) {
                $ret .= '<li>' . $card['post_title'] . '</li>';
            }
            $ret .= '</ul>';
        }
        $ret .= (!empty($meta['price_information'])) ? '<ul><li><strong>' . __('Price information', 'event-integration') . '</strong></li></ul><ul><li> ' . $meta['price_information'] . '</li></ul>' : '';
        $ret .= (!empty($meta['ticket_includes'])) ? '<ul><li><strong>' . __('Ticket includes', 'event-integration') . '</strong></li></ul><ul><li> ' . $meta['ticket_includes'] . '</li></ul>' : '';

        return $ret;
    }

    public static function eventContact($meta = array())
    {
        $ret = '';
        $ret .= (!empty($meta['contact_information'])) ? '<li>'. $meta['contact_information'] .'</li><br>' : '';
        $ret .= (!empty($meta['contact_phone'])) ? '<li><a href="tel:' . $meta['contact_phone'] . '" class="link-item link-item-outbound" itemprop="telephone">' . $meta['contact_phone'] . '</a></li>' : '';
        $ret .= (!empty($meta['contact_email'])) ? '<li><a href="mailto:' . $meta['contact_email'] . '" class="link-item link-item-outbound" itemprop="email">' . $meta['contact_email'] . '</a></li>' : '';

        return $ret;
    }

    public static function eventOrganizer($meta = array(), $fields = array('sponsors'))
    {
        $ret = '';
        if (!empty($meta['organizers']) && is_array($meta['organizers'])) {
            foreach ($meta['organizers'] as $organizer) {
                $ret .= '<ul>';
                $ret .= (!empty($organizer['organizer'])) ? '<li><strong>' . $organizer['organizer'] . '</strong></li>' : '';
                $ret .= (!empty($organizer['organizer_phone'])) ? '<li><a href="tel:' . $organizer['organizer_phone'] . '" class="link-item link-item-outbound" itemprop="telephone">' . $organizer['organizer_phone'] . '</a></li>' : '';
                $ret .= (!empty($organizer['organizer_email'])) ? '<li><a href="mailto:' . $organizer['organizer_email'] . '" class="link-item link-item-outbound" itemprop="email" itemprop="email">' . $organizer['organizer_email'] . '</a></li>' : '';
                $ret .= (!empty($organizer['organizer_link'])) ? '<li><a href="' . $organizer['organizer_link'] . '" class="link-item link-item-outbound">' . preg_replace("(^https?://)", "", $organizer['organizer_link']) . '</a></li>' : '';
                $ret .= '</ul>';
            }

            // Sponsors
            if (in_array('sponsors', $fields) && !empty($meta['supporters'])) {
                $ret .= '<ul><li><h4>' . __('Sponsors', 'event-integration') . '</li></ul></h4>';
                if (is_array($meta['supporters']) && !empty($meta['supporters'])) {
                    foreach ($meta['supporters'] as $sponsor) {
                        $ret .= '<ul>';
                        $ret .= (!empty($sponsor['post_title'])) ? '<li>' . $sponsor['post_title'] . '</li>' : '';
                        $ret .= '</ul>';
                    }
                }
            }
        }

        return $ret;
    }

    public static function eventOccasions($occasions = array())
    {
        $ret = '';
        foreach ($occasions as $occasion) {
            $ret .= '<ul>';
            $ret .= (!empty($occasion->start_date) && !empty($occasion->end_date)) ? '<li>' . \EventManagerIntegration\App::formatEventDate($occasion->start_date, $occasion->end_date) . '</li>' : '';
            $ret .= '</ul>';
        }

        return $ret;
    }

    public static function eventLinks($meta = array())
    {
        $ret = '<ul>';
        $ret .= (!empty($meta['facebook'])) ? '<li><a href="' . $meta['facebook'] . '" class="link-item link-item-outbound">Facebook</a></li>' : '';
        $ret .= (!empty($meta['twitter'])) ? '<li><a href="' . $meta['twitter'] . '" class="link-item link-item-outbound">Twitter</a></li>' : '';
        $ret .= (!empty($meta['instagram'])) ? '<li><a href="' . $meta['instagram'] . '" class="link-item link-item-outbound">Instagram</a></li>' : '';
        $ret .= (!empty($meta['google_music'])) ? '<li><a href="' . $meta['google_music'] . '" class="link-item link-item-outbound">Google Music</a></li>' : '';
        $ret .= (!empty($meta['spotify'])) ? '<li><a href="' . $meta['spotify'] . '" class="link-item link-item-outbound">Spotify</a></li>' : '';
        $ret .= (!empty($meta['soundcloud'])) ? '<li><a href="' . $meta['soundcloud'] . '" class="link-item link-item-outbound">Soundcloud</a></li>' : '';
        $ret .= (!empty($meta['deezer'])) ? '<li><a href="' . $meta['deezer'] . '" class="link-item link-item-outbound">Deezer</a></li>' : '';
        if (!empty($meta['youtube']) && is_array($meta['youtube'])) {
            foreach ($meta['youtube'] as $youtube) {
                $ret .= '<li><a href="' . $youtube['youtube_link'] . '" class="link-item link-item-outbound">YouTube</a></li>';
            }
        }
        if (!empty($meta['vimeo']) && is_array($meta['vimeo'])) {
            foreach ($meta['vimeo'] as $vimeo) {
                $ret .= '<li><a href="' . $vimeo['vimeo_link'] . '" class="link-item link-item-outbound">Vimeo</a></li>';
            }
        }
        $ret .= '</ul>';

        return $ret;
    }

    public static function eventTaxonomies($meta = array())
    {
        $ret = '<ul>';
        if (isset($meta['groups']) && !empty($meta['groups']) && is_array($meta['groups'])) {
            $ret .= '<ul><li><h4>' . __('Groups', 'event-integration') . '</li></ul></h4>';
            foreach ($meta['groups'] as $group) {
                $ret .= '<li>' . $group['name'] . '</li>';
            }
        }
        if (isset($meta['categories']) && !empty($meta['categories']) && is_array($meta['categories'])) {
            $ret .= '<ul><li><h4>' . __('Categories', 'event-integration') . '</li></ul></h4>';
            foreach ($meta['categories'] as $category) {
                $ret .= '<li>' . $category . '</li>';
            }
        }
        if (isset($meta['tags']) && !empty($meta['tags']) && is_array($meta['tags'])) {
            $ret .= '<ul><li><h4>' . __('Tags', 'event-integration') . '</li></ul></h4>';
            foreach ($meta['tags'] as $tag) {
                $ret .= '<li>' . $tag . '</li>';
            }
        }
        $ret .= '</ul>';

        return $ret;
    }

    /**
     * Outputs prices
     * @param $price
     * @return string
     */
    public static function priceOutput($price)
    {
        if ($price == 0) {
            $price = _x('Free', 'Free event entrance', 'event-integration');
        } elseif ($price !== '') {
            $price .= ' kr';
        }

        return $price;
    }
}
