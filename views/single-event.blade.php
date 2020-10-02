@extends('templates.master')

@section('content')
    <div class="container main-container o-grid u-margin__y--5">                
                @if(!empty($event['image_src']))
                    <div class="o-grid-12 o-grid-8@lg">
                        @image([
                            'src'=> $event['image_src'],
                        ])
                        @endimage
                    </div>
                @endif

                @if(!empty($event['occasion']))
                    <div class="o-grid-12 o-grid-8@lg u-color__text--primary u-margin__x--0 o-grid">      
                        <div class="m-event__date-box u-text-align--center o-grid-fit">
                            @typography(['classList' => ['m-event__date', 'u-border__bottom--2'], 'variant' => 'h1', 'element' => 'span'])
                                {{ $event['occasion']['date_parts']['date'] }}
                            @endtypography

                            @typography(['classList' => ['m-event__month'], 'variant' => 'h4', 'element' => 'span'])
                                {{ $event['occasion']['date_parts']['month_short'] }}
                            @endtypography
                        </div>

                        @typography(['classList' => ['m-event__title', 'o-grid-auto'], 'variant' => 'h1', 'element' => 'span'])
                            {{ the_title() }}
                        @endtypography
                    </div>
                @endif
                
                <div class="o-grid-12 o-grid-8@lg">      
                    @if (!empty($event['occasion']['formatted']))
                        @typography(['variant' => 'meta', 'element' => 'p', 'classList' => ['u-display--inline-block']])
                            @typography(['variant' => 'meta', 'element' => 'span'])
                                @icon([
                                    'icon' => 'access_time',
                                    'size' => 'sm'
                                ])
                                @endicon 
                                    <?php _e('Occasion', 'event-integration'); ?>
                            @endtypography

                            @typography(['variant' => 'meta', 'element' => 'strong'])
                                {{ $event['occasion']['formatted'] }}
                            @endtypography
                        @endtypography
                    @endif

                    @if ($event['location'])
                        @typography(['variant' => 'meta', 'element' => 'p', 'classList' => ['u-display--inline-block']])

                            @typography(['variant' => 'meta', 'element' => 'span'])
                                @icon([
                                    'icon' => 'room',
                                    'size' => 'sm'
                                ])
                                @endicon 
                                    <?php _e('Location', 'event-integration'); ?>
                            @endtypography
                            
                            @typography(['variant' => 'meta', 'element' => 'strong'])
                                {{ $event['location']['title'] }}
                            @endtypography
                        @endtypography
                    @endif

                    @if($event['booking_link'])
                        @typography(['variant' => 'meta', 'element' => 'p', 'classList' => ['u-display--inline-block']])

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
                        @endtypography
                    @endif

                </div>

                <div class="o-grid-12 o-grid-8@lg">
                    @if (!empty(get_extended($post->post_content)['main']) && !empty(get_extended($post->post_content)['extended']))
                        {!! apply_filters('the_lead', get_extended($post->post_content)['main']) !!}
                        {!! apply_filters('the_content', get_extended($post->post_content)['extended']) !!}
                    @else
                        {!! apply_filters('the_content', $post->post_content) !!}
                    @endif
                </div>

                @if($event['age_group'])
                    <div class="o-grid-12 o-grid-8@lg">      
                        @if($event['age_group'])
                            <small><?php _e('Age', 'event-integration') ?></small>
                            <br>
                            <small><b>{{ $event['age_group'] }}</b></small>      
                        @endif
                    </div>
                @endif

                @if ($event['rescheduled'])
                    <div class="o-grid-12 o-grid-8@lg">
                        @typography([
                            'element' => 'strong',
                            'classList' => ['u-color__text--danger']
                        ])
                            {{ $event['rescheduled'] }}
                        @endtypography

                        @typography(['element' => 'span'])
                            {{ $event['exception_information'] ? ' - ' . $event['exception_information'] : ''  }}   
                        @endtypography
                        
                    </div>
                @endif

                @if ($event['cancelled'])
                <div class="o-grid-12 o-grid-8@lg">
                        @typography([
                            'element' => 'strong',
                            'classList' => ['u-color__text--danger']
                        ])
                            {{ $event['cancelled'] }}
                        @endtypography

                        @typography(['element' => 'span'])
                            {{ $event['exception_information'] ? ' - ' . $event['exception_information'] : ''  }}
                        @endtypography
                    </div>
                @endif

                <div class="o-grid-12 o-grid-4@lg">      
                    {!! do_shortcode('[single_event_accordion]') !!}
                </div>
    </div>
@stop

