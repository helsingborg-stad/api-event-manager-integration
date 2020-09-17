@extends('templates.master')

@section('content')
<div class="container main-container">
    @grid([
        "container" => true,
        "row_gap" => 4
    
        ])
            @if(!empty($event['image_src']))
                @grid([
                    "col" => [
                        "xs" => [1,13],
                        "sm" => [1,13],
                        "md" => [1,13],
                        "lg" => [1,8],
                        "xl" => [1,8]
                    ],
                    "row" => [
                        "xs" => [2,2],
                        "sm" => [2,2],
                        "md" => [2,2],
                        "lg" => [2,2],
                        "xl" => [2,2]
                    ]
                ])
                                 
                    @image([
                        'src'=> $event['image_src'],
                    ])
                    @endimage
          
                @endgrid
            @endif

            @if(!empty($event['occasion']))
                @grid([
                    "col" => [
                        "xs" => [1,13],
                        "sm" => [1,13],
                        "md" => [1,13],
                        "lg" => [1,8],
                        "xl" => [1,8]
                    ],
                    "row" => [
                        "xs" => [3,6],
                        "sm" => [3,6],
                        "md" => [3,6],
                        "lg" => [3,6],
                        "xl" => [3,6]
                    ]
                ])
                            
                    
                @typography(['variant' => 'h1', 'element' => 'span'])
                    {{ $event['occasion']['date_parts']['date'] }}
                @endtypography

                @typography(['variant' => 'h4', 'element' => 'span'])
                    {{ $event['occasion']['date_parts']['month_short'] }}
                @endtypography
                

                @typography(['variant' => 'h1', 'element' => 'span'])
                    {{ the_title() }}
                @endtypography

                @endgrid
            @endif
            
            @grid([
                "col" => [
                    "xs" => [1,13],
                    "sm" => [1,13],
                    "md" => [1,13],
                    "lg" => [1,8],
                    "xl" => [1,8]
                ],
                "row" => [
                    "xs" => [6,7],
                    "sm" => [6,7],
                    "md" => [6,7],
                    "lg" => [6,7],
                    "xl" => [6,7]
                ]
            ])
                @if (!empty($event['occasion']['formatted']))
                                                
                    @typography(['variant' => 'meta', 'element' => 'span'])
                        @icon([
                            'icon' => 'access_time',
                            'size' => 'sm',
                            'classList' => ['u-align--top']
                        ])
                        @endicon 
                        <?php _e('Occasion', 'event-integration'); ?>
                    @endtypography

                    @typography(['variant' => 'meta', 'element' => 'strong'])
                        {{ $event['occasion']['formatted'] }}
                    @endtypography
        
            
                @endif

                @if ($event['location'])
            
                    @typography(['variant' => 'meta', 'element' => 'span'])
                        @icon([
                            'icon' => 'room',
                            'size' => 'sm',
                            'classList' => ['u-align--top']
                        ])
                        @endicon 
                        <?php _e('Location', 'event-integration'); ?>
                    @endtypography
                    
                    @typography(['variant' => 'meta', 'element' => 'strong'])
                        {{ $event['location']['title'] }}
                    @endtypography
                        
                @endif

                @if($event['booking_link'])
            
                    @typography(['variant' => 'meta', 'element' => 'span'])
                        @icon([
                            'icon' => 'room',
                            'size' => 'sm'
                        ])
                        @endicon    

                        {{ _e('Tickets', 'event-integration') }}
                    @endtypography

                    @typography(['variant' => 'meta', 'element' => 'strong'])

                        @link(['href' => $event['booking_link']])
                            {{ _e('Book tickets now', 'event-integration') }}
                        @endlink

                    @endtypography

                @endif

            @endgrid

            @grid([
                "col" => [
                    "xs" => [1,13],
                    "sm" => [1,13],
                    "md" => [1,13],
                    "lg" => [1,8],
                    "xl" => [1,8]
                ],
                "row" => [
                    "xs" => [7,8],
                    "sm" => [7,8],
                    "md" => [7,8],
                    "lg" => [7,8],
                    "xl" => [7,8]
                ]
            ])
                                
                @if (!empty(get_extended($post->post_content)['main']) && !empty(get_extended($post->post_content)['extended']))
                    {!! apply_filters('the_lead', get_extended($post->post_content)['main']) !!}
                    {!! apply_filters('the_content', get_extended($post->post_content)['extended']) !!}
                @else
                    {!! apply_filters('the_content', $post->post_content) !!}
                @endif
        
            @endgrid

            @if($event['age_group'])
                @grid([
                    "col" => [
                        "xs" => [1,13],
                        "sm" => [1,13],
                        "md" => [1,13],
                        "lg" => [1,8],
                        "xl" => [1,8]
                    ],
                    "row" => [
                        "xs" => [8,9],
                        "sm" => [8,9],
                        "md" => [8,9],
                        "lg" => [8,9],
                        "xl" => [8,9]
                    ]
                ])
                    @if($event['age_group'])
                        <small><?php _e('Age', 'event-integration') ?></small>
                        <br>
                        <small><b>{{ $event['age_group'] }}</b></small>      
                    @endif
                @endgrid
            @endif

            @if ($event['rescheduled'])
                @grid([
                    "col" => [
                        "xs" => [1,13],
                        "sm" => [1,13],
                        "md" => [1,13],
                        "lg" => [1,8],
                        "xl" => [1,8]
                    ],
                    "row" => [
                        "xs" => [9,10],
                        "sm" => [9,10],
                        "md" => [9,10],
                        "lg" => [9,10],
                        "xl" => [9,10]
                    ]
                ])
                    
                    @typography([
                        'element' => 'strong',
                        'classList' => ['u-color__text--danger']
                    ])
                        {{ $event['rescheduled'] }}
                    @endtypography

                    @typography(['element' => 'span'])
                        {{ $event['exception_information'] ? ' - ' . $event['exception_information'] : ''  }}   
                    @endtypography
                    
                @endgrid
            @endif

            @if ($event['cancelled'])
                @grid([
                    "col" => [
                        "xs" => [1,13],
                        "sm" => [1,13],
                        "md" => [1,13],
                        "lg" => [1,8],
                        "xl" => [1,8]
                    ],
                    "row" => [
                        "xs" => [10,11],
                        "sm" => [10,11],
                        "md" => [10,11],
                        "lg" => [10,11],
                        "xl" => [10,11]
                    ]
                ])
                    
                    @typography([
                        'element' => 'strong',
                        'classList' => ['u-color__text--danger']
                    ])
                        {{ $event['cancelled'] }}
                    @endtypography

                    @typography(['element' => 'span'])
                        {{ $event['exception_information'] ? ' - ' . $event['exception_information'] : ''  }}
                    @endtypography

                @endgrid
            @endif

            @grid([
                    "col" => [
                        "xs" => [1,13],
                        "sm" => [1,13],
                        "md" => [1,13],
                        "lg" => [9,13],
                        "xl" => [9,13]
                    ],
                    "row" => [
                        "xs" => [11,12],
                        "sm" => [11,12],
                        "md" => [11,12],
                        "lg" => [2,11],
                        "xl" => [2,11]
                    ]
                ])

                    {!! do_shortcode('[single_event_accordion]') !!}

                @endgrid
    @endgrid

</div>
@stop

