@extends('templates.master')

@section('content')

    <div class="container main-container">
        @include('partials.breadcrumbs')

        <div class="grid single-event" id="readspeaker-read">
            <div class="grid-md-7 u-mb-3">

                <div class="grid sm-gutter">

                    <div class="grid-md-12 u-mb-2">
                        @if (municipio_get_thumbnail_source(null, array(750,750)))
                            <img src="{{ municipio_get_thumbnail_source(null, array(750,750)) }}"
                                 alt="{{ the_title() }}"
                                 class="img-inherit-width">
                        @endif
                    </div>

                    @if(!empty($event['occasion']))
                        <div class="grid-fit-content u-pt-1">
                            <div class="date-box box-filled box-filled-1 ratio-1-1 u-p-4 u-p-5@lg u-p-5@xl">
                                <div class="content text-center u-flex u-flex-column u-justify-content-center">
                                    <h1 class="date-box__day">{{ $event['occasion']['date_parts']['date'] }}</h1>
                                    <span class="date-box__month">{{ $event['occasion']['date_parts']['month_short'] }}</span>
                                </div>
                            </div>
                        </div>
                    @endif

                    <div class="grid-auto">
                        <h1>{{ the_title() }}</h1>
                    </div>

                </div>
            </div>

            <div class="grid-md-12">
                @if (is_single() && is_active_sidebar('content-area-top'))
                    <div class="grid grid--columns sidebar-content-area sidebar-content-area-top">
                        <?php dynamic_sidebar('content-area-top'); ?>
                    </div>
                @endif

                <div class="grid">

                    <div class="grid-md-7 u-mr-auto">
                        <div class="grid">

                            <div class="grid-md-12 u-mb-3">

                                <div class="creamy"></div>

                                <div class="grid u-py-1">
                                    <div class="grid-md-fit-content u-mr-auto u-mb-1@xs u-mb-1@sm">

                                        <div class="grid sm-gutter grid-va-middle">
                                            <div class="grid-fit-content">
                                                <i class="pricon pricon-clock"></i>
                                            </div>
                                            <div class="grid-fit-content">
                                                <small>Tidpunkt</small>
                                                <br>
                                                <small><b>5 mars 2019, 12:00 - 15:00</b></small>
                                            </div>
                                        </div>

                                    </div>

                                    <div class="grid-md-fit-content u-mr-auto u-mb-1@xs u-mb-1@sm">
                                        <div class="grid sm-gutter grid-va-middle">
                                            <div class="grid-fit-content">
                                                <i class="pricon pricon-location-pin"></i>
                                            </div>
                                            <div class="grid-fit-content">
                                                <small>Plats</small>
                                                <br>
                                                <small><b>Think open space</b></small>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="grid-md-fit-content u-mr-auto u-mb-1@xs u-mb-1@sm">
                                        <div class="grid sm-gutter grid-va-middle">
                                            <div class="grid-fit-content">
                                                <i class="pricon pricon-ticket"></i>
                                            </div>
                                            <div class="grid-fit-content">
                                                <small>Biljetter</small>
                                                <br>
                                                <a href="">
                                                    <small><b>Boka biljetter nu</b></small>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="creamy"></div>

                            </div>

                            <div class="grid-md-12 u-mb-3">
                                <article id="article">
                                    {!! the_post() !!}
                                    @if (isset($event['occasion']['status']) && $event['occasion']['status'] == 'cancelled')
                                        <p><strong><?php _e(
                                                    'Cancelled',
                                                    'event-integration'
                                                ); ?></strong>{{ !empty($event['occasion']['exception_information']) ? ' - ' . $event['occasion']['exception_information'] : ''  }}
                                        </p>
                                    @elseif (isset($event['occasion']['status']) && $event['occasion']['status'] == 'rescheduled')
                                        <p><strong><?php _e(
                                                    'Rescheduled',
                                                    'event-integration'
                                                ); ?></strong>{{ !empty($event['occasion']['exception_information']) ? ' - ' . $event['occasion']['exception_information'] : ''  }}
                                        </p>
                                    @endif
                                    @if (isset(get_extended($post->post_content)['main']) && !empty(get_extended($post->post_content)['main']) && isset(get_extended($post->post_content)['extended']) && !empty(get_extended($post->post_content)['extended']))

                                        {!! apply_filters('the_lead', get_extended($post->post_content)['main']) !!}
                                        {!! apply_filters('the_content', get_extended($post->post_content)['extended']) !!}

                                    @else
                                        {!! apply_filters('the_content', $post->post_content) !!}
                                    @endif

                                    @if (is_single() && is_active_sidebar('content-area'))
                                        <div class="grid grid--columns sidebar-content-area sidebar-content-area-bottom">
                                            <?php dynamic_sidebar('content-area'); ?>
                                        </div>
                                    @endif

                                </article>
                            </div>
                        </div>
                    </div>

                    <div class="grid-md-4 u-mb-3">
                        {!! do_shortcode('[single_event_accordion]') !!}
                    </div>

                    <div class="grid-md-12 u-mb-3">
                        @include('partials.accessibility-menu')
                    </div>

                    <div class="grid-md-12">
                        @include('partials.blog.post-footer')
                    </div>

                </div>

                @if (is_single() && comments_open())
                    <div class="grid">
                        <div class="grid-sm-12">
                            @include('partials.blog.comments-form')
                        </div>
                    </div>
                    <div class="grid">
                        <div class="grid-sm-12">
                            @include('partials.blog.comments')
                        </div>
                    </div>
                @endif
            </div>

            @include('partials.sidebar-right')
        </div>
    </div>

@stop

