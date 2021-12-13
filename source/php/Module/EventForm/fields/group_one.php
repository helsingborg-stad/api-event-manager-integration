<?php

return (object)[
    'label' => __('1. Describe your event', 'event-integration'),
    'fields' => [
        'title' => (object)[
            'name' => 'title',
            'label' => !empty($data['title']['label']) ? $data['title']['label'] : __(
                'Event name',
                'event-integration'
            ),
            'description' => !empty($data['title']['description']) ? $data['title']['description'] : __(
                'Name of the event.',
                'event-integration'
            ),
            'required' => true,
            'hidden' => false,
            'hidden_description' => !empty($data['title']['hidden_description']),
            'type' => (object)[
                'component' => 'input',
                'props' => [],
            ]
        ],
        'content' => (object)[
            'name' => 'content',
            'label' => !empty($data['content']['label']) ? $data['content']['label'] : __(
                'Description',
                'event-integration'
            ),
            'description' => !empty($data['content']['description']) ? $data['content']['description'] :
                __('Describe your event. What happens and why should you visit it?', 'event-integration'),
            'required' => true,
            'hidden' => false,
            'hidden_description' => !empty($data['content']['hidden_description']),
            'type' => (object)[
                'component' => 'textarea',
                'props' => [],
            ]
        ],
        'image_input' => (object)[
            'name' => 'image_input',
            'label' => !empty($data['image_input']['label']) ? $data['image_input']['label'] : __(
                'Upload an image',
                'event-integration'
            ),
            'description' => !empty($data['image_input']['description']) ? $data['image_input']['description'] :
                __(
                    'Keep in mind that the image may be cropped, so avoid text in the image.',
                    'event-integration'
                ) . '<br>' .
                __(
                    'Images with identifiable persons are not accepted and will be replaced.',
                    'event-integration'
                ) . '<br>' .
                __('You must also have the right to use and distribute the image.', 'event-integration'),
            'required' => !empty($data['image_input']['required']),
            'hidden' => !empty($data['image_input']['hidden']),
            'hidden_description' => !empty($data['image_input']['hidden_description']),
            'type' => (object)[
                'component' => 'image',
                'props' => [],
            ]
        ],
    ],
];