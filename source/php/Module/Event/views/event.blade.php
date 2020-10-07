<div id="event-{{$ID}}" class="{{ $classes }} {{ isset($font_size) ? $font_size : '' }}" data-module-id="{{ $ID }}">
    <ul class="u-unlist u-margin--0 u-padding--0">
        <div class="event-module-content">
            @include('partials.list')
        </div>
    </ul>

    <div class="event-module-footer gutter gutter-sm gutter-horizontal">
        @if ($mod_event_pagination && $pagesCount > 1)
            @pagination([
                'list' => $paginationList, 
                'classList' => ['u-margin--1'], 
                'current' => isset($_GET['paged']) ? $_GET['paged'] : 1,
                'linkPrefix' => '?paged=',
                'anchorTag' => '#event-' . $ID
            ])
            @endpagination
        @endif
        @if ($mod_event_archive)
            @button([
                'text' =>  __('More events', 'event-integration'),
                'color' => 'primary',
                'style' => 'basic',
                'href' => get_post_type_archive_link('event'),
                'icon' => 'add',
                'reversePositions' => true,
            ])
            @endbutton 
        @endif
    </div>
</div>
