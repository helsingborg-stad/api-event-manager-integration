<?php 

if (function_exists('acf_add_local_field_group')) {
    acf_add_local_field_group(array(
    'key' => 'group_5948e8bc3bf75',
    'title' => __('Location', 'event-integration'),
    'fields' => array(
        0 => array(
            'key' => 'field_5948e8d9bd5f1',
            'label' => __('Display information', 'event-integration'),
            'name' => 'mod_location_fields',
            'type' => 'checkbox',
            'instructions' => __('Choose which information to display.', 'event-integration'),
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'choices' => array(
                'address' => __('Address', 'event-integration'),
                'open_hours' => __('Open hours', 'event-integration'),
                'organizers' => __('Organizers', 'event-integration'),
                'prices' => __('Prices', 'event-integration'),
                'links' => __('Links', 'event-integration'),
            ),
            'default_value' => array(
                0 => 'address',
            ),
            'layout' => 'vertical',
            'toggle' => 0,
            'return_format' => 'value',
        ),
    ),
    'location' => array(
        0 => array(
            0 => array(
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'mod-location',
            ),
        ),
    ),
    'menu_order' => 0,
    'position' => 'normal',
    'style' => 'default',
    'label_placement' => 'top',
    'instruction_placement' => 'label',
    'hide_on_screen' => '',
    'active' => 1,
    'description' => '',
));
}