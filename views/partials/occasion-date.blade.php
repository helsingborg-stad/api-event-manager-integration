{{ $occasion->formatted }}
@if($occassion->status === 'cancelled')
    - <strong>{{ $eventLang->cancelled }}</strong>
@elseif($occassion->status === 'rescheduled')
    - <strong>{{ $eventLang->rescheduled }}</strong>
@endif