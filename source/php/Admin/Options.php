<?php

namespace EventManagerIntegration\Admin;

class Options
{
    public function __construct()
    {
        if (function_exists('acf_add_options_sub_page')) {
            acf_add_options_sub_page(array(
                'page_title'    => _x('Event manager integration options', 'ACF', 'event-integration'),
                'menu_title'    => _x('Options', 'Event manager integration options', 'event-integration'),
                'menu_slug'     => 'acf-options-options',
                'parent_slug'   => 'edit.php?post_type=event',
                'capability'    => 'manage_options'
            ));
        }
    }
}
