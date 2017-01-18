<?php

namespace EventManagerIntegration\Parser;

use \EventManagerIntegration\Event as Event;

class HbgEventApi extends \EventManagerIntegration\Parser
{
    public function __construct($url)
    {
        parent::__construct($url);
    }

    public function start()
    {
        // Import publishing groups from API
        \EventManagerIntegration\App::importPublishingGroups();

        // Remove expired occasions meta and event posts.
        $this->removeExpiredOccasions();
        $this->removeExpiredEvents();

        $ch = curl_init();
        $options = [
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL            => $this->url,
        ];

        curl_setopt_array($ch, $options);
        $events = json_decode(curl_exec($ch), true);
        curl_close($ch);
        if (!$events || (is_object($events) && $events->code == 'Error')) {
            return false;
        }

        // Remove duplicates and save to database
        //$events_unique = $this->uniqueArray($events, 'id');
        foreach ($events as $event) {
            $this->saveEvent($event);
        }
    }

    /**
     * Save event to database
     * @param  object $event Event data
     * @return void
     */
    public function saveEvent($event)
    {
        $post_title             = ! empty($event['title']['rendered']) ? $event['title']['rendered'] : null;
        $post_content           = ! empty($event['content']['rendered']) ? $event['content']['rendered'] : null;
        $featured_media         = ! empty($event['featured_media']['source_url']) ? $event['featured_media']['source_url'] : null;
        $categories             = ! empty($event['event_categories']) ? array_map('ucwords', array_map('trim', $event['event_categories'])) : array();
        $tags                   = ! empty($event['event_tags']) ? array_map('strtolower', array_map('trim', $event['event_tags'])) : array();
        $groups                 = ! empty($event['event_groups']) ? $event['event_groups'] : array();
        $occasions              = ! empty($event['occasions']) ? $event['occasions'] : null;
        $event_link             = ! empty($event['event_link']) ? $event['event_link'] : null;
        $additional_links       = ! empty($event['additional_links']) ? $event['additional_links'] : null;
        $related_events         = ! empty($event['related_events']) ? $event['related_events'] : null;
        $location               = ! empty($event['location']) ? $event['location'] : null;
        $additional_locations   = ! empty($event['additional_locations']) ? $event['additional_locations'] : null;
        $organizers             = ! empty($event['organizers']) ? $event['organizers'] : null;
        $supporters             = ! empty($event['supporters']) ? $event['supporters'] : null;
        $booking_link           = ! empty($event['booking_link']) ? $event['booking_link'] : null;
        $booking_phone          = ! empty($event['booking_phone']) ? $event['booking_phone'] : null;
        $age_restriction        = ! empty($event['age_restriction']) ? $event['age_restriction'] : null;
        $membership_cards       = ! empty($event['membership_cards']) ? $event['membership_cards'] : null;
        $price_information      = ! empty($event['price_information']) ? $event['price_information'] : null;
        $ticket_includes        = ! empty($event['ticket_includes']) ? $event['ticket_includes'] : null;
        $price_adult            = ! empty($event['price_adult']) ? $event['price_adult'] : null;
        $price_children         = ! empty($event['price_children']) ? $event['price_children'] : null;
        $children_age           = ! empty($event['children_age']) ? $event['children_age'] : null;
        $price_student          = ! empty($event['price_student']) ? $event['price_student'] : null;
        $price_senior           = ! empty($event['price_senior']) ? $event['price_senior'] : null;
        $senior_age             = ! empty($event['senior_age']) ? $event['senior_age'] : null;
        $booking_group          = ! empty($event['booking_group']) ? $event['booking_group'] : null;
        $gallery                = ! empty($event['gallery']) ? $event['gallery'] : null;
        $facebook               = ! empty($event['facebook']) ? $event['facebook'] : null;
        $twitter                = ! empty($event['twitter']) ? $event['twitter'] : null;
        $instagram              = ! empty($event['instagram']) ? $event['instagram'] : null;
        $google_music           = ! empty($event['google_music']) ? $event['google_music'] : null;
        $spotify                = ! empty($event['spotify']) ? $event['spotify'] : null;
        $soundcloud             = ! empty($event['soundcloud']) ? $event['soundcloud'] : null;
        $deezer                 = ! empty($event['deezer']) ? $event['deezer'] : null;
        $youtube                = ! empty($event['youtube']) ? $event['youtube'] : null;
        $vimeo                  = ! empty($event['vimeo']) ? $event['vimeo'] : null;
        $post_status            = get_field('event_post_status', 'option') ? get_field('event_post_status', 'option') : 'publish';

        // Check if category, tag and group filter is set or not
        $tax_filter = (empty(get_field('event_filter_cat', 'options')) && empty(get_field('event_filter_tag', 'options')) && empty(get_field('event_filter_group', 'options'))) ? true : false;

        // Filter by categories
        if (! empty(get_field('event_filter_cat', 'options'))) {
            $tax_filter = ($this->filterTaxonomies($categories, 0)) ? true : false;
        }

        // Filter by tags
        if (! $tax_filter && ! empty(get_field('event_filter_tag', 'options'))) {
            $tax_filter = ($this->filterTaxonomies($tags, 1)) ? true : false;
        }

        // Filter by groups
        if (! $tax_filter && ! empty(get_field('event_filter_group', 'options'))) {
            $tax_filter = $this->filterGroups($groups);
        }

        // Check if event already exist and get the post status
        $event_id = $this->checkIfEventExists($event['id']);
        if ($event_id) {
            $post_status = get_post_status($event_id);
        }

        // Save event if it passed taxonomy and group filters
        if ($tax_filter) {
            $event = new Event(
                array(
                'post_title'            => $post_title,
                'post_content'          => $post_content,
                'post_status'           => $post_status,
                ),
                array(
                '_event_manager_id'     => $event['id'],
                'categories'            => $categories,
                'tags'                  => $tags,
                'groups'                => $groups,
                'occasions_complete'    => $occasions,
                'event_link'            => $event_link,
                'additional_links'      => $additional_links,
                'related_events'        => $related_events,
                'location'              => $location,
                'additional_locations'  => $additional_locations,
                'organizers'            => $organizers,
                'supporters'            => $supporters,
                'booking_link'          => $booking_link,
                'booking_phone'         => $booking_phone,
                'age_restriction'       => $age_restriction,
                'membership_cards'      => $membership_cards,
                'price_information'     => $price_information,
                'ticket_includes'       => $ticket_includes,
                'price_adult'           => $price_adult,
                'price_children'        => $price_children,
                'children_age'          => $children_age,
                'price_student'         => $price_student,
                'price_senior'          => $price_senior,
                'senior_age'            => $senior_age,
                'booking_group'         => $booking_group,
                'gallery'               => $gallery,
                'facebook'              => $facebook,
                'twitter'               => $twitter,
                'instagram'             => $instagram,
                'google_music'          => $google_music,
                'spotify'               => $spotify,
                'soundcloud'            => $soundcloud,
                'deezer'                => $deezer,
                'youtube'               => $youtube,
                'vimeo'                 => $vimeo,
                )
            );
            $createSuccess = $event->save();

            if ($createSuccess && ! empty($featured_media)) {
                $event->setFeaturedImageFromUrl($featured_media, true);
            }
        }
    }

    /**
     * Sort out duplicate events.
     * @param  array $array array to be unique
     * @param  string $key  unique key
     * @return array
     */
    public function uniqueArray($array, $key)
    {
        $temp_array = array();
        $i = 0;
        $key_array = array();

        foreach ($array as $val) {
            if (!in_array($val[$key], $key_array)) {
                $key_array[$i] = $val[$key];
                $temp_array[$i] = $val;
            }
            $i++;
        }
        return $temp_array;
    }

    /**
     * Remove expired occasions from databse
     * @return void
     */
    public function removeExpiredOccasions()
    {
        global $wpdb;
        $date_limit = strtotime("midnight now") - 1;
        // Get all occasions from databse
        $db_table = $wpdb->prefix . "integrate_occasions";
        $occasions = $wpdb->get_results("SELECT * FROM $db_table ORDER BY start_date DESC", ARRAY_A);

        if (count($occasions) == 0) {
            return;
        }

        foreach ($occasions as $o) {
            // Delete the occasion if expired
            if (strtotime($o['end_date']) < $date_limit) {
                $id = $o['ID'];
                $wpdb->delete($db_table, array( 'ID' => $id));
            }
        }

        return;
    }

    /**
     * Remove expired events from databse
     * @return void
     */
    public function removeExpiredEvents()
    {
        global $wpdb;
        $post_type = 'event';
        // Get all events from databse
        $query = "SELECT ID FROM $wpdb->posts WHERE post_type = %s AND post_status = %s";
        $completeQuery = $wpdb->prepare($query, $post_type, 'publish');
        $events = $wpdb->get_results($completeQuery);

        if (count($events) == 0) {
            return;
        }

        $db_table = $wpdb->prefix . "integrate_occasions";
        $query = "SELECT ID, event_id FROM $db_table WHERE event_id = %s";
        // Loop through events and check if occasions exist
        foreach ($events as $e) {
            $completeQuery = $wpdb->prepare($query, $e->ID);
            $results = $wpdb->get_results($completeQuery);
            // Delete event if occasions is empty
            if (count($results) == 0) {
                wp_delete_post($e->ID, true);
            }
        }

        return;
    }

    /**
     * Filter by taxonomies, if add or not to add
     * @param  array $taxonomies All taxonomies
     * @param  int   $type       Type of taxonomy, 0 = category, 1 = tag
     * @return bool
     */
    public function filterTaxonomies($taxonomies, $type)
    {
        $passes = true;
        $tax_array = ($type == 0) ? get_field('event_filter_cat', 'options') : get_field('event_filter_tag', 'options');

        if (! empty($tax_array)) {
            $filters = array_map('trim', explode(',', $tax_array));
            $taxLower = array_map('strtolower', $taxonomies);
            $passes = false;

            foreach ($filters as $filter) {
                if (in_array(strtolower($filter), $taxLower)) {
                    $passes = true;
                }
            }
        }

        return $passes;
    }

    /**
     * Filter by groups, if add or not to add
     * @param  array $groups Event groups
     * @return bool
     */
    public function filterGroups($groups)
    {
        $passes = true;
        $filter_array = get_field('event_filter_group', 'options');

        if (! empty($filter_array)) {
            $passes = false;

            // Save group slug as new array
            $event_groups = array();
            foreach ($groups as $group) {
                $event_groups[] .= $group['slug'];
            }

            foreach ($filter_array as $filter) {
                if (in_array($filter->slug, $event_groups)) {
                    $passes = true;
                }
            }
        }

        return $passes;
    }
}
