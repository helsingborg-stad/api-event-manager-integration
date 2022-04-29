@if($event['occasions'])
    <ul>
        @foreach($event['occasions'] as $occasion)
            <li>
                {{ $occasion->formatted }}
                
                @if($occassion->status === 'cancelled')
                    - <strong>{{ _e('Cancelled', 'event-integration') }}</strong>
                @elseif($occassion->status === 'rescheduled')
                    - <strong>{{ _e('Rescheduled', 'event-integration') }}</strong>
                @endif
            </li>
        @endforeach
    </ul>
@endif