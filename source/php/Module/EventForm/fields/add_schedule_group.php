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
        'date' => (object)[
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
];
