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
        add_action('admin_menu', array($this, 'removeMetaBoxes'));
        add_action('add_meta_boxes', array($this, 'addMetaBoxes'));
    }

    /**
     * Remove meta boxes from edit Event view
     */
    public function removeMetaBoxes()
    {
        if (function_exists('get_field')) {
            if (get_field('event_update_button', 'option') == false) {
                remove_meta_box('submitdiv', $this->post_type, 'side');
            }
        }
        remove_meta_box('acf-group_56c33cf1470dc', $this->post_type, 'side');
        remove_meta_box('pageparentdiv', $this->post_type, 'side');
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
        $id = $object->ID;
        $get_meta = get_post_meta($id);
        $meta = array();
        foreach ($get_meta as $key => $value) {
            if (is_array($value) && count($value) == 1) {
                $meta[$key] = \EventManagerIntegration\Shortcodes\SingleEventAdmin::unserData($value[0]);
            } else {
                $meta[$key] = $value;
            }
        }

        $ret = '';

        // Information
        $event_info = \EventManagerIntegration\Shortcodes\SingleEventAdmin::eventInfo(false, false, $meta);
        if (! empty($event_info)) {
            $ret .= '<ul><li><h3>' . __('Information', 'event-integration') . '</h3></li></ul>';
            $ret .= $event_info;
        }

        // Location
        $event_location = \EventManagerIntegration\Shortcodes\SingleEventAdmin::eventLocation($meta);
        if (isset($meta['location'])) {
            $ret .= '<ul><li><h3>'.__('Location', 'event-integration').'</h3></li></ul>';
            $ret .= $event_location;
        }

        // Booking information
        $booking_info = \EventManagerIntegration\Shortcodes\SingleEventAdmin::eventBooking($meta);
        if (strpos($booking_info, '<li>')) {
            $ret .= '<ul><li><h3>'.__('Booking', 'event-integration').'</h3></li></ul>';
            $ret .= $booking_info;
        }

        // Contact
        if (! empty($contact = \EventManagerIntegration\Shortcodes\SingleEventAdmin::eventContact($meta))) {
            $ret .= '<ul><li><h3>'.__('Contact', 'event-integration').'</h3></li></ul>';
            $ret .= '<ul>' . $contact . '</ul>';
        }

        // Organizers
        $event_organizer = \EventManagerIntegration\Shortcodes\SingleEventAdmin::eventOrganizer($meta);
        if (! empty($meta['organizers'])) {
            $ret .= '<ul><li><h3>'.__('Organizer', 'event-integration').'</h3></li></ul>';
            $ret .= $event_organizer;
        }

        // Social media and streaming links
        $link_keys = array('facebook', 'twitter', 'instagram', 'google_music', 'spotify', 'soundcloud', 'deezer', 'youtube', 'vimeo');
        $links_exist = (count(array_intersect_key(array_flip($link_keys), $meta)) > 0) ? true : false;
        $event_links = \EventManagerIntegration\Shortcodes\SingleEventAdmin::eventLinks($meta);
        if ($links_exist) {
            $ret .= '<ul><li><h3>' . __('Links', 'event-integration') . '</h3></li></ul>';
            $ret .= $event_links;
        }

        $even_taxonomies = \EventManagerIntegration\Shortcodes\SingleEventAdmin::eventTaxonomies($meta);
        $ret .= '<ul><li><h3>' . __('Taxonomies', 'event-integration') . '</h3></li></ul>';
        $ret .= $even_taxonomies;

        echo $ret;
    }

    /*
     * Display event-gallery-box
     */
    public function eventGallery($object, $box)
    {
        $id = $object->ID;
        $args = array(
            'post_parent'    => $id,
            'post_type'      => 'attachment',
            'numberposts'    => -1,
            'post_status'    => 'any',
            'post_mime_type' => 'image',
            'orderby'        => 'menu_order',
            'order'           => 'ASC'
        );

        $images = get_posts($args);

        if ($images) {
            foreach($images as $image) {
                echo wp_get_attachment_image($image->ID, array('300', '200'), '');
            }
        }
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
