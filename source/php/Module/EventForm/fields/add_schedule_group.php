<?php

return (object)[
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
                'component' => 'radio',
                'props' => [
                    'name' => 'occurance-type',
                    'options' => [
                        (object)[
                            'id' => 'single-event',
                            'label' => __('Single occurrence', 'event-integration'),
                            'checked' => true
                        ],
                        (object)[
                            'id' => 'recurring-event',
                            'label' => __('Recurring', 'event-integration'),
                            'checked' => false
                        ]
                    ]
                ],
            ]
        ],
        'single-event' => (object)[
            'name' => '',
            'label' => '',
            'description' => '',
            'required' => false,
            'hidden' => false,
            'hidden_description' => !empty($data['occasion']['hidden_description']),
            'type' => (object)[
                'component' => 'group',
                'props' => [
                    'id' => 'single-event',
                    'classList' => 'event-occasion',
                    'fields' => [
                        (object)[
                            'name' => '',
                            'label' => '',
                            'description' => '',
                            'required' => false,
                            'hidden' => false,
                            'hidden_description' => '',
                            'type' => (object)[
                                'component' => 'group',
                                'props' => [
                                    'id' => '',
                                    'classList' => 'occurrence occurance-group-recurring gutter gutter-bottom',
                                    'fields' => [

                                        (object)[
                                            'name' => '',
                                            'label' => __('Start date', 'event-integration'),
                                            'description' => '',
                                            'required' => true,
                                            'hidden' => false,
                                            'hidden_description' => !empty($data['occasion']['hidden_description']),
                                            'type' => (object)[
                                                'component' => 'datepicker',
                                                'props' => [
                                                    'name' => 'start_date',
                                                    'title' => __('Date', 'event-integration')
                                                ],
                                            ]
                                        ],
                                        (object)[
                                            'name' => '',
                                            'label' => __('Start time', 'event-integration'),
                                            'description' => '',
                                            'required' => true,
                                            'hidden' => false,
                                            'hidden_description' => !empty($data['occasion']['hidden_description']),
                                            'type' => (object)[
                                                'component' => 'time',
                                                'props' => [
                                                    'name' => 'start_time',
                                                    'label' => __('Start time', 'event-integration')
                                                ],
                                            ]
                                        ],
                                        (object)[
                                            'name' => '',
                                            'label' => __('End date', 'event-integration'),
                                            'description' => '',
                                            'required' => true,
                                            'hidden' => false,
                                            'hidden_description' => !empty($data['occasion']['hidden_description']),
                                            'type' => (object)[
                                                'component' => 'datepicker',
                                                'props' => [
                                                    'name' => 'end_date',
                                                    'title' => __('Date', 'event-integration')
                                                ],
                                            ]
                                        ],
                                        (object)[
                                            'name' => '',
                                            'label' => __('End time', 'event-integration'),
                                            'description' => '',
                                            'required' => true,
                                            'hidden' => false,
                                            (object)[
                                                'name' => '',
                                                'label' => __('Start date', 'event-integration'),
                                                'description' => '',
                                                'required' => true,
                                                'hidden' => false,
                                                'hidden_description' => !empty($data['occasion']['hidden_description']),
                                                'type' => (object)[
                                                    'component' => 'datepicker',
                                                    'props' => [
                                                        'name' => 'start_date',
                                                        'title' => __('Date', 'event-integration')
                                                    ],
                                                ]
                                            ],
                                            (object)[
                                                'name' => '',
                                                'label' => __('Start time', 'event-integration'),
                                                'description' => '',
                                                'required' => true,
                                                'hidden' => false,
                                                'hidden_description' => !empty($data['occasion']['hidden_description']),
                                                'type' => (object)[
                                                    'component' => 'time',
                                                    'props' => [
                                                        'name' => 'start_time',
                                                        'label' => __('Start time', 'event-integration')
                                                    ],
                                                ]
                                            ],
                                            (object)[
                                                'name' => '',
                                                'label' => __('End date', 'event-integration'),
                                                'description' => '',
                                                'required' => true,
                                                'hidden' => false,
                                                'hidden_description' => !empty($data['occasion']['hidden_description']),
                                                'type' => (object)[
                                                    'component' => 'datepicker',
                                                    'props' => [
                                                        'name' => 'end_date',
                                                        'title' => __('Date', 'event-integration')
                                                    ],
                                                ]
                                            ],
                                            (object)[
                                                'name' => '',
                                                'label' => __('End time', 'event-integration'),
                                                'description' => '',
                                                'required' => true,
                                                'hidden' => false,
                                                'hidden_description' => !empty($data['occasion']['hidden_description']),
                                                'type' => (object)[
                                                    'component' => 'time',
                                                    'props' => [
                                                        'name' => 'end_time',
                                                        'label' => __('End time', 'event-integration')
                                                    ],
                                                ]
                                            ],
                                            'hidden_description' => !empty($data['occasion']['hidden_description']),
                                            'type' => (object)[
                                                'component' => 'time',
                                                'props' => [
                                                    'name' => 'end_time',
                                                    'label' => __('End time', 'event-integration')
                                                ],
                                            ]
                                        ],
                                    ]
                                ]
                            ],
                        ],
                        (object)[
                            'name' => '',
                            'label' => '',
                            'description' => '',
                            'required' => false,
                            'hidden' => false,
                            'hidden_description' => !empty($data['occasion']['hidden_description']),
                            'type' => (object)[
                                'component' => 'button',
                                'props' => [
                                    'text' => __('Add', 'event-integration'),
                                    'classList' => [
                                        'btn btn btn-primary btn-sm add-occurance'
                                    ]
                                ],
                            ]
                        ],
                    ],
                ]
            ],
        ],
        'recurring-event' => (object)[
            'name' => '',
            'label' => '',
            'description' => '',
            'required' => false,
            'hidden' => false,
            'hidden_description' => !empty($data['occasion']['hidden_description']),
            'type' => (object)[
                'component' => 'group',
                'props' => [
                    'id' => 'recurring-event',
                    'classList' => 'event-occasion',
                    'fields' => [
                        (object)[
                            'name' => '',
                            'label' => __('Start date', 'event-integration'),
                            'description' => '',
                            'required' => true,
                            'hidden' => false,
                            'hidden_description' => !empty($data['occasion']['hidden_description']),
                            'type' => (object)[
                                'component' => 'datepicker',
                                'props' => [
                                    'name' => 'start_date',
                                    'title' => __('Date', 'event-integration')
                                ],
                            ]
                        ],
                    ],
                ]
            ],
        ],
        /*'date' => (object)[
            'name' => '',
            'label' => '',
            'description' => '',
            'required' => false,
            'hidden' => false,
            'hidden_description' => !empty($data['occasion']['hidden_description']),
            'type' => (object)[
                'component' => 'fullform',
                'props' => [],
            ]
        ],*/
    ],
];
