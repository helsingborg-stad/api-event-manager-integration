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

