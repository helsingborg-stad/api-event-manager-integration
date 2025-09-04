
@if (!$hideTitle && !empty($postTitle))
    @typography([
        'element' => 'h2', 
        'variant' => 'h2', 
        'classList' => ['module-title']
    ])
        {!! $postTitle !!}
    @endtypography
@endif

<div class="o-grid {{ $classes }}">
    <div class="o-grid-12">
        <div class="modularity-event-{{ $template }}{{ $mobileHorizontalTrack ? ' modularity-event-index--mobile-slider' : '' }}"
             data-module-id="{{ $ID }}"
             data-post-id="{{ $post_id }}"
             data-settings="{{ json_encode($settings) }}"
             data-grid-column="{{ $gridColumn }}"
             data-archive-url="{{ $archive_url }}"
             data-rest-url="{{ $rest_url }}"
             data-end-date="{{ $end_date }}"
             data-lat="{{ $lat }}"
             data-lng="{{ $lng }}"
             data-distance="{{ $distance }}"
             data-categories="{{ $categories }}"
             data-groups="{{ $groups }}"
             data-tags="{{ $tags }}"
             data-lang="{{ $lang }}"
             data-reset-url="{{ $reset_url }}"
             data-age-from="{{$age_from}}"
             data-age-to="{{$age_to}}"
             data-no-url="{{$no_url}}"
             data-card-style="{{$card_style}}"
             data-mobile-slider="{{$mobileHorizontalTrack ? 'true' : 'false'}}"
        >
        </div>
    </div>
</div>
