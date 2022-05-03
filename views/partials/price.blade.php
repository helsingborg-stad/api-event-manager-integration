<ul>
    @if($bookingInfo['price_adult']['formatted_price'])
        <li>
            <strong>{{ _e('Standard:', 'event-integration') }}</strong>
            {{ $bookingInfo['price_adult']['formatted_price'] }}
        </li>
    @endif

    @if($bookingInfo['price_children']['formatted_price'])
        <li>
            <strong>{{ sprintf(__('Children (below %d years):', 'event-integration'), $bookingInfo['children_age']) }}</strong>
            {{ $bookingInfo['price_children']['formatted_price'] }}
        </li>
    @endif

    @if($bookingInfo['price_senior']['formatted_price'])
        <li>
            <strong>{{ sprintf(__('Seniors (above %d years):', 'event-integration'), $bookingInfo['senior_age']) }}</strong>
            {{ $bookingInfo['price_senior']['formatted_price'] }}
        </li>
    @endif

    @if($bookingInfo['price_student']['formatted_price'])
        <li>
            <strong>{{ _e('Students:', 'event-integration') }}</strong>
            {{ $bookingInfo['price_student']['formatted_price'] }}
        </li>
    @endif
</ul>

@if($bookingInfo['membership_cards'])
    @typography([])
        <strong>{{ _e('Included in membership cards', 'event-integration') }}</strong>
    @endtypography
    <ul class="unlist">
        @foreach($bookingInfo['membership_cards'] as $card)
            <li>{{ $card['post_title'] }}</li>
        @endforeach
    </ul>
@endif

@if(!empty($bookingInfo['booking_group']) && is_array($bookingInfo['booking_group']))
    @typography([])
        <strong>{{ _e('Group prices', 'event-integration') }}</strong>
    @endtypography

    <ul>
        @foreach ($bookingInfo['booking_group'] as $group)
            <li>
                {{ sprintf(
                    __('%d to %d people: %s', 'event-integration'),
                    $group['min_persons'],
                    $group['max_persons'],
                    $group['price_group']
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
        <strong>{{ _e('Price range', 'event-integration') }}</strong>
    @endtypography
    <ul>
        @if($bookingInfo['price_range']['seated_minimum_price'])
            <li>
                <strong>{{ __('Seated minimum price:', 'event-integration') }}</strong> {{ $bookingInfo['price_range']['seated_minimum_price'] }}
            </li>
        @endif

        @if($bookingInfo['price_range']['seated_maximum_price'])
            <li>
                <strong>{{ __('Seated maximum price:', 'event-integration') }}</strong> {{ $bookingInfo['price_range']['seated_maximum_price'] }}
            </li>
        @endif

        @if($bookingInfo['price_range']['standing_minimum_price'])
            <li>
                <strong>{{ __('Standing minimum price:', 'event-integration') }}</strong> {{ $bookingInfo['price_range']['standing_minimum_price'] }}
            </li>
        @endif

        @if($bookingInfo['price_range']['standing_maximum_price'])
            <li>
                <strong>{{ __('Standing maximum price:', 'event-integration') }}</strong> {{ $bookingInfo['price_range']['standing_maximum_price'] }}
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
        <strong>{{ _e('Ticket retailers', 'event-integration') }}</strong>
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
                        <strong>{{ __('Ticket release date', 'event-integration') }}</strong>
                        {{ $retailer['ticket_release_date'] }}
                    </li>
                @endif

                @if(!empty($retailer['ticket_stop_date']))
                    <li>
                        <strong>{{ __('Ticket stop date', 'event-integration') }}</strong>
                        {{ $retailer['ticket_stop_date'] }}
                    </li>
                @endif
            </ul>
        @endforeach
    @endif
@endif