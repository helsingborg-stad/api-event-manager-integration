<div class="{{ $classes }} {{ isset($font_size) ? $font_size : '' }}" data-module-id="{{ $ID }}">
    @if (!$hideTitle && !empty($post_title))
        <h4 class="box-title">{!! apply_filters('the_title', $post_title) !!}</h4>
    @endif
    <ul>
        <div class="event-module-content">
            @include('partials.list')
        </div>
    </ul>

    <div class="event-module-footer gutter gutter-sm gutter-horizontal">
        @if ($mod_event_pagination && $pagesCount > 1)
            <ul class="module-pagination pagination" data-pages="{{ $pagesCount }}" data-show-arrows="{{ $mod_event_nav_arrows }}"></ul>
        @endif
        @if ($mod_event_archive)
            <ul class="event-module-archive">
                <li>
                    <a href="{{ get_post_type_archive_link('event') }}"><i class="pricon pricon-plus-o"></i> <?php _e('More events', 'event-integration'); ?></a>
                </li>
            </ul>
        @endif
    </div>
</div>
