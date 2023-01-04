@if(isset($bookingInfo['price_adult']['formatted_price']) && !empty($bookingInfo['price_adult']['formatted_price']))
    @typography([
        'element'   => 'h2',
        'variant'   => 'h3',
        'classList' => ['c-card__heading', 'u-margin__top--2']
    ])
        {{ $eventLang->price }}
    @endtypography
    
    <ul role="list">
        @if(isset($bookingInfo['price_adult']['formatted_price']))
            <li role="listitem">
                <strong id="single-event-price-adults">{{ $eventLang->priceStandard }}:</strong>
                <span aria-labelledby="single-event-price-adults">{{ $bookingInfo['price_adult']['formatted_price'] }}</span>
            </li>
        @endif

        @if(isset($bookingInfo['price_children']['formatted_price']))
            <li role="listitem">
                <strong id="single-event-price-children">>{{ sprintf($eventLang->priceChildren, $bookingInfo['children_age']) }}:</strong>
                <span aria-labelledby="single-event-price-children">{{ $bookingInfo['price_children']['formatted_price'] }}</span>
            </li>
        @endif

        @if(isset($bookingInfo['price_senior']['formatted_price']))
            <li role="listitem">
                <strong id="single-event-price-seniors">>{{ sprintf($eventLang->priceSeniors, $bookingInfo['senior_age']) }}:</strong>
                <span aria-labelledby="single-event-price-seniors">{{ $bookingInfo['price_senior']['formatted_price'] }}</span>
            </li>
        @endif

        @if(isset($bookingInfo['price_student']['formatted_price']))
            <li role="listitem">
                <strong id="single-event-price-students">>{{ $eventLang->priceStudents }}:</strong>
                <span aria-labelledby="single-event-price-students">{{ $bookingInfo['price_student']['formatted_price'] }}</span>
            </li>
        @endif
    </ul>
@endif

@if($bookingInfo['membership_cards'])
    @typography(['id' => 'single-event-membership-card'])
        <strong>{{ $eventLang->membershipCardsIncluded }}</strong>
    @endtypography

    <ul role="list" aria-labelledby="single-event-membership-card" class="unlist">
        @foreach($bookingInfo['membership_cards'] as $card)
            <li role="listitem">{{ $card['post_title'] }}</li>
        @endforeach
    </ul>
@endif

@if(!empty($bookingInfo['booking_group']) && is_array($bookingInfo['booking_group']))
    @typography(['id' => 'single-event-membership-price-groups'])
        <strong>{{ $eventLang->priceGroups }}</strong>
    @endtypography

    <ul role="list" aria-labelledby="single-event-price-groups">
        @foreach ($bookingInfo['booking_group'] as $group)
            <li role="listitem">
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
    <ul role="list">
        @if(isset($bookingInfo['price_range']['seated_minimum_price']['formatted_price']))
            <li role="listitem">
                <strong id="single-event-price-seated-min">{{ $eventLang->priceSeatedMin }}</strong> <span aria-labelledby="single-event-price-seated-min">{{ $bookingInfo['price_range']['seated_minimum_price']['formatted_price'] }}</span>
            </li>
        @endif

        @if(isset($bookingInfo['price_range']['seated_maximum_price']['formatted_price']))
            <li role="listitem">
                <strong id="single-event-price-seated-max">{{ $eventLang->priceSeatedMax }}</strong>  <span aria-labelledby="single-event-price-seated-max">{{ $bookingInfo['price_range']['seated_maximum_price']['formatted_price'] }}</span>
            </li>
        @endif

        @if(isset($bookingInfo['price_range']['standing_minimum_price']['formatted_price']))
            <li role="listitem">
                <strong id="single-event-price-standing-min">{{ $eventLang->priceStandingMin }}</strong>  <span aria-labelledby="single-event-price-standing-min">{{ $bookingInfo['price_range']['standing_minimum_price']['formatted_price'] }}</span>
            </li>
        @endif

        @if(isset($bookingInfo['price_range']['standing_maximum_price']['formatted_price']))
            <li role="listitem">
                <strong id="single-event-price-seated-max">{{ $eventLang->priceStandingMax }}</strong>  <span aria-labelledby="single-event-price-standing-max">{{ $bookingInfo['price_range']['standing_maximum_price']['formatted_price'] }}</span>
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
                @typography(['id' => 'single-event-retailer-name'])
                    <strong>{{ $retailer['retailer_name'] }}</strong>
                @endtypography
            @endif

            <ul role="list" aria-labelledby="single-event-retailer" class="unlist">
                @if($parsedUrl = parse_url($retailer['booking_url']))
                    <li role="listitem">
                        @link(['href' => $retailer['booking_url'], 
                               'attributeList' => ['aria-label' => $eventLang->bookingLinkAriaLabel]
                            ])
                            {{ $parsedUrl['host'] }}
                        @endlink
                    </li>
                @endif

                @if(!empty($retailer['ticket_release_date']))
                    <li role="listitem">
                        <strong id="single-event-ticket-release-date">{{ $eventLang->ticketReleaseDate }}</strong> 
                        <span aria-labelledby="single-event-price-release-date">{{ $retailer['ticket_release_date'] }}</span>
                    </li>
                @endif

                @if(!empty($retailer['ticket_stop_date']))
                    <li role="listitem">
                        <strong id="single-event-ticket-stop-date">{{ $eventLang->ticketStopDate }}</strong> 
                        <span aria-labelledby="single-event-price-stop-date">{{ $retailer['ticket_stop_date'] }}</span>
                    </li>
                @endif
            </ul>
        @endforeach
    @endif
@endif