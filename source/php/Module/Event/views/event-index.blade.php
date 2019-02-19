<div class="grid {{ $classes }}">
    @if (!$hideTitle && !empty($post_title))
        <div class="grid-xs-12 u-mb-4">
            <h4 class="box-title">{!! apply_filters('the_title', $post_title) !!}</h4>
        </div>
    @endif

    <div class="grid-xs-12">
        <div class="modularity-event-{{ $template }}"
             data-module-id="{{ $ID }}"
             data-settings="{{ json_encode($settings) }}"
             data-grid-column="{{ $gridColumn }}"
             data-archive-url="{{ $archive_url }}"
             data-rest-url="{{ $rest_url }}"
             data-end-date="{{ $end_date }}"
             data-lat="{{ $lat }}"
             data-lng="{{ $lng }}"
             data-distance="{{ $distance }}"
        >
        </div>
    </div>
</div>