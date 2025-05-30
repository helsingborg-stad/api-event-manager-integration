@extends('templates.single')

@section('sidebar-left')
@stop

@section('above')
@if(!empty($event['image_src']))
    @segment([
        'layout'            => 'full-width',
        'image'             => $event['image_src'],
        'background'        => 'primary',
        'textColor'         => 'light',
        'overlay'           => 'dark',
        'classList'         => ['modularity-event-hero', 'u-margin__bottom--5'],
        'textAlignment'     => 'center',
        'title'             => !$settings->cleanHero ? get_the_title() : null,
        'subTitle'          => 123,
        'content'           => !$settings->cleanHero ? ($event['occasion']['formatted'] ?? false) : null,
    ])
    @endsegment
@endif
@stop

@section('content')
    <div class="modularity-event-heading u-display--inline-flex">
        @if(isset($event['occasion']['formatted']))
            @datebadge([
                'date' => $event['occasion']['start_date']
            ])
            @enddatebadge
        @endif
        
        @typography([
            'variant' => 'h1',
            'element' => !$settings->cleanHero ? 'span' : 'h1',
            'classList' => ['modularity-event-title', 'u-align-self--center', 'u-margin__left--2', 'u-margin__top--0']
        ])
            {{ the_title() }}
        @endtypography
    </div>

    @include('partials.exception-information')

    <article class="c-article modularity-event-content">
        @if(!empty($event['introText']))
            {!! $event['introText'] !!}
        @endif
        
        @if(!empty($event['booking_link']) || !empty($event['ticket_includes']))
            <div class="{{ !empty($event['introText']) ? 'u-margin__y--4' : 'u-margin__bottom--4'}}">
                @include('widgets.ticket')
            </div>
        @endif

        @if(!empty($event['content']))
            {!! $event['content'] !!}
        @endif
    </article>
@stop

@section('sidebar-right')
@include('partials.sidebar-right')
@stop

