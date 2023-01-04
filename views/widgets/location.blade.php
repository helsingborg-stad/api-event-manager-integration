@if(!empty($locationInfo['street_address']) || !empty($locationInfo['city']) || !empty($locationInfo['additional_locations']))
    @if($locationInfo)
        @card([])
            <div class="c-card__body">
                @include('partials.heading', ['heading' => $eventLang->location])
                
                @link([
                    'attributeList' => ['aria-label' => $eventLang->locationMapAriaLabel],
                    'href' => 'https://www.google.com/maps/dir//' . urlencode(
                        implode(' ', [
                            $locationInfo['street_address'],
                            $locationInfo['postal_code'],
                            $locationInfo['city']
                        ])
                    )
                ])
                    <p>
                        {{ $locationInfo['title'] }} <br/>
                        {{ $locationInfo['street_address'] }} <br/>
                        {{ $locationInfo['postal_code'] }} {{ $locationInfo['city'] }}
                    </p>
                @endlink

                @if($locationInfo['additional_locations'])
                    @typography([])
                        <strong id="single-event-other-locations">{{ $eventLang->locationOthers }}</strong>
                        @foreach($locationInfo['additional_locations'] as $location)
                            <p aria-labelledby="single-event-other-locations" class="u-margin__top--2">
                                {{ $location['title'] }} <br/>
                                {{ $location['street_address'] }} <br/>
                                {{ $location['postal_code'] }} {{ $location['city'] }}
                            </p>
                        @endforeach
                    @endtypography
                @endif
            </div>
        @endcard
    @endif
@endif