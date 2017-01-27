<?php

namespace EventManagerIntegration\Widget;

use \EventManagerIntegration\Helper\QueryEvents as QueryEvents;

class DisplayEvents extends \WP_Widget
{
    public function __construct()
    {
        parent::__construct(
            'display_events',
            __('Events', 'event-integration'),
            array(
                "description" => __('Display upcoming events from Event Manager API.', 'event-integration')
            )
        );
    }

    /**
    * Outputs the content for the current Display Events widget instance.
    *
    * @param array $args     Widget arguments.
    * @param array $instance Saved values from database.
    */
    public function widget($args, $instance)
    {
        if ( ! isset( $args['widget_id'] ) ) {
            $args['widget_id'] = $this->id;
        }
        $title = ( ! empty( $instance['title'] ) ) ? $instance['title'] : __( 'Recent Posts' );
        $title = apply_filters( 'widget_title', $title, $instance, $this->id_base );
        $limit = isset($instance['limit']) ? intval($instance['limit']) : null;
        $days_ahead = isset($instance['days_ahead']) ? $instance['days_ahead'] : null;
        $show_date = isset( $instance['show_date'] ) ? $instance['show_date'] : true;
        $show_image = isset( $instance['show_image'] ) ? $instance['show_image'] : false;
        $show_content = isset( $instance['show_content'] ) ? $instance['show_content'] : false;
        $show_location = isset( $instance['show_location'] ) ? $instance['show_location'] : false;
        $content_limit = isset($instance['content_limit']) ? $instance['content_limit'] : null;

        $start_date = date('Y-m-d H:i:s', strtotime("today midnight"));
        $end_date = date('Y-m-d H:i:s', strtotime("tomorrow midnight +$days_ahead days") - 1);
        $events = QueryEvents::getEventsByInterval($start_date, $end_date, $limit);

        ?>
        <?php echo $args['before_widget']; ?>
        <?php if ( $title ) {
            echo $args['before_title'] . $title . $args['after_title'];
        } ?>
        <ul>
        <?php if (!$events) : ?>
            <li><?php _e('No events found', 'event-integration'); ?></li>
        <?php else: ?>
        <?php foreach ($events as $event) : ?>
            <li>
            <?php if ($show_image) : ?>
                <?php echo get_the_post_thumbnail( $event->ID, 'large', array('class' => 'event-img')); ?>
            <?php endif; ?>

            <?php if (! empty($event->post_title && isset($event->post_title))) : ?>
                <?php $date_url = preg_replace('/\D/', '', $event->start_date); ?>
                <a href="<?php echo esc_url( add_query_arg( 'date', $date_url, get_page_link($event->ID) ) )?>"><?php echo $event->post_title ?></a>
            <?php endif; ?>

            <?php if ($show_date && ! empty($event->start_date && isset($event->start_date))) : ?>
                <span><?php echo \EventManagerIntegration\App::formatEventDate($event->start_date, $event->end_date) ?></span>
            <?php endif; ?>

           <?php if ($show_location && get_post_meta($event->ID, 'location', true)) : ?>
                <?php $location = get_post_meta($event->ID, 'location', true); ?>
                <span><?php echo sprintf(__('Location: %s', 'event-integration'), $location['title']) ?></span>
            <?php endif; ?>

            <?php if ($show_content && $event->content_mode == 'custom' && ! empty($event->content)) : ?>
                <?php echo QueryEvents::stringLimiter( $event->content, $content_limit ); ?>
            <?php elseif($show_content && ! empty($event->post_content)): ?>
                <?php echo QueryEvents::stringLimiter( $event->post_content, $content_limit ); ?>
            <?php endif; ?>
            </li>
        <?php endforeach; ?>
        <?php endif; ?>
        </ul>
        <?php echo $args['after_widget'];
    }

    /**
    * Handles updating the settings for the current Display Events widget instance.
    *
    * @param array $new_instance Values just sent to be saved.
    * @param array $old_instance Previously saved values from database.
    *
    * @return array Updated safe values to be saved.
    */
    public function update($new_instance, $old_instance)
    {
        $instance = array();
        $instance['title'] = (! empty($new_instance['title'])) ? strip_tags($new_instance['title']) : '';
        $instance['limit'] = absint($new_instance['limit']);
        $instance['days_ahead'] = absint($new_instance['days_ahead']);
        $instance['show_date'] = isset( $new_instance['show_date'] ) ? (bool) $new_instance['show_date'] : false;
        $instance['show_location'] = isset( $new_instance['show_location'] ) ? (bool) $new_instance['show_location'] : false;
        $instance['show_image'] = isset( $new_instance['show_image'] ) ? (bool) $new_instance['show_image'] : false;
        $instance['show_content'] = isset( $new_instance['show_content'] ) ? (bool) $new_instance['show_content'] : false;
        $instance['content_limit'] = $new_instance['content_limit'];
        return $instance;
    }

    /**
    * Outputs the settings form for the Display Events widget.
    *
    * @param array $instance Previously saved values from database.
    */
    public function form($instance)
    {
        $title = ! empty( $instance['title'] ) ? $instance['title'] : '';
        $limit = isset( $instance['limit'] ) ? $instance['limit'] : 5;
        $days_ahead = isset( $instance['days_ahead'] ) ? absint( $instance['days_ahead'] ) : 5;
        $show_date = isset( $instance['show_date'] ) ? (bool) $instance['show_date'] : true;
        $show_image = isset( $instance['show_image'] ) ? (bool) $instance['show_image'] : false;
        $show_content = isset( $instance['show_content'] ) ? (bool) $instance['show_content'] : false;
        $show_location = isset( $instance['show_location'] ) ? (bool) $instance['show_location'] : false;
        $content_limit = isset( $instance['content_limit'] ) ? $instance['content_limit'] : -1;
        ?>
        <p><label for="<?php echo esc_attr($this->get_field_id('title'));?>"><?php esc_attr_e('Title:', 'event-integration'); ?></label>
        <input class="widefat" id="<?php echo esc_attr($this->get_field_id('title')); ?>" name="<?php echo esc_attr($this->get_field_name('title')); ?>" type="text" value="<?php echo esc_attr($title);?>"></p>

        <p><label for="<?php echo esc_attr($this->get_field_id('limit'));?>"><?php esc_attr_e('Number of events to show:', 'event-integration'); ?></label>
        <input class="tiny-text" id="<?php echo esc_attr($this->get_field_id('limit')); ?>" name="<?php echo esc_attr($this->get_field_name('limit')); ?>" type="number" value="<?php echo esc_attr($limit);?>"></p>

        <p><label for="<?php echo esc_attr($this->get_field_id('days_ahead'));?>"><?php esc_attr_e('Days interval:', 'event-integration'); ?></label>
        <input id="<?php echo esc_attr($this->get_field_id('days_ahead')); ?>" name="<?php echo esc_attr($this->get_field_name('days_ahead')); ?>" type="number" min="0" size="5" value="<?php echo esc_attr($days_ahead);?>"></p>

        <p><input class="checkbox" type="checkbox"<?php checked( $show_date ); ?> id="<?php echo $this->get_field_id( 'show_date' ); ?>" name="<?php echo $this->get_field_name( 'show_date' ); ?>" />
        <label for="<?php echo $this->get_field_id( 'show_date' ); ?>"><?php _e( 'Display date', 'event-integration' ); ?></label></p>

        <p><input class="checkbox" type="checkbox"<?php checked( $show_image ); ?> id="<?php echo $this->get_field_id( 'show_image' ); ?>" name="<?php echo $this->get_field_name( 'show_image' ); ?>" />
        <label for="<?php echo $this->get_field_id( 'show_image' ); ?>"><?php _e( 'Display featured image', 'event-integration' ); ?></label></p>

        <p><input class="checkbox" type="checkbox"<?php checked( $show_location ); ?> id="<?php echo $this->get_field_id( 'show_location' ); ?>" name="<?php echo $this->get_field_name( 'show_location' ); ?>" />
        <label for="<?php echo $this->get_field_id( 'show_location' ); ?>"><?php _e( 'Display location', 'event-integration' ); ?></label></p>

        <p><input class="checkbox" type="checkbox"<?php checked( $show_content ); ?> id="<?php echo $this->get_field_id( 'show_content' ); ?>" name="<?php echo $this->get_field_name( 'show_content' ); ?>" />
        <label for="<?php echo $this->get_field_id( 'show_content' ); ?>"><?php _e( 'Display description', 'event-integration' ); ?></label></p>

        <p><label for="<?php echo esc_attr($this->get_field_id('content_limit'));?>"><?php esc_attr_e('Description letter limit:', 'event-integration'); ?></label>
        <input id="<?php echo esc_attr($this->get_field_id('content_limit')); ?>" name="<?php echo esc_attr($this->get_field_name('content_limit')); ?>" type="number" min="-1" size="5" placeholder="<?php _e( '-1 equals no limit', 'event-integration' ); ?>" value="<?php echo esc_attr($content_limit);?>"></p>

        <?php
    }

}
