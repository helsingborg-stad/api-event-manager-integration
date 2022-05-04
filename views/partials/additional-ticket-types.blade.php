@card([])
    <div class="c-card__body">
        @include('partials.heading', ['heading' => $lang->ticketTypes])

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
                            <strong>{{ $ticketType['ticket_type'] === 'seated' ? $lang->ticketSeated : $lang->ticketStanding }}</strong>
                        </li>
                    @endif

                    @if($ticketType['minimum_price'])
                        <li>
                            <strong>{{ $lang->priceMin }}</strong>
                            {{ $ticketType['minimum_price'] }}
                        </li>
                    @endif

                    @if($ticketType['maximum_price'])
                        <li>
                            <strong>{{ $lang->priceMax }}</strong>
                            {{ $ticketType['maximum_price'] }}
                        </li>
                    @endif
                </ul>
            @endforeach
        @endif
    </div>
@endcard