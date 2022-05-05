@if($locationInfo)
    @card([])
        <div class="c-card__body">
            @include('partials.heading', ['heading' => $lang->location])
            
            @if($locationInfo['latitude'] && $locationInfo['longitude'])
                <div class="u-margin__top--2" id="event-map" data-lat="{{$locationInfo['latitude']}}" data-lng="{{$locationInfo['longitude']}}" data-title="{{$locationInfo['title']}}"></div>
            @endif

            <ul class="unlist">
                <li>{{ $locationInfo['title'] }}</li>
                <li>{{ $locationInfo['street_address'] }}</li>
                <li>{{ $locationInfo['postal_code'] }} {{ $locationInfo['city'] }}</li>
            </ul>

            @if($locationInfo['additional_locations'])
                @typography([])
                    <strong>{{ $lang->locationOthers }}</strong>
                    @foreach($locationInfo['additional_locations'] as $location)
                        <ul class="unlist u-margin__top--2">
                            <li>{{ $location['title'] }}</li>
                            <li>{{ $location['street_address'] }}</li>
                            <li>{{ $location['postal_code'] }} {{ $location['city'] }}</li>
                        </ul>
                    @endforeach
                @endtypography
            @endif
        </div>
    @endcard
@endif