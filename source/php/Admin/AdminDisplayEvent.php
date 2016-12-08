<?php

/**
 * Customizes the admin edit event view to show complete event data
 */

namespace EventManagerIntegration\Admin;

class AdminDisplayEvent extends \EventManagerIntegration\PostTypes\Events
{
    public function __construct()
    {
        add_action('admin_menu', array($this, 'removePublishBox'));
        add_action('add_meta_boxes', array($this, 'addMetaBoxes'));
    }

    /* Create one or more meta boxes to be displayed on the event editor screen. */
    public function addMetaBoxes()
    {
        global $post;
        if ($post->post_type != 'event') {
            return;
        }

        // Event information meta box
        add_meta_box(
            'event-info-box',
            esc_html__('Event', 'event-integration'),
            array($this, 'eventInfo'),
            $this->slug,
            'normal',
            'high'
        );

        // Event occasions meta box
        add_meta_box(
            'event-occasion-box',
            esc_html__('Occasions', 'event-integration'),
            array($this, 'eventOccasions'),
            $this->slug,
            'normal',
            'default'
        );

        // Event meta data meta box
        add_meta_box(
            'event-meta-box',
            esc_html__('Meta data', 'event-integration'),
            array($this, 'eventMeta'),
            $this->slug,
            'normal',
            'low'
        );

        // Featured image meta box
        add_meta_box(
            'event-image-box',
            esc_html__('Featured image', 'event-integration'),
            array($this, 'eventImage'),
            $this->slug,
            'side',
            'high'
        );
    }

    /**
     * Remove publish meta box from edit Event view
     */
    public function removePublishBox()
    {
        remove_meta_box('submitdiv', 'event', 'side');
    }

    /* Display event-info-box */
    public function eventInfo($object, $box)
    {
        $id = $object->ID;
        ?>
        <div class="event-integration-box">
            <h1><?php echo get_the_title($id); ?></h1>
            <article id="event-content"><?php echo get_post_field('post_content', $id); ?></article>
        </div>
        <?php
    }

    /* Display event-occasion-box */
    public function eventOccasions($object, $box)
    {
        $occasions = \EventManagerIntegration\Helper\QueryEvents::getEventOccasions($object->ID);
        ?>

        <?php foreach ($occasions as $o): ?>
            <strong><?php _e('Start date', 'event-integration'); ?></strong>
            <p><?php echo $o->start_date; ?></p>

            <strong><?php _e('End date', 'event-integration'); ?></strong>
            <p><?php echo $o->end_date; ?></p>

            <?php if (! empty($o->door_time)): ?>
                <strong><?php _e('Door time', 'event-integration') ?></strong>
                <p><?php echo $o->door_time; ?></p>
            <?php endif ?>

            <?php if (! empty($o->status)): ?>
                <strong><?php _e('Status', 'event-integration') ?></strong>
                <p><?php echo $o->status; ?></p>
            <?php endif ?>

            <?php if (! empty($o->exception_information)): ?>
                <strong><?php _e('Exception information', 'event-integration') ?></strong>
                <p><?php echo $o->exception_information; ?></p>
            <?php endif ?>

            <?php if (! empty($o->content)): ?>
                <strong><?php _e('Custom content', 'event-integration') ?></strong>
                <p><?php echo $o->content; ?></p>
            <?php endif ?>

            <hr>

        <?php endforeach ?>

    <?php
    }

    /* Display event-meta-box */
    public function eventMeta($object, $box)
    {
        $meta_data = \EventManagerIntegration\Helper\QueryEvents::getEventMeta($object->ID);
        ?>

        <?php foreach ($meta_data as $m): ?>
            <?php if (substr($m->meta_key, 0, 1) === '_' || $m->meta_key == 'occasions_complete') { continue; } ?>

            <h3><?php echo ucfirst(str_replace('_', ' ', $m->meta_key)); ?></h3>
            <p><?php echo $this->outputMeta($m->meta_value); ?></p>
        <?php endforeach ?>

    <?php
    }

    /* Display event-image-box */
    public function eventImage($object, $box)
    {
        ?>
        <div class="event-integration-box">
            <?php echo get_the_post_thumbnail( $object->ID, array( 266, 266), array('class' => 'featured-image')); ?>
        </div>
    <?php
    }

    /**
     * [outputMeta description]
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function outputMeta($data) {
        $unserialized = @unserialize($data);
        if ($unserialized !== false) {
            return $this->multiImplode($unserialized, ', ');
        } else {
            return $data;
        }
    }

    function multiImplode($array, $glue) {
    $str = '';

    foreach ($array as $key => $item) {
        if (empty($item)) {
            continue;
        }
        if (is_array($item)) {
            $str .= '<p>' . $this->multiImplode($item, $glue) . $glue . '</p>';
        } else {
            $str .= $item . $glue;
        }
    }
    $str = substr($str, 0, 0-strlen($glue));

    return $str;
    }



}
