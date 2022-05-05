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
        'title'             => get_the_title(),
        'subTitle'          => 123,
        'content'           => $event['occasion']['formatted'] ?? false,
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
            'element' => 'span',
            'classList' => ['modularity-event-title', 'u-align-self--center', 'u-margin__left--2']
        ])
            {{ the_title() }}
        @endtypography
    </div>

    @include('partials.exception-information')

    <div class="modularity-event-content o-grid">
        @if(!empty($event['introText']))
            <strong>{!! $event['introText'] !!}</strong>
        @endif

        @include('widgets.ticket')

        @if(!empty($event['content']))
            <div>
                {!! $event['content'] !!}
            </div>
        @endif
    </div>
@stop

@section('sidebar-right')
@include('partials.sidebar-right')
@stop

