<?php

namespace EventManagerIntegration\Parser;

use \EventManagerIntegration\Event as Event;

class HbgEventApi extends \EventManagerIntegration\Parser
{
    public function __construct($url)
    {
        parent::__construct($url);
    }

    public function start()
    {
        $ch = curl_init();
        $options = [
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL            => $this->url,
        ];

        curl_setopt_array($ch, $options);
        $events = json_decode(curl_exec($ch));
        curl_close($ch);
        if (!$events || (is_object($events) && $events->code == 'Error')) {
            return false;
        }

        foreach ($events as $event) {
            $this->saveEvent($event);
        }
    }

    /**
     * Save event to database
     * @param  object $event Event data
     * @return void
     */
    public function saveEvent($event)
    {
        $post_title = ! empty($event->title->rendered) ? $event->title->rendered : null;
        $post_content = ! empty($event->content->rendered) ? $event->content->rendered : null;
        $image = ! empty($event->featured_media->source_url) ? $event->featured_media->source_url : null;
        $categories = ! empty($event->event_categories) ? $event->event_categories : null;
        $tags = ! empty($event->event_tags) ? $event->event_tags : null;
        $event_link = ! empty($event->event_link) ? $event->event_link : null;
        $additional_links = ! empty($event->additional_links) ? $event->additional_links : null;
        $related_events = ! empty($event->related_events) ? $event->related_events : null;
        $location = ! empty($event->location) ? $event->location : null;
        $additional_locations = ! empty($event->additional_locations) ? $event->additional_locations : null;
        $organizers = ! empty($event->organizers) ? $event->organizers : null;
        $supporters = ! empty($event->supporters) ? $event->supporters : null;
        $booking_link = ! empty($event->booking_link) ? $event->booking_link : null;
        $booking_phone = ! empty($event->booking_phone) ? $event->booking_phone : null;
        $age_restriction = ! empty($event->age_restriction) ? $event->age_restriction : null;
        $membership_cards = ! empty($event->membership_cards) ? $event->membership_cards : null;
        $price_information = ! empty($event->price_information) ? $event->price_information : null;
        $ticket_includes = ! empty($event->ticket_includes) ? $event->ticket_includes : null;
        $price_adult = ! empty($event->price_adult) ? $event->price_adult : null;

        $event = new Event(
            array(
            'post_title'            => $post_title,
            'post_content'          => $post_content,
            ),
            array(
            '_event_manager_id'     => $event->id,
            'image'                 => $image,
            'categories'            => $categories,
            'tags'                  => $tags,
            'event_link'            => $event_link,
            'additional_links'      => $additional_links,
            'related_events'        => $related_events,
            'location'              => $location,
            'additional_locations'  => $additional_locations,
            'supporters'            => $supporters,
            'booking_link'          => $booking_link,
            'booking_phone'         => $booking_phone,
            'age_restriction'       => $age_restriction,
            'membership_cards'      => $membership_cards,
            'price_information'     => $price_information,
            'ticket_includes'       => $ticket_includes,
            'price_adult'           => $price_adult,
            )
        );

        $createSuccess = $event->save();
        if ($createSuccess) {
            ++$this->nrOfNewEvents;
        }

        if (!is_null($event->image)) {
            $event->setFeaturedImageFromUrl($event->image);
        }
    }

    /**
     * Filter, if add or not to add
     * @param  array $categories All categories
     * @return bool
     */
    public function filter($categories)
    {
        $passes = true;

        if (get_field('xcap_filter_categories', 'options')) {
            $filters = array_map('trim', explode(',', get_field('xcap_filter_categories', 'options')));
            $categoriesLower = array_map('strtolower', $categories);
            $passes = false;

            foreach ($filters as $filter) {
                if (in_array(strtolower($filter), $categoriesLower)) {
                    $passes = true;
                }
            }
        }

        return $passes;
    }
}
