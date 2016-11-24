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
                $this->setFeaturedImageFromUrl($image->url, false);
            }
        }
        return true;
    }

    /**
     * Save event occasions as post meta if they occur today or later
     * @return [type] [description]
     */
    public function saveOccasions()
    {
        delete_post_meta($this->ID, 'occasion');

        $today = strtotime("midnight now") - 1;
        $occasion = array();
        foreach ($this->occasions_complete as $o) {
            $start_date = ! empty($o->start_date) ? $o->start_date : null;
            $end_date = ! empty($o->end_date) ? $o->end_date : null;
            if ($start_date != null && $end_date != null && strtotime($end_date) > $today) {
                $door_time = ! empty($o->door_time) ? $o->door_time : null;
                $status = ! empty($o->status) ? $o->status : null;
                $occ_exeption_information = ! empty($o->occ_exeption_information) ? $o->occ_exeption_information : null;
                $content_mode = ! empty($o->content_mode) ? $o->content_mode : null;
                $content = ! empty($o->content) ? $o->content : null;

                $occasion['start_date'] = $start_date;
                $occasion['end_date'] = $end_date;
                $occasion['door_time'] = $door_time;
                $occasion['status'] = $status;
                $occasion['occ_exeption_information'] = $occ_exeption_information;
                $occasion['content_mode'] = $content_mode;
                $occasion['content'] = $content;

                add_post_meta($this->ID, 'occasion', $occasion, false);
            }
        }
    }

}
