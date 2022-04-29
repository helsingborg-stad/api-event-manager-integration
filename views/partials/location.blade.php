@if($locationInfo)
    @card([])
        <div class="c-card__body">
            @include('partials.heading', ['heading' => __('Location', 'event-integration')])
            
            @if($locationInfo['latitude'] && $locationInfo['longitude'] && $locationInfo['title'])
                <div id="event-map" data-lat="{{$locationInfo['latitude']}}" data-lng="{{$locationInfo['longitude']}}" data-title="{{$locationInfo['title']}}"></div>
            @endif

        </div>
    @endcard
@endif