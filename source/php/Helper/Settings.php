<?php

namespace EventManagerIntegration\Helper;

class Settings {
    public static function getEventSettings() 
    {
        return (object) [
            'cleanHero' => get_field('event_single_clean_hero', 'option'),
        ];
    }
}