{{ $occasion->formatted }}
@if($occasion->status === 'cancelled')
    - <strong>{{ $eventLang->cancelled }}</strong>
@elseif($occasion->status === 'rescheduled')
    - <strong>{{ $eventLang->rescheduled }}</strong>
@endif