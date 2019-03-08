<?php

namespace EventManagerIntegration\Helper;

class SingleEventData
{
    /**
     * Get single event date
     * @return array
     */
    public static function singleEventDate()
    {
        global $post;

        $singleOccasion = array();
        $get_date = (!empty(get_query_var('date'))) ? get_query_var('date') : false;
        $occasions = QueryEvents::getEventOccasions($post->ID);

        //Get nearest occasions from time if no date arg
        if (!$get_date) {
            $get_date = self::getNextOccasionDate($occasions);
        }

        if (is_array($occasions) && count($occasions) == 1) {
            $singleOccasion = (array)$occasions[0];
            $singleOccasion['formatted'] = \EventManagerIntegration\App::formatEventDate($singleOccasion['start_date'], $singleOccasion['end_date']);
            $singleOccasion['date_parts'] = self::dateParts($singleOccasion['start_date']);
        } elseif (is_array($occasions) && $get_date != false) {
            foreach ($occasions as $occasion) {
                $occasion = (array)$occasion;
                $event_date = preg_replace('/\D/', '', $occasion['start_date']);
                if ($get_date == $event_date) {
                    $singleOccasion = $occasion;
                    $singleOccasion['formatted'] = \EventManagerIntegration\App::formatEventDate($occasion['start_date'], $occasion['end_date']);
                    $singleOccasion['date_parts'] = self::dateParts($occasion['start_date']);
                }
            }
        }

        return $singleOccasion;
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
