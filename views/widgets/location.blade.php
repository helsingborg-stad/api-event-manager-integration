@if(!empty($locationInfo['street_address']) || !empty($locationInfo['city']) || !empty($locationInfo['additional_locations']))
    @if($locationInfo)
        @card([])
            <div class="c-card__body">
                @include('partials.heading', ['heading' => $eventLang->location])
                
                @link([
                    'href' => 'https://www.google.com/maps/dir//' . urlencode(
                        implode(' ', [
                            $locationInfo['street_address'],
                            $locationInfo['postal_code'],
                            $locationInfo['city']
                        ])
                    )
                ])
                    <p>
                        <ul class="unlist">
                            <li>{{ $locationInfo['title'] }}</li>
                            <li>{{ $locationInfo['street_address'] }}</li>
                            <li>{{ $locationInfo['postal_code'] }} {{ $locationInfo['city'] }}</li>
                        </ul>
                    </p>
                @endlink

                @if($locationInfo['additional_locations'])
                    @typography([])
                        <strong>{{ $eventLang->locationOthers }}</strong>
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
@endif