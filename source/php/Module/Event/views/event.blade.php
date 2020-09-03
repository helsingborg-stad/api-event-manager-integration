<div class="{{ $classes }} {{ isset($font_size) ? $font_size : '' }}" data-module-id="{{ $ID }}">
    <ul>
        <div class="event-module-content">
            @include('partials.list')
        </div>
    </ul>

    <div class="event-module-footer gutter gutter-sm gutter-horizontal">
        @if ($mod_event_pagination && $pagesCount > 1)
            @pagination([
                'list' => $paginationList, 
                'classList' => ['u-margin__top--4'], 
                'current' => isset($_GET['paged']) ? $_GET['paged'] : 1,
                'linkPrefix' => '?paged='
            ])
            @endpagination
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
