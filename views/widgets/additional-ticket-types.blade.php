@if(!empty($bookingInfo['additional_ticket_types']))
    @card([])
        <div class="c-card__body">
            @include('partials.heading', ['heading' => $eventLang->ticketTypes])

            @if(is_array($bookingInfo['additional_ticket_types']))
                @foreach ($bookingInfo['additional_ticket_types'] as $index => $ticketType)
                    @if(!empty($ticketType['ticket_name']))
                        @typography(['id' => 'single-event-tickettypes-' . $index])
                            <strong>{{ $ticketType['ticket_name'] }}</strong>
                        @endtypography
                    @endif
                    
                    <ul role="list" aria-labelledby="single-event-tickettypes-{{$index}}">
                        @if(!empty($ticketType['ticket_type']))
                            <li role="listitem">
                                <span hidden id="single-event-tickettypes-{{$index}}-type">{{ $eventLang->ticketType }}:</span> 
                                <strong aria-labelledby="single-event-tickettypes-{{$index}}-type">{{ strtolower($ticketType['ticket_type']) === 'seated' ? $eventLang->ticketSeated : $eventLang->ticketStanding }}</strong>
                            </li>
                        @endif

                        @if($ticketType['minimum_price']['formatted_price'])
                            <li role="listitem">
                                <strong id="single-event-tickettypes-{{$index}}-pricemin">{{ $eventLang->priceMin }}:</strong>
                                <span aria-labelledby="single-event-tickettypes-{{$index}}-pricemin">{{ $ticketType['minimum_price']['formatted_price'] }}</span>
                            </li>
                        @endif

                        @if($ticketType['maximum_price']['formatted_price'])
                            <li role="listitem">
                                <strong id="single-event-tickettypes-{{$index}}-pricemax">{{ $eventLang->priceMax }}:</strong>
                                <span aria-labelledby="single-event-tickettypes-{{$index}}-pricemax">{{ $ticketType['maximum_price']['formatted_price'] }}</span>
                            </li>
                        @endif
                    </ul>
                @endforeach
            @endif
        </div>
    @endcard
@endif