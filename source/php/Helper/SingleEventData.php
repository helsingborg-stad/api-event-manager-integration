<?php

namespace EventManagerIntegration\Helper;

class SingleEventData
{
    /**
     * Get single event location
     *
     * @param [int]    $postId   The post ID
     * @param [string] $dateTime Date time string
     * @return void|array
     */
    public static function getEventLocation($postId = null, $dateTime = null)
    {
        // Get post ID global object if param is empty
        if (!$postId) {
            global $post;
            if (!$postId = $post->ID ?? null) {
                return;
            }
        }

        // Get "master" location
        $location = get_field('location', $postId);

        // Get single event opccasion
        $occasion = self::singleEventDate($postId, $dateTime);

        // Override location with current occasion lovation if set
        if (is_array($occasion)
            && isset($occasion['location_mode'])
            && isset($occasion['location'])
            && $occasion['location_mode'] === 'custom'
            && !empty($occasion['location'])) {

            $location = $occasion['location'];
        }

        return $location;
    }

    /**
     * Get single event date
     *
     * @param [type] $postId     The post ID
     * @param [string] $dateTime Date time string
     * @return void
     */
    public static function singleEventDate($postId = null, $dateTime = null)
    {
        // Get post ID global object if param is empty
        if (!$postId) {
            global $post;
            if (!$postId = $post->ID ?? null) {
                return;
            }
        }

        $singleOccasion = array();
        $occasions = QueryEvents::getEventOccasions($postId);

        // Fromat date string
        if ($dateTime) {
            $dateTime = date('YmdHis', strtotime($dateTime));
        }

        // Try to get date from query string
        if (!$dateTime) {
            $dateTime = (!empty(get_query_var('date'))) ? get_query_var('date') : null;
        }

        //Get nearest occasions from time if no date arg
        if (!$dateTime) {
            $dateTime = self::getNextOccasionDate($occasions);
        }

        if (is_array($occasions) && count($occasions) == 1) {
            $singleOccasion = (array)$occasions[0];
            $singleOccasion['formatted'] = \EventManagerIntegration\App::formatEventDate($singleOccasion['start_date'], $singleOccasion['end_date']);
            $singleOccasion['date_parts'] = self::dateParts($singleOccasion['start_date']);
        } elseif (is_array($occasions) && $dateTime != false) {
            foreach ($occasions as $occasion) {
                $occasion = (array)$occasion;
                $event_date = preg_replace('/\D/', '', $occasion['start_date']);
                if ($dateTime === $event_date) {
                    $singleOccasion = $occasion;
                    $singleOccasion['formatted'] = \EventManagerIntegration\App::formatEventDate($occasion['start_date'], $occasion['end_date']);
                    $singleOccasion['date_parts'] = self::dateParts($occasion['start_date']);
                }
            }
        }
        
        if(!empty($singleOccasion)) {
            $singleOccasion['duration_formatted'] = self::getFormattedTimeDiff(strtotime($singleOccasion['start_date']), strtotime($singleOccasion['end_date']));
        }

        return $singleOccasion;
    }

    /**
     * Get a formatted time diff for two dates
     * @param  integer  $start  Event start date timestamp
     * @param  integer  $end  Event end date timestamp
     * @return string 
     */
    public static function getFormattedTimeDiff($start, $end)
    {
        $diff = ($end - $start) / 60 / 60;

        // Add one day to number of days if the diff is more than 24 hours but less than 1 week
        return $diff >= 24 && $diff < (24 * 7)
            ? sprintf(__('%d days', 'event-integration'), (floor($diff / 24)) + 1)
            : human_time_diff($start, $end);
    }

    /**
     * Get next event occasion date in time
     * @param  array  $occasions  All occasions of an event
     * @param  string $dateFormat event start date
     * @return string/boolean
     */
    public static function getNextOccasionDate($occasions, $dateFormat = 'YmdHis')
    {
        if (!is_array($occasions) || empty($occasions)) {
            return false;
        }

        $startDates = array();
        foreach ($occasions as $occasion) {
            //Skip if event has ended
            if (time() > strtotime($occasion->end_date) || !isset($occasion->start_date) || !isset($occasion->end_date)) {
                continue;
            }

            $startDates[] = strtotime($occasion->start_date);
        }

        return date($dateFormat, self::getClosest(time(), $startDates));
    }

    /**
     * Get the closest value from array of values
     * @param  string $search Value to compare
     * @param  array  $arr    event start date
     * @return string/boolean
     */
    public static function getClosest($search, $arr)
    {
        $closest = null;
        foreach ($arr as $item) {
            if ($closest === null || abs($search - $closest) > abs($item - $search)) {
                $closest = $item;
            }
        }
        return $closest;
    }

    /**
     * Get date parts as array
     * @param  string $start_date event start date
     * @return array              date values
     */
    public static function dateParts($start_date)
    {
        $start = date('Y-m-d H:i:s', strtotime($start_date));
        $date = array(
            'date' => mysql2date('j', $start, true),
            'month' => mysql2date('F', $start, true),
            'month_short' => substr(mysql2date('F', $start, true), 0, 3),
            'year' => mysql2date('Y', $start, true),
            'time' => mysql2date('H:i', $start, true),
        );

        return $date;
    }
}
