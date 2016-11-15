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
        $this->post_content = strip_tags( html_entity_decode( $this->post_content ) );
    }

    /**
     * Do after save
     * @return bool ,used if post got removed or not
     */
    public function afterSave()
    {
        return true;
    }
}
