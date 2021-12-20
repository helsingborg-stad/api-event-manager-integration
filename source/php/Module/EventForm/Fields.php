<?php

namespace EventManagerIntegration\Module\EventForm;

class Fields
{
    /**
     * Return form fields data
     * @param int $id module ID
     * @return array Form field data
     */
    public static function get(?int $id = 0)
    {
        $data = get_fields($id);
        $fields = [
            // Section 1
            [
                'name' => 'title',
                'label' => __('Event name', 'event-integration'),
                'description' => __('Name of the event.', 'event-integration'),
                'type' => 'text',
                'required' => true,
            ],
            [
                'name' => 'content',
                'label' => __('Description', 'event-integration'),
                'description' => __(
                    'Describe your event. What happens and why should you visit it?',
                    'event-integration'
                ),
                'type' => 'textarea',
                'required' => true,
            ],
            [
                'name' => 'event_image',
                'label' => __('Upload an image', 'event-integration'),
                'description' =>
                    __(
                        'Keep in mind that the image may be cropped, so avoid text in the image.',
                        'event-integration'
                    ) . '<br>' .
                    __(
                        'Images with identifiable persons are not accepted and will be replaced.',
                        'event-integration'
                    ) . '<br>' .
                    __('You must also have the right to use and distribute the image.', 'event-integration'),
                'type' => 'image',
                'required' => false,
            ],
            [
                'name' => 'event_image_copyright_compliance',
                'label' => __('Rights', 'event-integration'),
                'description' => __(
                    'Describe your event. What happens and why should you visit it?',
                    'event-integration'
                ),
                'type' => 'checkbox',
                'required' => true,
                'options' => [
                    'approved' => __(
                        'I have the right to use the image/images to promote this event.',
                        'event-integration'
                    )
                ],
                'condition' => [
                    [
                        "key" => "event_image",
                        "compare" => "!=",
                        "value" => ''
                    ]
                ]
            ],
            [
                'name' => 'event_image_gdpr_compliance',
                'label' => __('Rights', 'event-integration'),
                'description' => __(
                    'Describe your event. What happens and why should you visit it?',
                    'event-integration'
                ),
                'type' => 'radio',
                'required' => true,
                'options' => [
                    'no' => __('No person is identifiable in the photo', 'event-integration'),
                    'yes' => __('There are identifiable people in the picture / pictures', 'event-integration'),
                ],
                'condition' => [
                    [
                        "key" => "event_image",
                        "compare" => "!=",
                        "value" => ''
                    ]
                ]
            ],
            [
                'name' => 'event_image_marketing_compliance',
                'label' => '',
                'description' => __(
                    'Describe your event. What happens and why should you visit it?',
                    'event-integration'
                ),
                'type' => 'checkbox',
                'required' => true,
                'options' => [
                    'approved' => __(
                        'They have approved that the image is used to market this event and have been informed that after the image has been added to the database, it may appear in various channels to market the event.',
                        'event-integration'
                    )
                ],
                'condition' => [
                    [
                        "key" => "event_image",
                        "compare" => "!=",
                        "value" => ''
                    ]
                ]
            ],
            // End Section 1

            //  Section 2
            [
                'name' => 'event_schema_type',
                'label' => __('Schedule', 'event-integration'),
                'description' => __(
                    'Describe your event. What happens and why should you visit it?',
                    'event-integration'
                ),
                'type' => 'radio',
                'required' => true,
                'options' => [
                    'single-date' => __('Enstaka datum', 'event-integration'),
                    'recurring-event' => __('Återkommande tillfällen', 'event-integration'),
                ],
                'value' => 'not-recurring',
            ],

            [
                'name' => 'event_schema_start_date',
                'label' => __('Start date', 'event-integration'),
                'description' => __(
                    'Describe your event. What happens and why should you visit it?',
                    'event-integration'
                ),
                'type' => 'date',
                'required' => true,
                'condition' => [
                    [
                        "key" => "event_schema_type",
                        "compare" => "=",
                        "value" => 'single-date'
                    ]
                ],
            ],
            [
                'name' => 'event_schema_start_time',
                'label' => __('Start time', 'event-integration'),
                'description' => __(
                    'Describe your event. What happens and why should you visit it?',
                    'event-integration'
                ),
                'type' => 'time',
                'required' => true,
                'condition' => [
                    [
                        "key" => "event_schema_type",
                        "compare" => "=",
                        "value" => 'single-date'
                    ]
                ],
            ],

            [
                'name' => 'event_schema_end_date',
                'label' => __('End date', 'event-integration'),
                'description' => __(
                    'Describe your event. What happens and why should you visit it?',
                    'event-integration'
                ),
                'type' => 'date',
                'required' => true,
                'condition' => [
                    [
                        "key" => "event_schema_type",
                        "compare" => "=",
                        "value" => 'single-date'
                    ]
                ],
            ],

            [
                'name' => 'event_schema_end_time',
                'label' => __('End time', 'event-integration'),
                'description' => __(
                    'Describe your event. What happens and why should you visit it?',
                    'event-integration'
                ),
                'type' => 'time',
                'required' => true,
                'condition' => [
                    [
                        "key" => "event_schema_type",
                        "compare" => "=",
                        "value" => 'single-date'
                    ]
                ],
            ],

            [
                'name' => 'event_schema_recurring',
                'label' => __('Rights', 'event-integration'),
                'description' => __(
                    'Describe your event. What happens and why should you visit it?',
                    'event-integration'
                ),
                'type' => 'repeater',
                'minRows' => 1,
                'subFields' => [
                    [
                        'name' => 'start_date',
                        'label' => __('Rights', 'event-integration'),
                        'description' => __(
                            'Describe your event. What happens and why should you visit it?',
                            'event-integration'
                        ),
                        'type' => 'date',
                        'required' => true,
                        'condition' => [
                            [
                                "key" => "event_schema_type",
                                "compare" => "=",
                                "value" => 'single-date'
                            ]
                        ],
                    ],
                    [
                        'name' => 'start_time',
                        'label' => __('Rights', 'event-integration'),
                        'description' => __(
                            'Describe your event. What happens and why should you visit it?',
                            'event-integration'
                        ),
                        'type' => 'date',
                        'required' => true,
                        'condition' => [
                            [
                                "key" => "event_schema_type",
                                "compare" => "=",
                                "value" => 'single-date'
                            ]
                        ],
                    ],

                    [
                        'name' => 'end_date',
                        'label' => __('Rights', 'event-integration'),
                        'description' => __(
                            'Describe your event. What happens and why should you visit it?',
                            'event-integration'
                        ),
                        'type' => 'date',
                        'required' => true,
                        'condition' => [
                            [
                                "key" => "event_schema_type",
                                "compare" => "=",
                                "value" => 'single-date'
                            ]
                        ],
                    ],
                    [
                        'name' => 'end_time',
                        'label' => __('Rights', 'event-integration'),
                        'description' => __(
                            'Describe your event. What happens and why should you visit it?',
                            'event-integration'
                        ),
                        'type' => 'date',
                        'required' => true,
                        'condition' => [
                            [
                                "key" => "event_schema_type",
                                "compare" => "=",
                                "value" => 'single-date'
                            ]
                        ],
                    ],
                ],
                'condition' => [
                    [
                        "key" => "event_schema_type",
                        "compare" => "=",
                        "value" => 'recurring-event'
                    ]
                ],
                'labels' => [
                    'addButton' => __('Add date', 'event-integration'),
                    'removeButton' => __('Remove date', 'event-integration'),
                ],

            ],
            // End Section 2


            // Section 3
            [
                'name' => 'event_website_url',
                'label' => __('Website', 'event-integration'),
                'description' => __(
                    'Describe your event. What happens and why should you visit it?',
                    'event-integration'
                ),
                'type' => 'url',
                'required' => true,
            ],
            [
                'name' => 'event_booking_url',
                'label' => __('Event booking page', 'event-integration'),
                'description' => __(
                    'Describe your event. What happens and why should you visit it?',
                    'event-integration'
                ),
                'type' => 'url',
                'required' => false,
            ],
            [
                'name' => 'event_price_adult',
                'label' => __('Event booking page', 'event-integration'),
                'description' => __(
                    'Describe your event. What happens and why should you visit it?',
                    'event-integration'
                ),
                'type' => 'number',
                'required' => false,
                'suffix' => 'kr'
            ],
            [
                'name' => 'event_price_student',
                'label' => __('Event booking page', 'event-integration'),
                'description' => __(
                    'Describe your event. What happens and why should you visit it?',
                    'event-integration'
                ),
                'type' => 'number',
                'required' => false,
                'suffix' => 'kr'
            ],
            [
                'name' => 'event_price_kid',
                'label' => __('Event booking page', 'event-integration'),
                'description' => __(
                    'Describe your event. What happens and why should you visit it?',
                    'event-integration'
                ),
                'type' => 'number',
                'required' => false,
                'suffix' => 'kr'
            ],
            [
                'name' => 'event_age_kid',
                'label' => __('Event booking page', 'event-integration'),
                'description' => __(
                    'Describe your event. What happens and why should you visit it?',
                    'event-integration'
                ),
                'type' => 'number',
                'required' => false,
                'suffix' => __('years', 'event-integration')
            ],
            [
                'name' => 'event_price_senior',
                'label' => __('Event booking page', 'event-integration'),
                'description' => __(
                    'Describe your event. What happens and why should you visit it?',
                    'event-integration'
                ),
                'type' => 'number',
                'required' => false,
                'suffix' => 'kr'
            ],
            [
                'name' => 'event_age_senior',
                'label' => __('Event booking page', 'event-integration'),
                'description' => __(
                    'Describe your event. What happens and why should you visit it?',
                    'event-integration'
                ),
                'type' => 'number',
                'required' => false,
                'suffix' => __('years', 'event-integration')
            ],
            [
                'name' => 'event_target_age',
                'label' => __('Rights', 'event-integration'),
                'description' => __(
                    'Describe your event. What happens and why should you visit it?',
                    'event-integration'
                ),
                'type' => 'radio',
                'required' => true,
                'options' => [
                    'all' => __('All ages', 'event-integration'),
                    'specified' => __('Specified age group', 'event-integration'),
                ],
                'value' => '',
            ],
            [
                'name' => 'event_target_age',
                'label' => __('Rights', 'event-integration'),
                'description' => __(
                    'Describe your event. What happens and why should you visit it?',
                    'event-integration'
                ),
                'type' => 'radio',
                'required' => true,
                'options' => [
                    'all' => __('All ages', 'event-integration'),
                    'specified' => __('Specified age group', 'event-integration'),
                ],
                'value' => '',
            ],
            [
                'name' => 'event_target_age_from',
                'label' => __('From', 'event-integration'),
                'description' => __(
                    'Describe your event. What happens and why should you visit it?',
                    'event-integration'
                ),
                'type' => 'number',
                'required' => false,
                'suffix' => __('years', 'event-integration'),
                'condition' => [
                    [
                        "key" => "event_target_age",
                        "compare" => "=",
                        "value" => 'specified'
                    ]
                ],
            ],
            [
                'name' => 'event_target_age_to',
                'label' => __('To', 'event-integration'),
                'description' => __(
                    'Describe your event. What happens and why should you visit it?',
                    'event-integration'
                ),
                'type' => 'number',
                'required' => false,
                'suffix' => __('years', 'event-integration'),
                'condition' => [
                    [
                        "key" => "event_target_age",
                        "compare" => "=",
                        "value" => 'specified'
                    ]
                ],
            ],
            // End Section 3


            // Section 4

            // End Section 4
        ];

        return apply_filters(
            'EventManagerIntegration/Module/EventForm/Fields',
            $fields,
            $data
        );
    }
}
