{{-- Occasions --}}

<div class="form-group u-display--inline-block">

    @typography([
        'variant' => 'subtitle'
    ])
        {{ $occasion->label }}
        @includeWhen($occasion->required, 'components.required')
    @endtypography

    @includeWhen(!$occasion->hidden_description, 'components.description', [
        'description' => $occasion->description
    ])

    @option([
        'type' => 'radio',
        'checked' => true,
        'attributeList' => [
            'data-id' => 'single-event',
            'name' => 'occurance-type',
        ],
        'classList' => ['u-display--inline-block'],
        'label' => __('Single occurrence', 'event-integration')
    ])
    @endoption

    @option([
        'type' => 'radio',
        'attributeList' => [
            'data-id' => 'recurring-event',
            'name' => 'occurance-type',
        ],
        'classList' => ['u-display--inline-block'],
        'label' => __('Schedule', 'Event recurrence rules', 'event-integration')
    ])
    @endoption

</div>

{{-- Single/multiple occasions --}}
<div id="single-event" class="event-occasion form-group">
    <div class="box box-panel box-panel-secondary">
        <div class="box-content">

            @typography([
                'variant' => 'subtitle'
            ])
                {{ __('Single occurrence', 'event-integration') }}
            @endtypography

            <div class="form-group occurrence occurance-group-single gutter gutter-bottom">
                <div class="form-group">

                    @typography([
                        'variant' => 'subtitle'
                    ])
                        {{ __('Start date', 'event-integration') }}
                    @endtypography

                    @field([
                        'type' => 'datepicker',
                        'value' => '',
                        'label' => __('Start date', 'event-integration'),
                        'attributeList' => [
                            'type' => 'text',
                            'name' => 'start_date',
                        ],
                        'classList' => ['datepicker'],
                        'required' => true,
                        'datepicker' => [
                            'title'                 => __('Date', 'event-integration'),
                            'required'              => true,
                        ]
                    ])
                    @endfield

                </div>

                <div class="form-group form-horizontal">

                    @typography([
                        'variant' => 'subtitle'
                    ])
                        {{ __('Start time', 'event-integration') }}
                    @endtypography

                    @include('components.time', [
                        'hourName' => 'start_time_h',
                        'minuteName' => 'start_time_m',
                        'hourLabel' => 'HH',
                        'minuteLabel' => 'MM',
                    ])

                </div>


                <div class="form-group">

                    @typography([
                        'variant' => 'subtitle'
                    ])
                        {{ __('End date', 'event-integration') }}
                    @endtypography

                    @field([
                        'type' => 'datepicker',
                        'value' => '',
                        'label' => __('End date', 'event-integration'),
                        'attributeList' => [
                            'type' => 'text',
                            'name' => 'end_date',
                        ],
                        'classList' => ['datepicker'],
                        'required' => true,
                        'datepicker' => [
                            'title'                 => __('Date', 'event-integration'),
                            'required'              => true,
                        ]
                    ])
                    @endfield

                </div>

                <div class="form-group form-horizontal">

                    @typography([
                        'variant' => 'subtitle'
                    ])
                        {{ __('End time', 'event-integration') }}
                    @endtypography

                    @include('components.time', [
                        'hourName' => 'end_time_h',
                        'minuteName' => 'end_time_m',
                        'hourLabel' => 'HH',
                        'minuteLabel' => 'MM',
                    ])

                </div>
            </div>
            <div class="form-group">

                @button([
                    'text' => __('Add', 'event-integration'),
                    'color' => 'primary',
                    'style' => 'filled',
                    'classList' => [
                        'btn btn btn-primary btn-sm add-occurance'
                    ]
                ])
                @endbutton

            </div>
        </div>
    </div>
</div>

{{-- Recurring event --}}
<div id="recurring-event" class="event-occasion form-group">
    <div class="box box-panel box-panel-secondary">
        <div class="box-content">
    
            @typography([
                'variant' => 'subtitle'
            ])
                {{ __('Recurrence rules for weekly recurring event', 'event-integration') }}
            @endtypography

            <div class="form-group occurrence occurance-group-recurring gutter gutter-bottom">

                @typography([
                    'variant' => 'subtitle'
                ])
                    {{ __('Weekday', 'event-integration') }}
                @endtypography

                @typography([
                    'variant' => 'caption',
                    'classList' => [
                        'u-margin__top--05'
                    ]
                ])
                    {{ __('The event will occur on this weekday.', 'event-integration') }}
                @endtypography

                @select([
                    'required'      => true,
                    'preselected'   => 'Monday',
                    'options'       => [
                        'Monday'        => __('Monday', 'event-integration'),
                        'Tuesday'       => __('Tuesday', 'event-integration'),
                        'Wednesday'     => __('Wednesday', 'event-integration'),
                        'Thursday'      => __('Thursday', 'event-integration'),
                        'Friday'        => __('Friday', 'event-integration'),
                        'Saturday'      => __('Saturday', 'event-integration'),
                        'Sunday'        => __('Sunday', 'event-integration'),
                    ],
                    'attributeList' => [
                        'name'          => 'weekday'
                    ]
                ])
                @endselect

                <div class="form-group">

                    @typography([
                        'variant' => 'subtitle'
                    ])
                        {{ __('Weekly interval', 'event-integration') }}
                    @endtypography

                    @typography([
                        'variant' => 'caption',
                        'classList' => [
                            'u-margin__top--05'
                        ]
                    ])
                        {{ __('Enter the weekly interval when the event occurs. 1 equals every week.', 'event-integration') }}
                    @endtypography

                    @field([
                        'type' => 'number',
                        'min' => '1',
                        'max' => '52',
                        'attributeList' => [
                            'id' => 'weekly_interval',
                            'type' => 'number',
                            'name' => 'weekly_interval',
                            'required' => true,
                            
                        ],
                        'label' => __('Weekly interval', 'event-integration')
                    ])
                    @endfield

                </div>

                <div class="form-group form-horizontal">

                    @typography([
                        'variant' => 'subtitle'
                    ])
                        {{ __('Start time', 'event-integration') }}
                    @endtypography

                    @typography([
                        'variant' => 'caption',
                        'classList' => [
                            'u-margin__top--05'
                        ]
                    ])
                        {{ __('Start time for the event', 'event-integration') }}
                    @endtypography

                    @include('components.time', [
                        'hourName' => 'recurring_start_h',
                        'minuteName' => 'recurring_start_m',
                        'hourLabel' => 'HH',
                        'minuteLabel' => 'MM',
                    ])

                </div>

                <div class="form-group form-horizontal">

                    @typography([
                        'variant' => 'subtitle'
                    ])
                        {{ __('End time', 'event-integration') }}
                    @endtypography

                    @typography([
                        'variant' => 'caption',
                        'classList' => [
                            'u-margin__top--05'
                        ]
                    ])
                        {{ __('End time for the event', 'event-integration') }}
                    @endtypography

                    @include('components.time', [
                        'hourName' => 'recurring_end_h',
                        'minuteName' => 'recurring_end_m',
                        'hourLabel' => 'HH',
                        'minuteLabel' => 'MM',
                    ])

                </div>

                <div class="o-grid">
                    <div class="form-group o-grid-12 o-grid-6@md">

                        @typography([
                            'variant' => 'subtitle'
                        ])
                            {{ __('Start date', 'event-integration') }}
                        @endtypography

                        @typography([
                            'variant' => 'caption',
                            'classList' => [
                                'u-margin__top--05'
                            ]
                        ])
                            {{ __('When the recurring event period starts', 'event-integration') }}
                        @endtypography

                        @field([
                            'type' => 'datepicker',
                            'value' => '',
                            'label' => __('Start date', 'event-integration'),
                            'attributeList' => [
                                'type' => 'text',
                                'name' => 'recurring_start_d',
                            ],
                            'classList' => ['datepicker'],
                            'required' => true,
                            'datepicker' => [
                                'title'                 => __('Start date', 'event-integration'),
                                'required'              => true,
                            ]
                        ])
                        @endfield

                    </div>

                    <div class="form-group o-grid-12 o-grid-6@md">

                        @typography([
                            'variant' => 'subtitle'
                        ])
                            {{ __('End date', 'event-integration') }}
                        @endtypography

                        @typography([
                            'variant' => 'caption',
                            'classList' => [
                                'u-margin__top--05'
                            ]
                        ])
                            {{ __('When the recurring event period ends', 'event-integration') }}
                        @endtypography

                        @field([
                            'type' => 'datepicker',
                            'value' => '',
                            'label' => __('End date', 'event-integration'),
                            'attributeList' => [
                                'type' => 'text',
                                'name' => 'recurring_end_d',
                            ],
                            'classList' => ['datepicker'],
                            'required' => true,
                            'datepicker' => [
                                'title'                 => __('End date', 'event-integration'),
                                'required'              => true,
                            ]
                        ])
                        @endfield

                    </div>
                </div>
            </div>

            <div class="form-group">

                @button([
                    'text' => __('Add', 'event-integration'),
                    'color' => 'primary',
                    'style' => 'filled',
                    'classList' => [
                        'btn btn btn-primary btn-sm add-occurance'
                    ]
                ])
                @endbutton
            </div>

        </div>
    </div>
</div>