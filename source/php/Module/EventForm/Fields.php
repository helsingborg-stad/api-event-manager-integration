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
            [
                'name' => 'section-1',
                'type' => 'section',
                'label' => __('1. Describe the event', 'event-integration'),
                'description' => __('Your event needs to have a name and a brief description and you also have the option to attach an image that will be visible along with the text.', 'event-integration'),
                'fields' => [
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
                        'name' => 'image_input',
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
                        'aspectRatio' => '16:9'
                    ],
                    [
                        'name' => 'event_image_copyright_compliance',
                        'label' => __('Rights', 'event-integration'),
                        'type' => 'checkbox',
                        'required' => true,
                        'options' => [
                            'approved' => __(
                                'I have the right to use the image to promote this event.',
                                'event-integration'
                            )
                        ],
                        'condition' => [
                            [
                                'key' => 'image_input',
                                'compare' => '!=',
                                'compareValue' => ''
                            ]
                        ]
                    ],
                    [
                        'name' => 'event_image_gdpr_compliance',
                        'label' => __('Rights', 'event-integration'),
                        'type' => 'radio',
                        'required' => true,
                        'options' => [
                            'no' => __('No person is identifiable in the photo', 'event-integration'),
                            'yes' => __('There are identifiable people in the picture', 'event-integration'),
                        ],
                        'condition' => [
                            [
                                'key' => 'image_input',
                                'compare' => '!=',
                                'compareValue' => ''
                            ]
                        ]
                    ],
                    [
                        'name' => 'event_image_marketing_compliance',
                        'label' => '',
                        'type' => 'checkbox',
                        'required' => true,
                        'size' => 'sm',
                        'options' => [
                            'approved' => __(
                                'They have approved that the image is used to market this event and have been informed that after the image has been added to the database, it may appear in various channels to market the event.',
                                'event-integration'
                            )
                        ],
                        'condition' => [
                            [
                                'key' => 'event_image_gdpr_compliance',
                                'compare' => '=',
                                'compareValue' => 'yes'
                            ]
                        ]
                    ],
                    // End Section 1
                ],
            ],
            [
                'name' => 'section-2',
                'type' => 'section',
                'label' => __('2. Add schedule', 'event-integration'),
                'description' => __('Add information about how often and when the event occurs.', 'event-integration'),
                'fields' => [
                    //  Section 2
                    [
                        'name' => 'event_schema_type',
                        'label' => __('Schedule', 'event-integration'),
                        'type' => 'radio',
                        'required' => true,
                        'options' => [
                            'single-date' => __('Single dates', 'event-integration'),
                            'recurring-event' => __('Recurring occasions', 'event-integration'),
                        ],
                        'value' => 'not-recurring',
                    ],
                    [
                        'name' => 'event_schema_single_date',
                        'label' => __('Rights', 'event-integration'),
                        'type' => 'repeater',
                        'minRows' => 1,
                        'fields' => [
                            [
                                'name' => 'start_date',
                                'label' => __('Start date', 'event-integration'),
                                'type' => 'date',
                                'span' => 6,
                                'required' => true,
                            ],
                            [
                                'name' => 'start_time',
                                'label' => __('Start time', 'event-integration'),
                                'type' => 'time',
                                'span' => 6,
                                'required' => true,
                            ],
                            [
                                'name' => 'end_date',
                                'label' => __('End date', 'event-integration'),
                                'type' => 'date',
                                'span' => 6,
                                'required' => true,
                            ],
                            [
                                'name' => 'end_time',
                                'label' => __('End time', 'event-integration'),
                                'type' => 'time',
                                'span' => 6,
                                'required' => true,
                            ],
                        ],
                        'condition' => [
                            [
                                'key' => 'event_schema_type',
                                'compare' => '=',
                                'compareValue' => 'single-date'
                            ]
                        ],
                        'labels' => [
                            'addButton' => __('Add date', 'event-integration'),
                            'removeButton' => __('Remove date', 'event-integration'),
                        ],
                    ],
                    [
                        'name' => 'event_schema_recurring_date',
                        'type' => 'section',
                        'fields' => [
                            [
                                'name' => 'weekday',
                                'label' => __('Weekday', 'event-integration'),
                                'description' => __(
                                    'The event will occur on this weekday.',
                                    'event-integration'
                                ),
                                'type' => 'select',
                                'required' => true,
                                'options' => [
                                    'Monday' => __('Monday', 'event-integration'),
                                    'Tuesday' => __('Tuesday', 'event-integration'),
                                    'Wednesday' => __('Wednesday', 'event-integration'),
                                    'Thursday' => __('Thursday', 'event-integration'),
                                    'Friday' => __('Friday', 'event-integration'),
                                    'Saturday' => __('Saturday', 'event-integration'),
                                    'Sunday' => __('Sunday', 'event-integration'),
                                ],
                            ],
                            [
                                'name' => 'weekly_interval',
                                'label' => __('Weekly interval', 'event-integration'),
                                'description' => __(
                                    'Enter the weekly interval when the event occurs. 1 equals every week.',
                                    'event-integration'
                                ),
                                'type' => 'number',
                                'required' => true,
                                'min' => 1,
                                'max' => 52,
                            ],
                            [
                                'name' => 'recurring_start_date',
                                'label' => __('start date', 'event-integration'),
                                'type' => 'date',
                                'span' => 6,
                                'required' => true,
                            ],
                            [
                                'name' => 'recurring_start_time',
                                'label' => __('Start time', 'event-integration'),
                                'description' => __('Start time for the event', 'event-integration'),
                                'type' => 'time',
                                'span' => 6,
                                'required' => true,
                            ],
                            [
                                'name' => 'recurring_end_date',
                                'label' => __('End date', 'event-integration'),
                                'type' => 'date',
                                'span' => 6,
                                'required' => true,
                            ],
                            [
                                'name' => 'recurring_end_time',
                                'label' => __('End time', 'event-integration'),
                                'description' => __('End time for the event', 'event-integration'),
                                'type' => 'time',
                                'span' => 6,
                                'required' => true,
                            ],
                        ],
                        'condition' => [
                            [
                                'key' => 'event_schema_type',
                                'compare' => '=',
                                'compareValue' => 'recurring-event'
                            ]
                        ],
                    ],
                    [
                        'name' => 'event_location_information_heading',
                        'label' => __('Location information', 'event-integration'),
                        'element' => 'h2',
                        'type' => 'heading',
                    ],
                    [
                        'name' => 'event_organizer',
                        'label' => __('Organizer', 'event-integration'),
                        'description' => __('Write the name of the organizer and choose from the suggestions we give you.', 'event-integration'),
                        'type' => 'radio',
                        'required' => true,
                        'options' => [
                            'existing' => __('Existing organizer', 'event-integration'),
                            'new' => __('Add a new organizer', 'event-integration'),
                        ],
                        'value' => 'existing',
                    ],
                    [
                        'name' => 'event_existing_organizer',
                        'label' => __('Organizer', 'event-integration'),
                        'type' => 'select',
                        'required' => true,
                        'options' => [
                            '' => __('Loading...', 'event-integration'),
                        ],
                        'dataSource' => [
                            'type' => 'post',
                            'name' => 'organizer',
                            'hiddenFields' => [
                                'contact_email' => 'contact_email',
                                'contact_phone' => 'contact_phone'
                            ]
                        ],
                        'condition' => [
                            [
                                'key' => 'event_organizer',
                                'compare' => '=',
                                'compareValue' => 'existing'
                            ]
                        ],
                    ],
                    [
                        'name' => 'event_new_organizer',
                        'type' => 'section',
                        'fields' => [
                            [
                                'name' => 'organizer-name',
                                'label' => __('Name', 'event-integration'),
                                'type' => 'text',
                                'required' => true,
                            ],
                            [
                                'name' => 'organizer-phone',
                                'label' => __('Phone number', 'event-integration'),
                                'type' => 'text',
                                'required' => true,
                            ],
                            [
                                'name' => 'organizer-email',
                                'label' => __('E-mail address', 'event-integration'),
                                'type' => 'email',
                                'required' => true,
                            ],
                        ],
                        'condition' => [
                            [
                                'key' => 'event_organizer',
                                'compare' => '=',
                                'compareValue' => 'new'
                            ]
                        ],
                    ],
                    [
                        'name' => 'event_location',
                        'label' => __('Location', 'event-integration'),
                        'description' => __('Write the name of the place and choose from the suggestions we give you.', 'event-integration'),
                        'type' => 'radio',
                        'required' => true,
                        'options' => [
                            'existing' => __('Existing location', 'event-integration'),
                            'new' => __('Add a new location', 'event-integration'),
                        ],
                        'value' => 'existing',
                    ],
                    [
                        'name' => 'event_existing_location',
                        'label' => __('Location', 'event-integration'),
                        'type' => 'select',
                        'required' => true,
                        'options' => [
                            '' => __('Loading...', 'event-integration'),
                        ],
                        'dataSource' => [
                            'type' => 'post',
                            'name' => 'location'
                        ],
                        'condition' => [
                            [
                                'key' => 'event_location',
                                'compare' => '=',
                                'compareValue' => 'existing'
                            ]
                        ],
                    ],
                    [
                        'name' => 'event_new_location',
                        'type' => 'section',
                        'fields' => [
                            [
                                'name' => 'location-title',
                                'label' => __('Name', 'event-integration'),
                                'type' => 'text',
                                'required' => true,
                            ],
                            [
                                'name' => 'location-street-address',
                                'label' => __('Street address', 'event-integration'),
                                'type' => 'text',
                                'required' => true,
                            ],
                            [
                                'name' => 'location-postal-code',
                                'label' => __('Postal code', 'event-integration'),
                                'type' => 'number',
                                'required' => true,
                            ],
                            [
                                'name' => 'location-city',
                                'label' => __('City', 'event-integration'),
                                'type' => 'text',
                                'required' => true,
                            ],
                        ],
                        'condition' => [
                            [
                                'key' => 'event_location',
                                'compare' => '=',
                                'compareValue' => 'new'
                            ]
                        ],
                    ],
                    [
                        'name' => 'accessibility',
                        'label' => __('Accessibility', 'event-integration'),
                        'description' => __('Select which accessibility adjustments are available for the site.', 'event-integration'),
                        'type' => 'checkbox',
                        'options' => [
                            'elevator_ ramp' => __('Elevator/ramp', 'event-integration'),
                            'accessible_toilet' => __('Handicap toilet', 'event-integration'),
                        ],
                        'value' => []
                    ],
                    // End Section 2
                ],
            ],
            [
                'name' => 'section-3',
                'type' => 'section',
                'label' => __('3. More information about the event', 'event-integration'),
                'description' => __('Where can you read more about the event, buy tickets and information about the event\'s availability.', 'event-integration'),
                'fields' => [
                    // Section 3
                    [
                        'name' => 'event_links_heading',
                        'label' => __('Links', 'event-integration'),
                        'element' => 'h3',
                        'type' => 'heading',
                    ],
                    [
                        'name' => 'event_link',
                        'label' => __('Website', 'event-integration'),
                        'type' => 'url',
                        'required' => false,
                    ],
                    [
                        'name' => 'booking_link',
                        'label' => __('Event booking page', 'event-integration'),
                        'type' => 'url',
                        'required' => false,
                    ],
                    [
                        'name' => 'event_price_heading',
                        'label' => __('Price', 'event-integration'),
                        'element' => 'h3',
                        'type' => 'heading',
                        'marginTop' => true
                    ],
                    [
                        'name' => 'event_price_free',
                        'label' => __('Free event', 'event-integration'),
                        'type' => 'checkbox',
                        'options' => [
                            'free' => __(
                                'The event is free',
                                'event-integration'
                            )
                        ]
                    ],
                    [
                        'name' => 'price_adult',
                        'label' => __('For adults', 'event-integration'),
                        'type' => 'number',
                        'required' => true,
                        'suffix' => 'kr',
                        'condition' => [
                            [
                                'key' => 'event_price_free',
                                'compare' => '=',
                                'compareValue' => false
                            ]
                        ],
                        'conditionValue' => [
                            'key' => 'event_price_free',
                            'compare' => '=',
                            'compareValue' => true,
                            'value' => 0
                        ],
                    ],
                    [
                        'name' => 'price_student',
                        'label' => __('Students', 'event-integration'),
                        'type' => 'number',
                        'required' => true,
                        'suffix' => 'kr',
                        'condition' => [
                            [
                                'key' => 'event_price_free',
                                'compare' => '=',
                                'compareValue' => false
                            ]
                        ],
                        'conditionValue' => [
                            'key' => 'event_price_free',
                            'compare' => '=',
                            'compareValue' => true,
                            'value' => 0
                        ],
                    ],
                    [
                        'name' => 'price_children',
                        'label' => __('Child price', 'event-integration'),
                        'type' => 'number',
                        'required' => true,
                        'suffix' => 'kr',
                        'condition' => [
                            [
                                'key' => 'event_price_free',
                                'compare' => '=',
                                'compareValue' => false
                            ]
                        ],
                        'conditionValue' => [
                            'key' => 'event_price_free',
                            'compare' => '=',
                            'compareValue' => true,
                            'value' => 0
                        ],
                    ],
                    [
                        'name' => 'children_age',
                        'label' => __('Age limit for child price', 'event-integration'),
                        'type' => 'number',
                        'required' => true,
                        'suffix' => __('years', 'event-integration'),
                        'condition' => [
                            [
                                'key' => 'event_price_free',
                                'compare' => '=',
                                'compareValue' => false
                            ]
                        ],
                        'conditionValue' => [
                            'key' => 'event_price_free',
                            'compare' => '=',
                            'compareValue' => true,
                            'value' => 0
                        ],
                    ],
                    [
                        'name' => 'price_senior',
                        'label' => __('Pensioner price', 'event-integration'),
                        'type' => 'number',
                        'required' => true,
                        'suffix' => 'kr',
                        'condition' => [
                            [
                                'key' => 'event_price_free',
                                'compare' => '=',
                                'compareValue' => false
                            ]
                        ],
                        'conditionValue' => [
                            'key' => 'event_price_free',
                            'compare' => '=',
                            'compareValue' => true,
                            'value' => 0
                        ],
                    ],
                    [
                        'name' => 'senior_age',
                        'label' => __('Age limit for pensioner price', 'event-integration'),
                        'type' => 'number',
                        'required' => true,
                        'suffix' => __('years', 'event-integration'),
                        'condition' => [
                            [
                                'key' => 'event_price_free',
                                'compare' => '=',
                                'compareValue' => false
                            ]
                        ],
                        'conditionValue' => [
                            'key' => 'event_price_free',
                            'compare' => '=',
                            'compareValue' => true,
                            'value' => 0
                        ],
                    ],
                    [
                        'name' => 'event_target_age',
                        'label' => __('Age group that the event is aimed at', 'event-integration'),
                        'type' => 'radio',
                        'required' => false,
                        'options' => [
                            'all' => __('All ages', 'event-integration'),
                            'specified' => __('Specified age group', 'event-integration'),
                        ],
                        'value' => 'all',
                    ],
                    [
                        'name' => 'event_target_age_from',
                        'label' => __('From', 'event-integration'),
                        'description' => __('Leave "From" or "To" blank if the upper or lower limit is missing.', 'event-integration'),
                        'type' => 'number',
                        'required' => false,
                        'suffix' => __('years', 'event-integration'),
                        'condition' => [
                            [
                                'key' => 'event_target_age',
                                'compare' => '=',
                                'compareValue' => 'specified'
                            ]
                        ],
                    ],
                    [
                        'name' => 'event_target_age_to',
                        'label' => __('To', 'event-integration'),
                        'type' => 'number',
                        'required' => false,
                        'suffix' => __('years', 'event-integration'),
                        'condition' => [
                            [
                                'key' => 'event_target_age',
                                'compare' => '=',
                                'compareValue' => 'specified'
                            ]
                        ],
                    ],
                    // End Section 3
                ],
            ],
            [
                'name' => 'section-4',
                'type' => 'section',
                'label' => __('4. Other', 'event-integration'),
                'description' => __('How is the event found and who is responsible?', 'event-integration'),
                'fields' => [
                    // Section 4
                    [
                        'name' => 'event_categories_heading',
                        'label' => __('Categorize the event', 'event-integration'),
                        'description' => __(
                            'Add tags and categories to make it easier to show the event in the right place and make it easier to find for visitors.',
                            'event-integration'
                        ),
                        'element' => 'h3',
                        'marginBottom' => false,
                        'type' => 'heading',
                    ],
                    [
                        'name' => 'event_categories',
                        'label' => __('Choose categories that fit the event', 'event-integration'),
                        'type' => 'select',
                        'multiple' => true,
                        'required' => true,
                        'dataSource' => [
                            'type' => 'taxonomy',
                            'name' => 'event_categories'
                        ],
                    ],
                    [
                        'name' => 'event_tags',
                        'label' => __('Choose tags that fit the event', 'event-integration'),
                        'type' => 'select',
                        'multiple' => true,
                        'required' => false,
                        'dataSource' => [
                            'type' => 'taxonomy',
                            'name' => 'event_tags'
                        ],
                    ],
                    [
                        'name' => 'event_contact_information_heading',
                        'label' => __('Contact information', 'event-integration'),
                        'description' => __(
                            'Add your contact details below.',
                            'event-integration'
                        ),
                        'element' => 'h3',
                        'marginTop' => true,
                        'marginBottom' => false,
                        'type' => 'heading',
                    ],
                    [
                        'name' => 'submitter_email',
                        'label' => __('E-mail address', 'event-integration'),
                        'type' => 'email',
                        'placeholder' => __('example@email.com', 'event-integration'),
                        'required' => true,
                    ],
                    [
                        'name' => 'submitter_phone',
                        'label' => __('Phonenumber', 'event-integration'),
                        'type' => 'text',
                        'required' => true,
                    ],
                    // End Section 4
                ],
            ],
        ];

        return apply_filters(
            'EventManagerIntegration/Module/EventForm/Fields',
            $fields,
            $data
        );
    }
}
