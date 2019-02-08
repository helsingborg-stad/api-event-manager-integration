<div class="grid {{ $classes }} {{ isset($font_size) ? $font_size : '' }}" data-module-id="{{ $ID }}">
    @if (!$hideTitle && !empty($post_title))
        <div class="grid-xs-12 u-mb-4">
            <h4 class="box-title">{!! apply_filters('the_title', $post_title) !!}</h4>
        </div>
    @endif

    <div class="grid-xs-12">
        <div class="grid grid--columns">
            @foreach ($events as $event)
                <div class="{{$gridColumn}} u-flex">
                    @include('partials.card')
                </div>
            @endforeach
        </div>
    </div>

    @if ($mod_event_archive)
        <div class="grid-xs-12 u-text-center">
            <a class="btn btn-primary" href="{{ get_post_type_archive_link('event') }}"><?php _e('More events', 'event-integration'); ?></a>
        </div>
    @endif
</div>

