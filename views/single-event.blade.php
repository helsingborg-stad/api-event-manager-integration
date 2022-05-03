@extends('templates.single')

@section('layout')
<div class="o-container">
    <div class="o-grid u-margin__top--4">
        @if(!empty($event['image_src']))

            <div class="o-grid-12">
                @segment([
                    'layout'            => 'full-width',
                    'image'             => $event['image_src'],
                    'background'        => 'primary',
                    'textColor'         => 'light',
                    'overlay'           => 'dark',
                    'classList'         => ['modularity-event-hero'],
                    'textAlignment'     => 'center',
                    'title'             => get_the_title(),
                    'subTitle'          => 123,
                    'content'           => $event['occasion']['formatted'] ?? false,
                ])
                @endsegment
            </div>
        @endif
        <div class="o-grid-12 o-grid-8@lg">
            <div class="modularity-event-heading">
                @if(!empty($event['occasion']))
                    <div class="modularity-event-date-box">
                        @typography(['element' => 'span'])
                            {{ $event['occasion']['date_parts']['date'] }}
                        @endtypography
        
                        @typography(['element' => 'span'])
                            {{ $event['occasion']['date_parts']['month_short'] }}
                        @endtypography
                    </div>
                @endif
                
                @typography([
                    'variant' => 'h1',
                    'element' => 'span',
                    'classList' => ['modularity-event-title']
                ])
                    {{ the_title() }}
                @endtypography
            </div>

            @if ($event['rescheduled'])
                <div class="u-margin__top--3">
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
                <div class="u-margin__top--3">
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

            <div class="modularity-event-content o-grid">
                @if(!empty($event['introText']))
                    <strong>{!! $event['introText'] !!}</strong>
                @endif

                @include('partials.ticket')

                @if(!empty($event['content']))
                    {!! $event['content'] !!}
                @endif
            </div>
        </div>

        <div class="o-grid-12 o-grid-4@lg o-grid">
            @include('partials.right-sidebar')
        </div>
    </div>
</div>
@stop

