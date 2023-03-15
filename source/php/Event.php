<?php

namespace EventManagerIntegration;

class Event extends Entity\PostManager
{
    public $post_type = 'event';

    /**
     * Stuff to do before save
     * @return void
     */
    public function beforeSave()
    {
        $this->post_title = strip_tags(html_entity_decode($this->post_title));
        $this->post_content = html_entity_decode($this->post_content);
    }

    /**
     * Do after save
     * @return bool Used if post got removed or not
     */
    public function afterSave()
    {
        $this->saveOccasions();
        $this->saveCategories();
        $this->saveGroups();
        $this->saveTags();
        $this->saveLocation();
        $this->saveAddLocations();
        $this->saveLanguage();

        if (!empty($this->gallery)) {
            foreach ($this->gallery as $key => $image) {
                $this->setFeaturedImageFromUrl($image['url'], false);
            }
        }
        return true;
    }

    /**
     * Saves location as meta data
     * @return void
     */
    public function saveLocation()
    {
        if ($this->location != null) {
            if (!empty($this->location['parent']) && $this->location['parent']['id'] > 0) {
                $this->location['title'] = $this->location['parent']['title'] . ', ' . $this->location['title'];
            }

            if (!empty($location['latitude']) && !empty($location['longitude'])) {
                update_post_meta($this->ID, 'latitude', $location['latitude']);
                update_post_meta($this->ID, 'longitude', $location['longitude']);
            }
            update_post_meta($this->ID, 'location', $this->location);
        }
    }

    /**
     * Saves additional locations as meta data
     * @return void
     */
    public function saveAddLocations()
    {
        if (is_array($this->additional_locations) && !empty($this->additional_locations)) {
            foreach ($this->additional_locations as &$location) {
                if (!empty($location['parent']) && $location['parent']['id'] > 0) {
                    $location['title'] = $location['parent']['title'] . ', ' . $location['title'];
                }
            }
            update_post_meta($this->ID, 'additional_locations', $this->additional_locations);
        }
    }

    /**
     * Saves categories as taxonomy terms
     * @return void
     */
    public function saveCategories()
    {
        if (empty($this->categories)) {
            $terms = wp_get_post_terms($this->ID, 'event_categories', array('fields' => 'all'));
            if (!empty($terms)) {
                foreach ($terms as $term) {
                    wp_remove_object_terms($this->ID, $term->term_id, 'event_categories');
                }
                delete_post_meta($this->ID, 'categories');
            }
        } else {
            wp_set_object_terms($this->ID, $this->categories, 'event_categories', false);
        }
    }

    /**
     * Saves groups as taxonomy terms
     * @return void
     */
    public function saveGroups()
    {
        // Save group names as new array
        $event_groups = array();
        if (!empty($this->groups) && is_array($this->groups)) {
            foreach ($this->groups as $group) {
                $event_groups[] .= $group['name'];
            }
        }
        wp_set_object_terms($this->ID, $event_groups, 'event_groups', false);
    }

    /**
     * Saves tags as taxonomy terms
     * @return void
     */
    public function saveTags()
    {
        if (empty($this->tags)) {
            $terms = wp_get_post_terms($this->ID, 'event_tags', array('fields' => 'all'));
            if (!empty($terms)) {
                foreach ($terms as $term) {
                    wp_remove_object_terms($this->ID, $term->term_id, 'event_tags');
                }
                delete_post_meta($this->ID, 'tags');
            }
        } else {
            wp_set_object_terms($this->ID, $this->tags, 'event_tags', false);
        }
    }

    /**
     * Save event occasions to integrate_occasions table
     * @return boolean true if one or more occasions was saved, false if not.
     */
    public function saveOccasions()
    {
        global $wpdb;

        // Delete all occasions related to the event
        $db_table = $wpdb->prefix . "integrate_occasions";
        $wpdb->delete($db_table, array('event_id' => $this->ID), array('%d'));

        // Remove post if occasions is missing
        if ($this->occasions_complete == null || empty($this->occasions_complete)) {
            wp_delete_post($this->ID, true);

            return false;
        }

        // Loop through occasions for the event
        foreach ($this->occasions_complete as $o) {
            $start_date = !empty($o['start_date']) ? $o['start_date'] : null;
            $end_date = !empty($o['end_date']) ? $o['end_date'] : null;
            $door_time = !empty($o['door_time']) ? $o['door_time'] : null;
            $status = !empty($o['status']) ? $o['status'] : null;
            $occ_exeption_information = !empty($o['occ_exeption_information']) ? $o['occ_exeption_information'] : null;
            $content_mode = !empty($o['content_mode']) ? $o['content_mode'] : null;
            $content = !empty($o['content']) ? $o['content'] : null;
            $location_mode = !empty($o['location_mode']) ? $o['location_mode'] : null;
            $location = !empty($o['location']) ? maybe_serialize($o['location']) : null;
            $oc_booking_link = !empty($o['booking_link']) ? $o['booking_link'] : null;

            $wpdb->insert(
                $db_table,
                array(
                    'event_id' => $this->ID,
                    'start_date' => $start_date,
                    'end_date' => $end_date,
                    'door_time' => $door_time,
                    'status' => $status,
                    'exception_information' => $occ_exeption_information,
                    'content_mode' => $content_mode,
                    'content' => ($content),
                    'location_mode' => ($location_mode),
                    'location' => ($location),
                    'booking_link' => ($oc_booking_link),
                )
            );
        }

        return true;
    }

    /**
     * Apply language and translations to the event.
     * Compatible with the plugin 'Polylang'
     */
    public function saveLanguage()
    {
        // Bail if Polylang is not active
        if (!is_plugin_active('polylang-pro/polylang.php')) {
            return;
        }

        // Apply language to the event
        if (!empty($this->lang)) {
            pll_set_post_language($this->ID, $this->lang);
        }

        // Define which events are translations of each other
        if (!empty($this->translations)) {
            $translations = $this->translations;
            // Get locally installed languages
            $localLangs = pll_languages_list();
            // Remove all languages that don't exist locally
            $translations = array_filter(
                $translations,
                function ($translation) use ($localLangs) {
                    return in_array($translation, $localLangs);
                },
                ARRAY_FILTER_USE_KEY
            );

            // Replace the old IDs with new events IDs
            foreach ($translations as $key => &$id) {
                $id = $this->getEventByOriginalId($id);
                if (!$id) {
                    // Remove if event cant't be found
                    unset($translations[$key]);
                }
            }
            // Define event translations
            pll_save_post_translations($translations);
        }
    }

    /**
     * Find an event by it's original id
     * @param int $id Event ID
     * @return Int|bool
     */
    public function getEventByOriginalId($id)
    {
        $args = array(
            'meta_query' => array(
                array(
                    'key' => '_event_manager_id',
                    'value' => $id,
                ),
            ),
            'post_type' => $this->post_type,
            'posts_per_page' => '1',
        );

        $events = get_posts($args);

        if (is_wp_error($events) || !isset($events[0]->ID)) {
            return false;
        }

        return $events[0]->ID;
    }
}
