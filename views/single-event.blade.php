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
            {{-- <div class="u-display--flex u-align-items--center u-flex-direction--column">
                @typography(['variant' => 'h2', 'element' => 'span', 'classList' => ['c-segment__title']])
                    {{_e('Event', 'event-integration')}}
                @endtypography

                @typography(['variant' => 'h1', 'element' => 'h1', 'classList' => ['c-segment__title', 'u-margin--0']])
                    {{ the_title() }}
                @endtypography

                @if(!empty($event['occasion']))
                    @typography(['variant' => 'h2', 'element' => 'span', 'classList' => ['c-segment__text']])
                        {{ $event['occasion']['formatted'] }}
                    @endtypography
                @endif
            </div> --}}
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

        <div class="modularity-event-content">
            @if(!empty($event['introText']))
                <strong>{!! $event['introText'] !!}</strong>
            @endif

            @include('partials.ticket')

            @if(!empty($event['content']))
                {!! $event['content'] !!}
            @endif
        </div>

        @if($event['age_group'])
            <div class="u-margin__top--3">
                <small><?php _e('Age', 'event-integration') ?></small>
                <br>
                <small><b>{{ $event['age_group'] }}</b></small>
            </div>
        @endif

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
    </div>

    <div class="o-grid-12 o-grid-4@lg">
        @include('partials.right-sidebar')
        {!! do_shortcode('[single_event_accordion]') !!}
    </div>
</div>
</div>
@stop

