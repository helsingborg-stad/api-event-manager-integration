<?php 

if (function_exists('acf_add_local_field_group')) {
    acf_add_local_field_group(array(
    'key' => 'group_61e13ea95de0e',
    'title' => __('Api-URL', 'event-integration'),
    'fields' => array(
        0 => array(
            'key' => 'field_61e13eb3b9173',
            'label' => __('API Request URL', 'event-integration'),
            'name' => '',
            'type' => 'message',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'message' => __('The api provider may request you to send the request url if any issues arise in the import. Communicate this url when you are requesting assistance.', 'event-integration'),
            'new_lines' => '',
            'esc_html' => 0,
        ),
        1 => array(
            'key' => 'field_61e1418a5107c',
            'label' => __('API Request URL', 'event-integration'),
            'name' => 'api_request_url_field',
            'type' => 'text',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'default_value' => '',
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'maxlength' => '',
        ),
    ),
    'location' => array(
        0 => array(
            0 => array(
                'param' => 'options_page',
                'operator' => '==',
                'value' => 'event-options',
            ),
        ),
    ),
    'menu_order' => 0,
    'position' => 'side',
    'style' => 'default',
    'label_placement' => 'top',
    'instruction_placement' => 'label',
    'hide_on_screen' => '',
    'active' => true,
    'description' => '',
));
}