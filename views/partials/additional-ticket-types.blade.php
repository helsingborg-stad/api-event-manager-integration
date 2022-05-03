@card([])
    <div class="c-card__body">
        @include('partials.heading', ['heading' => __('Ticket types', 'event-integration')])

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
                            <strong>{{ $ticketType['ticket_type'] === 'seated' ? __('Seated', 'event-integration') : __('Standing', 'event-integration') }}</strong>
                        </li>
                    @endif

                    @if($ticketType['minimum_price'])
                        <li>
                            <strong>{{ _e('Minimum price:', 'event-integration') }}</strong>
                            {{ $ticketType['minimum_price'] }}
                        </li>
                    @endif

                    @if($ticketType['maximum_price'])
                        <li>
                            <strong>{{ _e('Maximum price:', 'event-integration') }}</strong>
                            {{ $ticketType['maximum_price'] }}
                        </li>
                    @endif
                </ul>
            @endforeach
        @endif
    </div>
@endcard