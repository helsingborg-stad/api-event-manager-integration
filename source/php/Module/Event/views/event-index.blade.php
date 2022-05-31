
@if (!$hideTitle && !empty($postTitle))
    @typography([
        'element' => 'h4', 
        'variant' => 'h2', 
        'classList' => ['module-title']
    ])
        {!! $postTitle !!}
    @endtypography
@endif

<div class="o-grid {{ $classes }}">
    <div class="o-grid-12">
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
             data-categories="{{ json_encode($categories) }}"
             data-groups="{{ json_encode($groups) }}"
             data-tags="{{ json_encode($tags) }}"
             data-age-range="{{ json_encode($age_range) }}"
             data-lang="{{ $lang }}"
        >
        </div>
    </div>
</div>
