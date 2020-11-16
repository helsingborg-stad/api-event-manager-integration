@extends('templates.single')

@section('layout')
<div class="o-container o-grid o-grid-12 u-paddng--3 u-padding--5@lg">
    @if(!empty($event['image_src']))

        <div class="o-grid-12 o-grid-8@lg">
            @image([
                'src'=> $event['image_src'],
            ])
            @endimage
        </div>
    @endif

    @if(!empty($event['occasion']))
        <div class="o-grid-12 o-grid-8@lg">
            @typography(['variant' => 'h1', 'element' => 'span'])
                {{ $event['occasion']['date_parts']['date'] }}
            @endtypography

            @typography(['variant' => 'h4', 'element' => 'span'])
                {{ $event['occasion']['date_parts']['month_short'] }}
            @endtypography
            

            @typography(['variant' => 'h1', 'element' => 'span'])
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

