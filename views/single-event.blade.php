@extends('templates.single')

@section('layout')
<div class="o-container">
<div class="o-grid u-margin__top--4">
    @if(!empty($event['image_src']))

        <div class="o-grid-12 o-grid-8@lg">
            @image([
                'src'=> $event['image_src'],
            ])
            @endimage
        </div>
    @endif

    @if(!empty($event['occasion']))
        <div class="o-grid-12 o-grid-8@lg modularity-event-heading">
            <div class="modularity-event-date-box">
                @typography(['variant' => 'h1', 'element' => 'span'])
                    {{ $event['occasion']['date_parts']['date'] }}
                @endtypography

                @typography(['variant' => 'h4', 'element' => 'span'])
                    {{ $event['occasion']['date_parts']['month_short'] }}
                @endtypography
            </div>

            @typography([
                'variant' => 'h1',
                'element' => 'span',
                'classList' => ['modularity-event-title']
            ])
                {{ the_title() }}
            @endtypography

        </div>
    @endif

    <div class="o-grid-12 o-grid-8@lg">
        @if (!empty($event['occasion']['formatted']))
            @typography(['variant' => 'h4', 'element' => 'h4'])
                {{ $event['occasion']['formatted'] }}
            @endtypography


        @endif

        @if ($event['location'])
            @typography(['variant' => 'h4', 'element' => 'h4'])
                {{ $event['location']['title'] }}
            @endtypography
        @endif

        @if($event['booking_link'])
            @button([
                'color' => 'primary',
                'style' => 'filled',
                'href' => $event['booking_link'],
                'classList' => ['u-margin__top--3']
            ])
            {{_e('Book tickets now', 'event-integration')}}
            @endbutton
        @endif
    </div>

    <div class="o-grid-12 o-grid-8@lg">
        @if (!empty(get_extended($post->post_content)['main']) && !empty(get_extended($post->post_content)['extended']))
            {!! apply_filters('the_lead', get_extended($post->post_content)['main']) !!}
            {!! apply_filters('the_content', get_extended($post->post_content)['extended']) !!}
        @else
            {!! apply_filters('the_content', $post->post_content) !!}
        @endif

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
            {!! do_shortcode('[single_event_accordion]') !!}
    </div>
</div>
</div>
@stop

