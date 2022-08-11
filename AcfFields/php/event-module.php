<?php 

if (function_exists('acf_add_local_field_group')) {
    acf_add_local_field_group(array(
    'key' => 'group_583fe4ee88439',
    'title' => __('Display events', 'event-integration'),
    'fields' => array(
        0 => array(
            'key' => 'field_5b2ace4dc65a8',
            'label' => __('Show as', 'event-integration'),
            'name' => 'mod_event_display',
            'type' => 'radio',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'choices' => array(
                'list' => __('Lista', 'event-integration'),
                'index' => __('Index', 'event-integration'),
            ),
            'allow_null' => 0,
            'other_choice' => 0,
            'save_other_choice' => 0,
            'default_value' => __('list', 'event-integration'),
            'layout' => 'horizontal',
            'return_format' => 'value',
        ),
        1 => array(
            'key' => 'field_5b2ad8bc7cf90',
            'label' => __('Columns', 'event-integration'),
            'name' => 'mod_event_columns',
            'type' => 'select',
            'instructions' => '',
            'required' => 1,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_5b2ace4dc65a8',
                        'operator' => '==',
                        'value' => 'index',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'choices' => array(
                1 => __('One Column', 'event-integration'),
                2 => __('Two column', 'event-integration'),
                3 => __('Three column', 'event-integration'),
                4 => __('Four column', 'event-integration'),
            ),
            'default_value' => 3,
            'allow_null' => 0,
            'multiple' => 0,
            'ui' => 0,
            'ajax' => 0,
            'return_format' => 'value',
            'placeholder' => '',
        ),
        2 => array(
            'key' => 'field_583fe58262287',
            'label' => __('Number of events to show', 'event-integration'),
            'name' => 'mod_event_limit',
            'type' => 'number',
            'instructions' => __('Set to -1 to show all.', 'event-integration'),
            'required' => 1,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_5b2ace4dc65a8',
                        'operator' => '==',
                        'value' => 'list',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '33',
                'class' => '',
                'id' => '',
            ),
            'default_value' => 5,
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'min' => -1,
            'max' => '',
            'step' => '',
        ),
        3 => array(
            'key' => 'field_584ec8318df1d',
            'label' => __('Show pagination', 'event-integration'),
            'name' => 'mod_event_pagination',
            'type' => 'true_false',
            'instructions' => __('Display pagination below the event list.', 'event-integration'),
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '33',
                'class' => '',
                'id' => '',
            ),
            'message' => __('Show pagination', 'event-integration'),
            'default_value' => 1,
            'ui' => 0,
            'ui_on_text' => '',
            'ui_off_text' => '',
        ),
        4 => array(
            'key' => 'field_5c5d4a3f27386',
            'label' => __('Per page', 'event-integration'),
            'name' => 'mod_event_per_page',
            'type' => 'number',
            'instructions' => __('Number of events to display per page.', 'event-integration'),
            'required' => 1,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_5b2ace4dc65a8',
                        'operator' => '==',
                        'value' => 'index',
                    ),
                    1 => array(
                        'field' => 'field_584ec8318df1d',
                        'operator' => '==',
                        'value' => '1',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '33',
                'class' => '',
                'id' => '',
            ),
            'default_value' => '',
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'min' => '',
            'max' => '',
            'step' => '',
        ),
        5 => array(
            'key' => 'field_58e6370d4f34c',
            'label' => __('Archive link', 'event-integration'),
            'name' => 'mod_event_archive',
            'type' => 'true_false',
            'instructions' => __('Show link to event archive page.', 'event-integration'),
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '33',
                'class' => '',
                'id' => '',
            ),
            'message' => __('Show link', 'event-integration'),
            'default_value' => 0,
            'ui' => 0,
            'ui_on_text' => '',
            'ui_off_text' => '',
        ),
        6 => array(
            'key' => 'field_591af4eeb1561',
            'label' => __('Pagination button limit', 'event-integration'),
            'name' => 'mod_event_pagination_limit',
            'type' => 'number',
            'instructions' => __('Limit number of pagination buttons. -1 to show all.', 'event-integration'),
            'required' => 1,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_584ec8318df1d',
                        'operator' => '==',
                        'value' => '1',
                    ),
                    1 => array(
                        'field' => 'field_5b2ace4dc65a8',
                        'operator' => '==',
                        'value' => 'list',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '50',
                'class' => '',
                'id' => '',
            ),
            'default_value' => -1,
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'min' => '',
            'max' => '',
            'step' => '',
        ),
        7 => array(
            'key' => 'field_591b06d53284e',
            'label' => __('Show pagination arrows', 'event-integration'),
            'name' => 'mod_event_nav_arrows',
            'type' => 'true_false',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_584ec8318df1d',
                        'operator' => '==',
                        'value' => '1',
                    ),
                    1 => array(
                        'field' => 'field_5b2ace4dc65a8',
                        'operator' => '==',
                        'value' => 'list',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '50',
                'class' => '',
                'id' => '',
            ),
            'message' => __('Show previous and next page arrows on pagination', 'event-integration'),
            'default_value' => 1,
            'ui' => 0,
            'ui_on_text' => '',
            'ui_off_text' => '',
        ),
        8 => array(
            'key' => 'field_583ffd8d10925',
            'label' => __('Days interval', 'event-integration'),
            'name' => 'mod_event_interval',
            'type' => 'number',
            'instructions' => __('Include events from today to the given number of days.', 'event-integration'),
            'required' => 1,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '100',
                'class' => '',
                'id' => '',
            ),
            'default_value' => 7,
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'min' => 0,
            'max' => '',
            'step' => '',
        ),
        9 => array(
            'key' => 'field_5d5bda9c80adf',
            'label' => __('Only show events starting on todays date', 'event-integration'),
            'name' => 'mod_event_only_todays_date',
            'type' => 'true_false',
            'instructions' => __('Only show events starting on todays date', 'event-integration'),
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'message' => '',
            'default_value' => 0,
            'ui' => 0,
            'ui_on_text' => '',
            'ui_off_text' => '',
        ),
        10 => array(
            'key' => 'field_5d5bdb7f80ae0',
            'label' => __('Hide past events', 'event-integration'),
            'name' => 'mod_events_hide_past_events',
            'type' => 'true_false',
            'instructions' => __('Hide past events', 'event-integration'),
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'message' => '',
            'default_value' => 0,
            'ui' => 0,
            'ui_on_text' => '',
            'ui_off_text' => '',
        ),
        11 => array(
            'key' => 'field_583fefb6634a1',
            'label' => __('Fields', 'event-integration'),
            'name' => 'mod_event_fields',
            'type' => 'checkbox',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'choices' => array(
                'occasion' => __('Occasion', 'event-integration'),
                'image' => __('Image', 'event-integration'),
                'location' => __('Location', 'event-integration'),
                'description' => __('Description', 'event-integration'),
            ),
            'allow_custom' => 0,
            'save_custom' => 0,
            'default_value' => array(
            ),
            'layout' => 'vertical',
            'toggle' => 1,
            'return_format' => 'value',
        ),
        12 => array(
            'key' => 'field_5b2ae170ae36f',
            'label' => __('Image ratio', 'event-integration'),
            'name' => 'mod_event_image_ratio',
            'type' => 'select',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_5b2ace4dc65a8',
                        'operator' => '==',
                        'value' => 'index',
                    ),
                    1 => array(
                        'field' => 'field_583fefb6634a1',
                        'operator' => '==',
                        'value' => 'image',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'choices' => array(
                '1-1' => __('Square (1:1)', 'event-integration'),
                '16-9' => __('Standard Video (16:9)', 'event-integration'),
                '4-3' => __('Standard TV (4:3)', 'event-integration'),
            ),
            'default_value' => __('1-1', 'event-integration'),
            'allow_null' => 0,
            'multiple' => 0,
            'ui' => 0,
            'ajax' => 0,
            'return_format' => 'value',
            'placeholder' => '',
        ),
        13 => array(
            'key' => 'field_58de5b2d62d45',
            'label' => __('Occasion position', 'event-integration'),
            'name' => 'mod_event_occ_pos',
            'type' => 'radio',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_583fefb6634a1',
                        'operator' => '==',
                        'value' => 'occasion',
                    ),
                    1 => array(
                        'field' => 'field_5b2ace4dc65a8',
                        'operator' => '==',
                        'value' => 'list',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'choices' => array(
                'below' => __('Below title', 'event-integration'),
                'left' => __('Left column', 'event-integration'),
            ),
            'allow_null' => 0,
            'other_choice' => 0,
            'save_other_choice' => 0,
            'default_value' => __('below : Below title', 'event-integration'),
            'layout' => 'vertical',
            'return_format' => 'value',
        ),
        14 => array(
            'key' => 'field_583fee36634a0',
            'label' => __('Description letter limit', 'event-integration'),
            'name' => 'mod_event_descr_limit',
            'type' => 'number',
            'instructions' => __('Set to -1 to show the whole description.', 'event-integration'),
            'required' => 0,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_583fefb6634a1',
                        'operator' => '==',
                        'value' => 'description',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'default_value' => -1,
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'min' => -1,
            'max' => '',
            'step' => '',
        ),
        15 => array(
            'key' => 'field_586cf5c8d3686',
            'label' => __('Groups', 'event-integration'),
            'name' => 'mod_event_groups_show',
            'type' => 'true_false',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'message' => __('Show events from all groups', 'event-integration'),
            'default_value' => 1,
            'ui' => 0,
            'ui_on_text' => '',
            'ui_off_text' => '',
        ),
        16 => array(
            'key' => 'field_586cf5d0d3687',
            'label' => __('Select groups', 'event-integration'),
            'name' => 'mod_event_groups_list',
            'type' => 'taxonomy',
            'instructions' => __('Show events from the selected groups.', 'event-integration'),
            'required' => 1,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_586cf5c8d3686',
                        'operator' => '!=',
                        'value' => '1',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'taxonomy' => 'event_groups',
            'field_type' => 'checkbox',
            'allow_null' => 0,
            'add_term' => 0,
            'save_terms' => 0,
            'load_terms' => 0,
            'return_format' => 'id',
            'multiple' => 0,
        ),
        17 => array(
            'key' => 'field_58455b0e93178',
            'label' => __('Categories', 'event-integration'),
            'name' => 'mod_event_categories_show',
            'type' => 'true_false',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'message' => __('Show events from all categories', 'event-integration'),
            'default_value' => 1,
            'ui' => 0,
            'ui_on_text' => '',
            'ui_off_text' => '',
        ),
        18 => array(
            'key' => 'field_5845578c5f0a0',
            'label' => __('Select categories', 'event-integration'),
            'name' => 'mod_event_categories_list',
            'type' => 'taxonomy',
            'instructions' => __('Show events from the selected categories.', 'event-integration'),
            'required' => 1,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_58455b0e93178',
                        'operator' => '!=',
                        'value' => '1',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'taxonomy' => 'event_categories',
            'field_type' => 'checkbox',
            'allow_null' => 0,
            'add_term' => 0,
            'save_terms' => 0,
            'load_terms' => 0,
            'return_format' => 'id',
            'multiple' => 0,
        ),
        19 => array(
            'key' => 'field_58458b20dde03',
            'label' => __('Tags', 'event-integration'),
            'name' => 'mod_event_tags_show',
            'type' => 'true_false',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'message' => __('Show events from all tags', 'event-integration'),
            'default_value' => 1,
            'ui' => 0,
            'ui_on_text' => '',
            'ui_off_text' => '',
        ),
        20 => array(
            'key' => 'field_58458b57dde04',
            'label' => __('Select tags', 'event-integration'),
            'name' => 'mod_event_tags_list',
            'type' => 'taxonomy',
            'instructions' => __('Show events from the selected tags.', 'event-integration'),
            'required' => 1,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_58458b20dde03',
                        'operator' => '!=',
                        'value' => '1',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'taxonomy' => 'event_tags',
            'field_type' => 'checkbox',
            'allow_null' => 0,
            'add_term' => 0,
            'save_terms' => 0,
            'load_terms' => 0,
            'return_format' => 'id',
            'multiple' => 0,
        ),
        21 => array(
            'key' => 'field_584f9e68aa31a',
            'label' => __('Default image', 'event-integration'),
            'name' => 'mod_event_def_image',
            'type' => 'image',
            'instructions' => __('Will display if event image is missing.', 'event-integration'),
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'return_format' => 'array',
            'preview_size' => 'thumbnail',
            'library' => 'all',
            'min_width' => '',
            'min_height' => '',
            'min_size' => '',
            'max_width' => '',
            'max_height' => '',
            'max_size' => '',
            'mime_types' => 'jpg, jpeg, png, gif',
        ),
        22 => array(
            'key' => 'field_58abf724d46f6',
            'label' => __('Location', 'event-integration'),
            'name' => 'mod_event_geographic',
            'type' => 'google_map',
            'instructions' => __('Show events that occurs at a specified location.', 'event-integration'),
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'center_lat' => '56.046467',
            'center_lng' => '12.694512',
            'zoom' => 16,
            'height' => '',
        ),
        23 => array(
            'key' => 'field_58abf72bd46f7',
            'label' => __('Distance from location', 'event-integration'),
            'name' => 'mod_event_distance',
            'type' => 'number',
            'instructions' => __('To show events occurring nearby the given location, enter maximum distance in km. Leave blank to only show events from the exact position.', 'event-integration'),
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
            'min' => '',
            'max' => '',
            'step' => '',
        ),
        24 => array(
            'key' => 'field_5c6e698e8d331',
            'label' => __('Filters', 'event-integration'),
            'name' => '',
            'type' => 'message',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_5b2ace4dc65a8',
                        'operator' => '==',
                        'value' => 'index',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'message' => __('Activate search and filters.', 'event-integration'),
            'new_lines' => 'wpautop',
            'esc_html' => 0,
        ),
        25 => array(
            'key' => 'field_5c5d4dbd07268',
            'label' => __('Text search', 'event-integration'),
            'name' => 'mod_event_filter_search',
            'type' => 'true_false',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_5b2ace4dc65a8',
                        'operator' => '==',
                        'value' => 'index',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '20',
                'class' => '',
                'id' => '',
            ),
            'message' => '',
            'default_value' => 0,
            'ui' => 1,
            'ui_on_text' => '',
            'ui_off_text' => '',
        ),
        26 => array(
            'key' => 'field_5c5d501e9acbb',
            'label' => __('Categories', 'event-integration'),
            'name' => 'mod_event_filter_categories',
            'type' => 'true_false',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_5b2ace4dc65a8',
                        'operator' => '==',
                        'value' => 'index',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '20',
                'class' => '',
                'id' => '',
            ),
            'message' => '',
            'default_value' => 0,
            'ui' => 1,
            'ui_on_text' => '',
            'ui_off_text' => '',
        ),
        27 => array(
            'key' => 'field_5d1b26a7f03ff',
            'label' => __('Tags', 'event-integration'),
            'name' => 'mod_event_filter_tags',
            'type' => 'true_false',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_5b2ace4dc65a8',
                        'operator' => '==',
                        'value' => 'index',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '20',
                'class' => '',
                'id' => '',
            ),
            'message' => '',
            'default_value' => 0,
            'ui' => 1,
            'ui_on_text' => '',
            'ui_off_text' => '',
        ),
        28 => array(
            'key' => 'field_5c5d50499acbc',
            'label' => __('Date search', 'event-integration'),
            'name' => 'mod_event_filter_dates',
            'type' => 'true_false',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_5b2ace4dc65a8',
                        'operator' => '==',
                        'value' => 'index',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '20',
                'class' => '',
                'id' => '',
            ),
            'message' => '',
            'default_value' => 0,
            'ui' => 1,
            'ui_on_text' => '',
            'ui_off_text' => '',
        ),
        29 => array(
            'key' => 'field_5c765ee693303',
            'label' => __('Age', 'event-integration'),
            'name' => 'mod_event_filter_age_group',
            'type' => 'true_false',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_5b2ace4dc65a8',
                        'operator' => '==',
                        'value' => 'index',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '20',
                'class' => '',
                'id' => '',
            ),
            'message' => '',
            'default_value' => 0,
            'ui' => 1,
            'ui_on_text' => '',
            'ui_off_text' => '',
        ),
        30 => array(
            'key' => 'field_5c7d24413bf80',
            'label' => __('Age range from', 'event-integration'),
            'name' => 'mod_event_filter_age_range_from',
            'type' => 'number',
            'instructions' => '',
            'required' => 1,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_5c765ee693303',
                        'operator' => '==',
                        'value' => '1',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '25',
                'class' => '',
                'id' => '',
            ),
            'default_value' => '',
            'placeholder' => '',
            'prepend' => '',
            'append' => __('year', 'event-integration'),
            'min' => '',
            'max' => '',
            'step' => '',
        ),
        31 => array(
            'key' => 'field_5c7d25be3d7fd',
            'label' => __('Age range to', 'event-integration'),
            'name' => 'mod_event_filter_age_range_to',
            'type' => 'number',
            'instructions' => '',
            'required' => 1,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_5c765ee693303',
                        'operator' => '==',
                        'value' => '1',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '25',
                'class' => '',
                'id' => '',
            ),
            'default_value' => '',
            'placeholder' => '',
            'prepend' => '',
            'append' => __('year', 'event-integration'),
            'min' => '',
            'max' => '',
            'step' => '',
        ),
        32 => array(
            'key' => 'field_62f3af8237389',
            'label' => __('Show date badge', 'event-integration'),
            'name' => 'mod_event_show_date_badge',
            'type' => 'true_false',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_5b2ace4dc65a8',
                        'operator' => '==',
                        'value' => 'index',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '20',
                'class' => '',
                'id' => '',
            ),
            'message' => '',
            'default_value' => 0,
            'ui' => 1,
            'ui_on_text' => '',
            'ui_off_text' => '',
        ),
    ),
    'location' => array(
        0 => array(
            0 => array(
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'mod-event',
            ),
        ),
        1 => array(
            0 => array(
                'param' => 'block',
                'operator' => '==',
                'value' => 'acf/event',
            ),
        ),
    ),
    'menu_order' => 0,
    'position' => 'normal',
    'style' => 'default',
    'label_placement' => 'top',
    'instruction_placement' => 'label',
    'hide_on_screen' => '',
    'active' => true,
    'description' => '',
    'show_in_rest' => 0,
    'acfe_display_title' => '',
    'acfe_autosync' => '',
    'acfe_form' => 0,
    'acfe_meta' => '',
    'acfe_note' => '',
));
}