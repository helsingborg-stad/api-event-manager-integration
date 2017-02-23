<?php

namespace EventManagerIntegration;

class Event extends \EventManagerIntegration\Entity\PostManager
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

        if (! empty($this->gallery)) {
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
        $location = $this->mergeParentLocation($this->ID, $this->location);
        if (! empty($location['latitude']) && ! empty($location['longitude'])) {
            update_post_meta($this->ID, 'latitude', $location['latitude']);
            update_post_meta($this->ID, 'longitude', $location['longitude']);
        }
        update_post_meta($this->ID, 'location', $location);
    }

    /**
     * Saves additional locations as meta data
     * @return void
     */
    public function saveAddLocations()
    {
        $add_locations = array();
        if (! empty($this->additional_locations)) {
            foreach ($this->additional_locations as $key => $location) {
                $add_locations[] = $this->mergeParentLocation($this->ID, $location);
            }
        }
        update_post_meta($this->ID, 'additional_locations', $add_locations);
    }

    /**
     * Clean location array and merge with parent
     * @param  int      $post_id
     * @param  array    $location location
     * @return array    new location
     */
    public function mergeParentLocation($post_id, $location)
    {
        $location['title'] = $location['title']['rendered'];
        if (! empty($location['parent']) &&  $location['parent'] > 0) {
            $parent     = $location['parent'];
            $api_url    = get_field('event_api_url', 'option');
            $api_url    = rtrim($api_url, '/') . '/location/' . $parent;
            $parent = \EventManagerIntegration\Parser::curlApi($api_url);
            if ($parent) {
                $location['title'] = $parent['title']['rendered'] . ', ' . $location['title'];
                foreach ($location as $key => $value) {
                    if (empty($location[$key])) {
                        $location[$key] = $parent[$key];
                    }
                }
            }
        }
        unset($location['_links'], $location['id'], $location['slug'], $location['date'], $location['parent']);
        return $location;
    }

    /**
     * Saves categories as taxonomy terms
     * @return void
     */
    public function saveCategories()
    {
        wp_set_object_terms($this->ID, $this->categories, 'event_categories', false);
    }

    /**
     * Saves groups as taxonomy terms
     * @return void
     */
    public function saveGroups()
    {
        // Save group names as new array
        $event_groups = array();
        if (! empty($this->groups) && is_array($this->groups)) {
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
        wp_set_object_terms($this->ID, $this->tags, 'event_tags', false);
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
            $start_date = ! empty($o['start_date']) ? $o['start_date'] : null;
            $end_date = ! empty($o['end_date']) ? $o['end_date'] : null;
            $door_time = ! empty($o['door_time']) ? $o['door_time'] : null;
            $status = ! empty($o['status']) ? $o['status'] : null;
            $occ_exeption_information = ! empty($o['occ_exeption_information']) ? $o['occ_exeption_information'] : null;
            $content_mode = ! empty($o['content_mode']) ? $o['content_mode'] : null;
            $content = ! empty($o['content']) ? $o['content'] : null;

            $wpdb->insert($db_table, array('event_id' => $this->ID, 'start_date' => $start_date, 'end_date' => $end_date, 'door_time' => $door_time, 'status' => $status, 'exception_information' => $occ_exeption_information, 'content_mode' => $content_mode, 'content' => strip_tags(html_entity_decode($content))));
        }

        return true;
    }
}
