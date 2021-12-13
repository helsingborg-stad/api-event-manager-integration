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

        $reflector = new \ReflectionClass(Fields::class);
        $fieldsFolder = trailingslashit(dirname($reflector->getFileName())) . '/fields/';

        return [
            require($fieldsFolder . 'group_one.php'),
            (object)[
                'label' => __('2. Add schedule', 'event-integration'),
                'fields' => [
                    'occasion' => (object)[
                        'name' => '',
                        'label' => !empty($data['occasion']['label']) ? $data['occasion']['label'] : __(
                            'Event occurrence',
                            'event-integration'
                        ),
                        'description' => !empty($data['occasion']['description']) ? $data['occasion']['description'] : __(
                            'Add occasions to this event. Does the event occur each week? Then add a rule for recurring events. Note that end time for the event can\'t be the same as the start time.',
                            'event-integration'
                        ),
                        'required' => true,
                        'hidden' => false,
                        'hidden_description' => !empty($data['occasion']['hidden_description']),
                        'type' => (object)[
                            'component' => 'datepicker',
                            'props' => [],
                        ]
                    ],
                ],
            ],
            (object)[
                'label' => __('3. More information about the event', 'event-integration'),
                'fields' => [
                    'event_link' => (object)[
                        'name' => 'event_link',
                        'label' => !empty($data['event_link']['label']) ? $data['event_link']['label'] : __(
                            'Website',
                            'event-integration'
                        ),
                        'description' => !empty($data['event_link']['description']) ? $data['event_link']['description'] : __(
                            'Link to event website.',
                            'event-integration'
                        ),
                        'required' => !empty($data['event_link']['required']),
                        'hidden' => !empty($data['event_link']['hidden']),
                        'hidden_description' => !empty($data['event_link']['hidden_description']),
                        'type' => (object)[
                            'component' => 'input',
                            'props' => [
                                'type' => 'url'
                            ],
                        ]
                    ],
                    'booking_link' => (object)[
                        'name' => 'booking_link',
                        'label' => !empty($data['booking_link']['label']) ? $data['booking_link']['label'] : __(
                            'Link to booking',
                            'event-integration'
                        ),
                        'description' => !empty($data['booking_link']['description']) ? $data['booking_link']['description'] : __(
                            'Link to the event\'s booking page.',
                            'event-integration'
                        ),
                        'required' => !empty($data['booking_link']['required']),
                        'hidden' => !empty($data['booking_link']['hidden']),
                        'hidden_description' => !empty($data['booking_link']['hidden_description']),
                        'type' => (object)[
                            'component' => 'input',
                            'props' => [
                                'type' => 'url'
                            ],
                        ]
                    ],
                    'price_adult' => (object)[
                        'name' => 'price_adult',
                        'label' => !empty($data['price_adult']['label']) ? $data['price_adult']['label'] : __(
                            'Price adult',
                            'event-integration'
                        ),
                        'description' => !empty($data['price_adult']['description']) ? $data['price_adult']['description'] : __(
                            'Price for adults. Are there multiple price ranges? Please add it in the description.',
                            'event-integration'
                        ),
                        'required' => !empty($data['price_adult']['required']),
                        'hidden' => !empty($data['price_adult']['hidden']),
                        'hidden_description' => !empty($data['price_adult']['hidden_description']),
                        'type' => (object)[
                            'component' => 'input',
                            'props' => [
                                'type' => 'number'
                            ],
                        ]
                    ],
                    'price_student' => (object)[
                        'name' => 'price_student',
                        'label' => !empty($data['price_student']['label']) ? $data['price_student']['label'] : __(
                            'Price student',
                            'event-integration'
                        ),
                        'description' => !empty($data['price_student']['description']) ? $data['price_student']['description'] : __(
                            'Price for students.',
                            'event-integration'
                        ),
                        'required' => !empty($data['price_student']['required']),
                        'hidden' => !empty($data['price_student']['hidden']),
                        'hidden_description' => !empty($data['price_student']['hidden_description']),
                        'type' => (object)[
                            'component' => 'input',
                            'props' => [
                                'type' => 'number'
                            ],
                        ]
                    ],
                    'price_children' => (object)[
                        'name' => 'price_children',
                        'label' => !empty($data['price_children']['label']) ? $data['price_children']['label'] : __(
                            'Price children',
                            'event-integration'
                        ),
                        'description' => !empty($data['price_children']['description']) ? $data['price_children']['description'] : __(
                            'Price for children.',
                            'event-integration'
                        ),
                        'required' => !empty($data['price_children']['required']),
                        'hidden' => !empty($data['price_children']['hidden']),
                        'hidden_description' => !empty($data['price_children']['hidden_description']),
                        'type' => (object)[
                            'component' => 'input',
                            'props' => [
                                'type' => 'number'
                            ],
                        ]
                    ],
                    'children_age' => (object)[
                        'name' => 'children_age',
                        'label' => !empty($data['children_age']['label']) ? $data['children_age']['label'] : __(
                            'Age restriction for children price',
                            'event-integration'
                        ),
                        'description' => !empty($data['children_age']['description']) ? $data['children_age']['description'] : __(
                            'Children price is valid up to this age.',
                            'event-integration'
                        ),
                        'required' => !empty($data['children_age']['required']),
                        'hidden' => !empty($data['children_age']['hidden']),
                        'hidden_description' => !empty($data['children_age']['hidden_description']),
                        'type' => (object)[
                            'component' => 'input',
                            'props' => [
                                'type' => 'number'
                            ],
                        ]
                    ],
                    'price_senior' => (object)[
                        'name' => 'price_senior',
                        'label' => !empty($data['price_senior']['label']) ? $data['price_senior']['label'] : __(
                            'Price senior',
                            'event-integration'
                        ),
                        'description' => !empty($data['price_senior']['description']) ? $data['price_senior']['description'] : __(
                            'Price for seniors.',
                            'event-integration'
                        ),
                        'required' => !empty($data['price_senior']['required']),
                        'hidden' => !empty($data['price_senior']['hidden']),
                        'hidden_description' => !empty($data['price_senior']['hidden_description']),
                        'type' => (object)[
                            'component' => 'input',
                            'props' => [
                                'type' => 'number'
                            ],
                        ]
                    ],
                    'senior_age' => (object)[
                        'name' => 'senior_age',
                        'label' => !empty($data['senior_age']['label']) ? $data['senior_age']['label'] : __(
                            'Age restriction for senior price',
                            'event-integration'
                        ),
                        'description' => !empty($data['senior_age']['description']) ? $data['senior_age']['description'] : __(
                            'Senior price is valid from this age.',
                            'event-integration'
                        ),
                        'required' => !empty($data['senior_age']['required']),
                        'hidden' => !empty($data['senior_age']['hidden']),
                        'hidden_description' => !empty($data['senior_age']['hidden_description']),
                        'type' => (object)[
                            'component' => 'input',
                            'props' => [
                                'type' => 'number'
                            ],
                        ]
                    ],
                    'age_group' => (object)[
                        'name' => 'age_group',
                        'label' => !empty($data['age_group']['label']) ? $data['age_group']['label'] : __(
                            'Age group',
                            'event-integration'
                        ),
                        'description' => !empty($data['age_group']['description']) ? $data['age_group']['description'] : __(
                            'Age group that the activity is addressed to.',
                            'event-integration'
                        ),
                        'required' => !empty($data['age_group']['required']),
                        'hidden' => !empty($data['age_group']['hidden']),
                        'hidden_description' => !empty($data['age_group']['hidden_description']),
                    ],
                    'organizer' => (object)[
                        'name' => 'organizer',
                        'label' => !empty($data['organizer']['label']) ? $data['organizer']['label'] : __(
                            'Organizer',
                            'event-integration'
                        ),
                        'description' => !empty($data['organizer']['description']) ? $data['organizer']['description'] : __(
                            'Type name of organizer, select from suggestions. If your business is not available, please add an organizer to the description.',
                            'event-integration'
                        ),
                        'required' => false,
                        'hidden' => !empty($data['organizer']['hidden']),
                        'hidden_description' => !empty($data['organizer']['hidden_description']),
                    ],
                    'location' => (object)[
                        'name' => 'location',
                        'label' => !empty($data['location']['label']) ? $data['location']['label'] : __(
                            'Location',
                            'event-integration'
                        ),
                        'description' => !empty($data['location']['description']) ? $data['location']['description'] : __(
                            'Type location name and select from suggestions. If the location is not available, please add an address in the description.',
                            'event-integration'
                        ),
                        'required' => false,
                        'hidden' => !empty($data['location']['hidden']),
                        'hidden_description' => !empty($data['location']['hidden_description']),
                    ],
                    'accessibility' => (object)[
                        'name' => 'accessibility',
                        'label' => !empty($data['accessibility']['label']) ? $data['accessibility']['label'] : __(
                            'Accessibility',
                            'event-integration'
                        ),
                        'description' => !empty($data['accessibility']['description']) ? $data['accessibility']['description'] : __(
                            'Select which accessibility actions that exist for the event.',
                            'event-integration'
                        ),
                        'required' => false,
                        'hidden' => !empty($data['accessibility']['hidden']),
                        'hidden_description' => !empty($data['accessibility']['hidden_description']),
                    ],
                ],
            ],
            'event_categories' => (object)[
                'name' => 'event_categories',
                'label' => !empty($data['event_categories']['label']) ? $data['event_categories']['label'] : __(
                    'Categories',
                    'event-integration'
                ),
                'description' => !empty($data['event_categories']['description']) ? $data['event_categories']['description'] : __(
                    'Select appropriate categories for your event or activity. To select multiple categories, press Ctrl (Windows) / command (macOS) at the same time as you click on the categories.',
                    'event-integration'
                ),
                'required' => !empty($data['event_categories']['required']),
                'hidden' => !empty($data['event_categories']['hidden']),
                'hidden_description' => !empty($data['event_categories']['hidden_description']),
            ],
            'event_tags' => (object)[
                'name' => 'event_tags',
                'label' => !empty($data['event_tags']['label']) ? $data['event_tags']['label'] : __(
                    'Tags',
                    'event-integration'
                ),
                'description' => !empty($data['event_tags']['description']) ? $data['event_tags']['description'] : __(
                    'Select appropriate tags for your event or activity. To select multiple tags, press Ctrl (Windows) / command (macOS) at the same time as you click on the tags.',
                    'event-integration'
                ),
                'required' => !empty($data['event_tags']['required']),
                'hidden' => !empty($data['event_tags']['hidden']),
                'hidden_description' => !empty($data['event_tags']['hidden_description']),
            ],
            'submitter_email' => (object)[
                'name' => 'submitter_email',
                'label' => !empty($data['submitter_email']['label']) ? $data['submitter_email']['label'] : __(
                    'Email',
                    'event-integration'
                ),
                'description' => !empty($data['submitter_email']['description']) ? $data['submitter_email']['description'] : __(
                    'Your email address.',
                    'event-integration'
                ),
                'required' => !empty($data['submitter_email']['required']),
                'hidden' => !empty($data['submitter_email']['hidden']),
                'hidden_description' => !empty($data['submitter_email']['hidden_description']),
            ],
            'submitter_phone' => (object)[
                'name' => 'submitter_phone',
                'label' => !empty($data['submitter_phone']['label']) ? $data['submitter_phone']['label'] : __(
                    'Phone number',
                    'event-integration'
                ),
                'description' => !empty($data['submitter_phone']['description']) ? $data['submitter_phone']['description'] : __(
                    'Your phone number.',
                    'event-integration'
                ),
                'required' => !empty($data['submitter_phone']['required']),
                'hidden' => !empty($data['submitter_phone']['hidden']),
                'hidden_description' => !empty($data['submitter_phone']['hidden_description']),
            ]
        ];
    }
}
