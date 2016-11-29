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
        $this->post_content = strip_tags(html_entity_decode($this->post_content));
    }

    /**
     * Do after save
     * @return bool Used if post got removed or not
     */
    public function afterSave()
    {
        $this->saveOccasions();

        if (! empty($this->gallery)) {
            foreach ($this->gallery as $key => $image) {
                $this->setFeaturedImageFromUrl($image['url'], false);
            }
        }

        return true;
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
        $wpdb->delete($db_table, array( 'event_id' => $this->ID ), array( '%d' ));
        $today = strtotime("midnight now") - 1;

        // Loop through all occasions for the event
        $i = 0;
        foreach ($this->occasions_complete as $o) {
            $start_date = ! empty($o['start_date']) ? $o['start_date'] : null;
            $end_date = ! empty($o['end_date']) ? $o['end_date'] : null;
            // Save occasion to db if not expired
            if ($start_date != null && $end_date != null && strtotime($end_date) > $today) {
                $door_time = ! empty($o['door_time']) ? $o['door_time'] : null;
                $status = ! empty($o['status']) ? $o['status'] : null;
                $occ_exeption_information = ! empty($o['occ_exeption_information']) ? $o['occ_exeption_information'] : null;
                $content_mode = ! empty($o['content_mode']) ? $o['content_mode'] : null;
                $content = ! empty($o['content']) ? $o['content'] : null;

                $wpdb->insert($db_table, array('event_id' => $this->ID, 'start_date' => $start_date, 'end_date' => $end_date, 'door_time' => $door_time, 'status' => $status, 'exeption_information' => $occ_exeption_information, 'content_mode' => $content_mode, 'content' => strip_tags(html_entity_decode($content))));
            $i++;
            }
        }

        // Return true if one or more occasions was saved. Remove event if zero occasions was inserted.
        if ($i > 0) {
            return true;
        } else {
            wp_delete_post($this->ID, true);
            return false;
        }

    }
}
