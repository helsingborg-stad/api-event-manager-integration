@if(isset($bookingInfo['price_adult']['formatted_price']) && !empty($bookingInfo['price_adult']['formatted_price']))
    @typography([
        'element'   => 'h2',
        'variant'   => 'h3',
        'classList' => ['c-card__heading', 'u-margin__top--2']
    ])
        {{ $eventLang->price }}
    @endtypography
    
    <ul>
        @if(isset($bookingInfo['price_adult']['formatted_price']))
            <li>
                <strong>{{ $eventLang->priceStandard }}:</strong>
                {{ $bookingInfo['price_adult']['formatted_price'] }}
            </li>
        @endif

        @if(isset($bookingInfo['price_children']['formatted_price']))
            <li>
                <strong>{{ sprintf($eventLang->priceChildren, $bookingInfo['children_age']) }}:</strong>
                {{ $bookingInfo['price_children']['formatted_price'] }}
            </li>
        @endif

        @if(isset($bookingInfo['price_senior']['formatted_price']))
            <li>
                <strong>{{ sprintf($eventLang->priceSeniors, $bookingInfo['senior_age']) }}:</strong>
                {{ $bookingInfo['price_senior']['formatted_price'] }}
            </li>
        @endif

        @if(isset($bookingInfo['price_student']['formatted_price']))
            <li>
                <strong>{{ $eventLang->priceStudents }}:</strong>
                {{ $bookingInfo['price_student']['formatted_price'] }}
            </li>
        @endif
    </ul>
@endif

@if($bookingInfo['membership_cards'])
    @typography([])
        <strong>{{ $eventLang->membershipCardsIncluded }}</strong>
    @endtypography

    <ul class="unlist">
        @foreach($bookingInfo['membership_cards'] as $card)
            <li>{{ $card['post_title'] }}</li>
        @endforeach
    </ul>
@endif

@if(!empty($bookingInfo['booking_group']) && is_array($bookingInfo['booking_group']))
    @typography([])
        <strong>{{ $eventLang->priceGroups }}</strong>
    @endtypography

    <ul>
        @foreach ($bookingInfo['booking_group'] as $group)
            <li>
                {{ sprintf(
                    $eventLang->priceGroupsRange,
                    $group['min_persons'],
                    $group['max_persons'],
                    $group['price_group']['formatted_price']
                ) }}
            </li>
        @endforeach
    </ul>
@endif

@if (!empty($bookingInfo['price_range']) && is_array($bookingInfo['price_range']) && !empty(array_filter($bookingInfo['price_range'])))
    @typography([
        'element'   => 'h2',
        'variant'   => 'h3',
        'classList' => ['c-card__heading', 'u-margin__top--2']
    ])
        {{ $eventLang->priceRange }}
    @endtypography
    <ul>
        @if(isset($bookingInfo['price_range']['seated_minimum_price']['formatted_price']))
            <li>
                <strong>{{ $eventLang->priceSeatedMin }}</strong> {{ $bookingInfo['price_range']['seated_minimum_price']['formatted_price'] }}
            </li>
        @endif

        @if(isset($bookingInfo['price_range']['seated_maximum_price']['formatted_price']))
            <li>
                <strong>{{ $eventLang->priceSeatedMax }}</strong> {{ $bookingInfo['price_range']['seated_maximum_price']['formatted_price'] }}
            </li>
        @endif

        @if(isset($bookingInfo['price_range']['standing_minimum_price']['formatted_price']))
            <li>
                <strong>{{ $eventLang->priceStandingMin }}</strong> {{ $bookingInfo['price_range']['standing_minimum_price']['formatted_price'] }}
            </li>
        @endif

        @if(isset($bookingInfo['price_range']['standing_maximum_price']['formatted_price']))
            <li>
                <strong>{{ $eventLang->priceStandingMax }}</strong> {{ $bookingInfo['price_range']['standing_maximum_price']['formatted_price'] }}
            </li>
        @endif
    </ul>
@endif

@if (!empty($bookingInfo['additional_ticket_retailers']) && is_array($bookingInfo['additional_ticket_retailers']))
    @typography([
        'element'   => 'h2',
        'variant'   => 'h3',
        'classList' => ['c-card__heading', 'u-margin__top--2']
    ])
        {{ $eventLang->ticketRetailers }}
    @endtypography

    @if(!empty($bookingInfo['additional_ticket_retailers']) && is_array($bookingInfo['additional_ticket_retailers']))
        @foreach ($bookingInfo['additional_ticket_retailers'] as $index => $retailer)
            @if(!empty($retailer['retailer_name']))
                @typography([])
                    <strong>{{ $retailer['retailer_name'] }}</strong>
                @endtypography
            @endif

            <ul class="unlist">
                @if($parsedUrl = parse_url($retailer['booking_url']))
                    <li>
                        @link(['href' => $retailer['booking_url']])
                            {{ $parsedUrl['host'] }}
                        @endlink
                    </li>
                @endif

                @if(!empty($retailer['ticket_release_date']))
                    <li>
                        <strong>{{ $eventLang->ticketReleaseDate }}</strong>
                        {{ $retailer['ticket_release_date'] }}
                    </li>
                @endif

                @if(!empty($retailer['ticket_stop_date']))
                    <li>
                        <strong>{{ $eventLang->ticketStopDate }}</strong>
                        {{ $retailer['ticket_stop_date'] }}
                    </li>
                @endif
            </ul>
        @endforeach
    @endif
@endif