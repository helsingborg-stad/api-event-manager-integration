<div class="{{ $classes }}">
    @if (!$hideTitle && !empty($post_title))
        <div class="grid-xs-12 u-mb-4">
            <h4 class="box-title">{!! apply_filters('the_title', $post_title) !!}</h4>
        </div>
    @endif

    <div class="grid-xs-12">
        <div class="grid grid--columns">
            <div class="modularity-event-{{ $template }}"
                 data-archive-url="{{ $archive_url }}"
            >
                <div class="gutter gutter-xl">
                    <div class="loading">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>