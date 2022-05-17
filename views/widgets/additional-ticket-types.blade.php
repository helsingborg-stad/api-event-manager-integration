@if($bookingInfo['additional_ticket_types'] && !empty($bookingInfo['additional_ticket_types']))
    @card([])
        <div class="c-card__body">
            @include('partials.heading', ['heading' => $eventLang->ticketTypes])

            @if(!empty($bookingInfo['additional_ticket_types']) && is_array($bookingInfo['additional_ticket_types']))
                @foreach ($bookingInfo['additional_ticket_types'] as $index => $ticketType)
                    @if(!empty($ticketType['ticket_name']))
                        @typography([])
                            <strong>{{ $ticketType['ticket_name'] }}</strong>
                        @endtypography
                    @endif
                    
                    <ul>
                        @if(!empty($ticketType['ticket_type']))
                            <li>
                                <strong>{{ strtolower($ticketType['ticket_type']) === 'seated' ? $eventLang->ticketSeated : $eventLang->ticketStanding }}</strong>
                            </li>
                        @endif

                        @if($ticketType['minimum_price']['formatted_price'])
                            <li>
                                <strong>{{ $eventLang->priceMin }}</strong>
                                {{ $ticketType['minimum_price']['formatted_price'] }}
                            </li>
                        @endif

                        @if($ticketType['maximum_price']['formatted_price'])
                            <li>
                                <strong>{{ $eventLang->priceMax }}</strong>
                                {{ $ticketType['maximum_price']['formatted_price'] }}
                            </li>
                        @endif
                    </ul>
                @endforeach
            @endif
        </div>
    @endcard
@endif