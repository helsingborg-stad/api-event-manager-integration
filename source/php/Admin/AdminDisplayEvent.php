<?php

/**
 * Customizes the admin edit event view to show complete event data
 */

namespace EventManagerIntegration\Admin;

class AdminDisplayEvent extends \EventManagerIntegration\PostTypes\Events
{

    public $post_type = 'event';

    public function __construct()
    {
        add_action('admin_menu', array($this, 'removePublishBox'));
        add_action('add_meta_boxes', array($this, 'addMetaBoxes'));
    }

    /*
     * Adding meta boxes to be displayed on the event editor view.
     */
    public function addMetaBoxes()
    {
        add_meta_box(
            'event-info-box',
            esc_html__('Event', 'event-integration'),
            array($this, 'eventInfo'),
            $this->post_type,
            'normal',
            'high'
        );

        add_meta_box(
            'event-meta-box',
            esc_html__('Meta data', 'event-integration'),
            array($this, 'eventMeta'),
            $this->post_type,
            'normal',
            'low'
        );

        add_meta_box(
            'event-gallery-box',
            esc_html__('Gallery', 'event-integration'),
            array($this, 'eventGallery'),
            $this->post_type,
            'normal',
            'low'
        );

        add_meta_box(
            'event-image-box',
            esc_html__('Featured image', 'event-integration'),
            array($this, 'eventImage'),
            $this->post_type,
            'side',
            'high'
        );

        add_meta_box(
            'event-occasion-box',
            esc_html__('Occasions', 'event-integration'),
            array($this, 'eventOccasions'),
            $this->post_type,
            'side',
            'high'
        );
    }

    /**
     * Remove publish meta box from edit Event view
     */
    public function removePublishBox()
    {
        remove_meta_box('submitdiv', $this->post_type, 'side');
    }

    /*
     * Display event-info-box
     */
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

    /*
     * Display event-occasion-box
     */
    public function eventOccasions($object, $box)
    {
        $occasions = \EventManagerIntegration\Helper\QueryEvents::getEventOccasions($object->ID);
        ?>

        <ul>
        <?php foreach ($occasions as $o): ?>
            <li>
                <span><?php echo \EventManagerIntegration\App::formatEventDate($o->start_date, $o->end_date) ?></span>
            </li>
        <?php endforeach ?>
        </ul>

        <?php
    }

    /*
     * Display event-meta-box
     */
    public function eventMeta($object, $box)
    {
        echo do_shortcode('[single_event_information]');
    }

    /*
     * Display event-gallery-box
     */
    public function eventGallery($object, $box)
    {
        echo do_shortcode('[gallery]');
    }

    /*
     * Display event-image-box
     */
    public function eventImage($object, $box)
    {
        ?>
        <div class="event-integration-box">
            <?php if (get_the_post_thumbnail($object->ID)): ?>
                <?php echo get_the_post_thumbnail( $object->ID, array( 266, 266), array('class' => 'featured-image')); ?>
            <?php else: ?>
                <p><?php _e('Image missing', 'event-integration') ?></p>
            <?php endif; ?>
        </div>
    <?php
    }

    /**
     * Unserialize and implode arrays
     * @param  mixed $data data to be formatted
     * @return string
     */
    public function outputMeta($data) {
        $unserialized = @unserialize($data);
        if ($unserialized !== false) {
            return $this->multiImplode($unserialized, ', ');
        } else {
            return $data;
        }
    }

    /**
     * Implode arrays into strings
     * @param  array  $array  array to be imploded
     * @param  string $glue   used to separate array objects
     * @return string
     */
    public function multiImplode($array, $glue) {
    $string = '';

    foreach ($array as $key => $item) {
        if (empty($item)) {
            continue;
        }
        if (is_array($item)) {
            $string .= '<p>' . $this->multiImplode($item, $glue) . '</p>';
        } else {
            $string .= $item . $glue;
        }
    }
    $string = substr($string, 0, 0-strlen($glue));

    return $string;
    }

}
