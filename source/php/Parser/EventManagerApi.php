<?php

namespace EventManagerIntegration\Parser;

use \EventManagerIntegration\Event as Event;

class EventManagerApi extends \EventManagerIntegration\Parser
{
    public function __construct($url)
    {
        parent::__construct($url);
    }

    public function start()
    {
        if (function_exists('kses_remove_filters')) {
            kses_remove_filters();
        }

        // Import publishing groups from API
        \EventManagerIntegration\App::importPublishingGroups();

        // Loop through paginated API request
        $page = 1;
        $eventIds = array();
        $checkApiDiff = true;
        while ($page) {
            $url = add_query_arg(
                array(
                    'page' => $page,
                    'per_page' => 25,
                ),
                $this->url
            );

            $events = \EventManagerIntegration\Parser::requestApi($url);

            if (is_wp_error($events)) {
                // Skip check of events diff on error
                $checkApiDiff = false;
                $page = false;
                break;
            } elseif ($events) {
                // Save events to database
                foreach ($events as $event) {
                    $this->saveEvent($event);
                    if (isset($event['id'])) {
                        $eventIds[] = $event['id'];
                    }
                }
            } else {
                $page = false;
                break;
            }
            $page++;
        }

        // Delete events that has been deleted from the API
        if ($checkApiDiff === true && !empty($eventIds)) {
            $this->removeDeletedEvents($eventIds);
        }
        // Clean up
        $this->removeExpiredOccasions();
        $this->removeExpiredEvents();
    }

    /**
     * Save event to database
     * @param  object $event Event data
     * @return void
     * @throws \Exception
     */
    public function saveEvent($event)
    {
        $post_title                     = !empty($event['title']['rendered']) ? $event['title']['rendered'] : null;
        $post_content                   = !empty($event['content']['rendered']) ? $event['content']['rendered'] : null;
        $featured_media                 = !empty($event['featured_media']['source_url']) ? $event['featured_media']['source_url'] : null;
        $categories                     = !empty($event['event_categories']) ? array_map('ucwords', array_map('trim', $event['event_categories'])) : array();
        $tags                           = !empty($event['event_tags']) ? array_map('strtolower', array_map('trim', $event['event_tags'])) : array();
        $groups                         = !empty($event['user_groups']) ? $event['user_groups'] : array();
        $occasions                      = !empty($event['occasions']) ? $event['occasions'] : null;
        $event_link                     = !empty($event['event_link']) ? $event['event_link'] : null;
        $additional_links               = !empty($event['additional_links']) ? $event['additional_links'] : null;
        $related_events                 = !empty($event['related_events']) ? $event['related_events'] : null;
        $organizers                     = !empty($event['organizers']) ? $event['organizers'] : null;
        $supporters                     = !empty($event['supporters']) ? $event['supporters'] : null;
        $booking_link                   = !empty($event['booking_link']) ? $event['booking_link'] : null;
        $booking_phone                  = !empty($event['booking_phone']) ? $event['booking_phone'] : null;
        $booking_email                  = !empty($event['booking_email']) ? $event['booking_email'] : null;
        $age_restriction                = !empty($event['age_restriction']) ? $event['age_restriction'] : null;
        $membership_cards               = !empty($event['membership_cards']) ? $event['membership_cards'] : null;
        $price_information              = !empty($event['price_information']) ? $event['price_information'] : null;
        $ticket_includes                = !empty($event['ticket_includes']) ? $event['ticket_includes'] : null;
        $price_adult                    = isset($event['price_adult']) && $event['price_adult'] !== '' ? $event['price_adult'] : null;
        $price_children                 = isset($event['price_children']) && $event['price_children'] !== '' ? $event['price_children'] : null;
        $children_age                   = !empty($event['children_age']) ? $event['children_age'] : null;
        $price_student                  = isset($event['price_student']) && $event['price_student'] !== '' ? $event['price_student'] : null;
        $price_senior                   = isset($event['price_senior']) && $event['price_senior'] !== '' ? $event['price_senior'] : null;
        $senior_age                     = !empty($event['senior_age']) ? $event['senior_age'] : null;
        $booking_group                  = !empty($event['booking_group']) ? $event['booking_group'] : null;
        $gallery                        = !empty($event['gallery']) ? $event['gallery'] : null;
        $facebook                       = !empty($event['facebook']) ? $event['facebook'] : null;
        $twitter                        = !empty($event['twitter']) ? $event['twitter'] : null;
        $instagram                      = !empty($event['instagram']) ? $event['instagram'] : null;
        $google_music                   = !empty($event['google_music']) ? $event['google_music'] : null;
        $spotify                        = !empty($event['spotify']) ? $event['spotify'] : null;
        $soundcloud                     = !empty($event['soundcloud']) ? $event['soundcloud'] : null;
        $deezer                         = !empty($event['deezer']) ? $event['deezer'] : null;
        $youtube                        = !empty($event['youtube']) ? $event['youtube'] : null;
        $vimeo                          = !empty($event['vimeo']) ? $event['vimeo'] : null;
        $post_status                    = get_field('event_post_status', 'option') ? get_field('event_post_status', 'option') : 'publish';
        $location                       = !empty($event['location']) ? $event['location'] : null;
        $additional_locations           = !empty($event['additional_locations']) ? $event['additional_locations'] : null;
        $latitude                       = is_array($location) && ! empty($location['latitude']) ? $location['latitude'] : null;
        $longitude                      = is_array($location) && ! empty($location['longitude']) ? $location['longitude'] : null;
        $last_update                    = !empty($event['modified_gmt']) ? $event['modified_gmt'] : null;
        $ticket_stock                   = isset($event['ticket_stock']) && $event['ticket_stock'] !== '' ? $event['ticket_stock'] : null;
        $tickets_remaining              = isset($event['tickets_remaining']) && $event['tickets_remaining'] !== '' ? $event['tickets_remaining'] : null;
        $additional_ticket_retailers    = !empty($event['additional_ticket_retailers']) ? $event['additional_ticket_retailers'] : null;
        $additional_ticket_types        = !empty($event['additional_ticket_types']) ? $event['additional_ticket_types'] : null;
        $price_range                    = !empty($event['price_range']) ? $event['price_range'] : null;
        $ticket_release_date            = !empty($event['ticket_release_date']) ? $event['ticket_release_date'] : null;
        $contact_information            = !empty($event['contact_information']) ? $event['contact_information'] : null;
        $contact_phone                  = !empty($event['contact_phone']) ? $event['contact_phone'] : null;
        $contact_email                  = !empty($event['contact_email']) ? $event['contact_email'] : null;
        $age_group_from                 = !empty($event['age_group_from']) ? $event['age_group_from'] : null;
        $age_group_to                   = !empty($event['age_group_to']) ? $event['age_group_to'] : null;
        $accessibility                  = !empty($event['accessibility']) ? $event['accessibility'] : null;

        // Check if event passes taxonomy filters
        $pass_tax_filter = $this->checkFilters(
            $this->filterTaxonomies($categories, 0),
            $this->filterTaxonomies($tags, 1)
        );

        // Check if event already exist and get the post status
        $event_id = $this->checkIfEventExists($event['id']);
        if ($event_id) {
            $post_status = get_post_status($event_id);
        } elseif (is_array($occasions) && !empty($occasions)) {
            // Unpublish the event if occasion is longer than limit option
            $unpublish_limit = get_field('event_unpublish_limit', 'option');
            foreach ($occasions as $occasion) {
                $start = new \DateTime($occasion['start_date']);
                $end = new \Datetime($occasion['end_date']);
                $difference = $end->diff($start)->format("%a");
                if ($unpublish_limit != null && $unpublish_limit >= 0 && ($difference > $unpublish_limit)) {
                    $post_status = 'draft';
                }
            }
        }

        // Save event if it passed taxonomy and group filters
        if ($pass_tax_filter) {
            try {
                $event = new Event(
                    array(
                        'post_title' => $post_title,
                        'post_content' => $post_content,
                        'post_status' => $post_status,
                    ),
                    array(
                        '_event_manager_id' => $event['id'],
                        'categories' => $categories,
                        'tags' => $tags,
                        'groups' => $groups,
                        'occasions_complete' => $occasions,
                        'event_link' => $event_link,
                        'additional_links' => $additional_links,
                        'related_events' => $related_events,
                        'location' => $location,
                        'latitude' => $latitude,
                        'longitude' => $longitude,
                        'additional_locations' => $additional_locations,
                        'organizers' => $organizers,
                        'supporters' => $supporters,
                        'booking_link' => $booking_link,
                        'booking_phone' => $booking_phone,
                        'booking_email' => $booking_email,
                        'age_restriction' => $age_restriction,
                        'membership_cards' => $membership_cards,
                        'price_information' => $price_information,
                        'ticket_includes' => $ticket_includes,
                        'price_adult' => $price_adult,
                        'price_children' => $price_children,
                        'children_age' => $children_age,
                        'price_student' => $price_student,
                        'price_senior' => $price_senior,
                        'senior_age' => $senior_age,
                        'booking_group' => $booking_group,
                        'gallery' => $gallery,
                        'facebook' => $facebook,
                        'twitter' => $twitter,
                        'instagram' => $instagram,
                        'google_music' => $google_music,
                        'spotify' => $spotify,
                        'soundcloud' => $soundcloud,
                        'deezer' => $deezer,
                        'youtube' => $youtube,
                        'vimeo' => $vimeo,
                        'last_update' => $last_update,
                        'ticket_stock' => $ticket_stock,
                        'tickets_remaining' => $tickets_remaining,
                        'additional_ticket_retailers' => $additional_ticket_retailers,
                        'additional_ticket_types' => $additional_ticket_types,
                        'price_range' => $price_range,
                        'ticket_release_date' => $ticket_release_date,
                        'contact_email' => $contact_email,
                        'contact_phone' => $contact_phone,
                        'contact_information' => $contact_information,
                        'age_group_from' => $age_group_from,
                        'age_group_to' => $age_group_to,
                        'accessibility' => $accessibility,
                    )
                );
            } catch (\Exception $e) {
                error_log(print_r($e, true));
                return;
            }
            $createSuccess = $event->save();

            if ($createSuccess && !empty($featured_media)) {
                $event->setFeaturedImageFromUrl($featured_media, true);
            }
        }
    }

    /**
     * Check if the event passes one of the taxonomy filters
     * @param  bool $cat_filter Bool, equals true if event passed category filter
     * @param  bool $tag_filter Bool, equals true if event passed tag filter
     * @return bool
     */
    public function checkFilters($cat_filter, $tag_filter): bool
    {
        $tax_filter = (empty(get_field('event_filter_cat', 'options')) && empty(
            get_field(
                'event_filter_tag',
                'options'
            )
            )) ? true : false;

        // Check category filters
        if (!empty(get_field('event_filter_cat', 'options'))) {
            $tax_filter = $cat_filter;
        }
        // Check tag filters
        if (!$tax_filter && !empty(get_field('event_filter_tag', 'options'))) {
            $tax_filter = $tag_filter;
        }

        return $tax_filter;
    }

    /**
     * Remove expired occasions from databse
     * @return void
     */
    public function removeExpiredOccasions()
    {
        global $wpdb;
        $date_limit = strtotime("midnight now") - 1;
        // Get all occasions from database
        $db_table = $wpdb->prefix."integrate_occasions";
        $occasions = $wpdb->get_results("SELECT * FROM $db_table ORDER BY start_date DESC", ARRAY_A);

        if (count($occasions) == 0) {
            return;
        }

        foreach ($occasions as $o) {
            // Delete the occasion if expired
            if (strtotime($o['end_date']) < $date_limit) {
                $id = $o['ID'];
                $wpdb->delete($db_table, array('ID' => $id));
            }
        }

        return;
    }

    /**
     * Remove events that has been deleted from API
     * @param $ids
     */
    public function removeDeletedEvents($ids)
    {
        global $wpdb;
        $table = $wpdb->prefix . "integrate_occasions";
        // Get all locally stored events
        $localEvents = $wpdb->get_results("SELECT event_id FROM {$table} GROUP BY event_id", ARRAY_N);
        $localEvents = array_map(function($id) {
            return $id[0];
        }, $localEvents);
        // Collect local IDs of the API events
        $apiEvents = array_map(function($id) {
            $post = get_posts(array(
                'post_type' => 'event',
                'post_status' => array('publish', 'draft'),
                'meta_key' => '_event_manager_id',
                'meta_value' => $id,
                'posts_per_page' => 1
            ));
            return $post[0]->ID ?? null;
        }, array_unique($ids));
        $apiEvents = array_filter($apiEvents);
        // Collect events that is stored locally but is missing in the API
        $diffEvents = array_diff($localEvents, $apiEvents);
        // Loop through the diff and delete its occasions
        if (!empty($diffEvents)) {
            foreach ($diffEvents as $event) {
                $wpdb->delete($table, array('event_id' => $event));
            }
        }
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
        $query = "SELECT ID FROM $wpdb->posts WHERE post_type = %s AND (post_status = %s or post_status = %s)";
        $completeQuery = $wpdb->prepare($query, $post_type, 'publish', 'draft');
        $events = $wpdb->get_results($completeQuery);

        if (count($events) == 0) {
            return;
        }

        $db_table = $wpdb->prefix."integrate_occasions";
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

        if (!empty($tax_array)) {
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
     * Delete empty event taxonomies
     * @return void
     */
    public function deleteEmptyTaxonomies()
    {
        if (!empty(get_object_taxonomies('event'))) {
            foreach (get_object_taxonomies('event') as $taxonomy) {
                // Skip Event Groups and categories
                if ($taxonomy == 'event_groups' || $taxonomy == 'event_categories') {
                    continue;
                }

                $terms = get_terms(
                    array(
                        'taxonomy' => $taxonomy,
                        'hide_empty' => false,
                        'childless' => true,
                    )
                );

                foreach ($terms as $term) {
                    if ($term->count == 0) {
                        wp_delete_term($term->term_id, $taxonomy);
                    }
                }
            }
        }
    }
}
