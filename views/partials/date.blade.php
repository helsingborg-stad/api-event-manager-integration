@card([])
    <div class="c-card__body">
        @include('partials.heading', ['heading' => __('Date', 'event-integration')])

        @if(is_array($event['occasions']))
            <ul>
                @foreach(array_slice($event['occasions'], 0, 3) as $occasion)
                    <li>
                        @link([
                            'href' => $occasion->permalink
                        ])
                            {{ $occasion->formatted }}
                            @if($occassion->status === 'cancelled')
                                - <strong>{{ _e('Cancelled', 'event-integration') }}</strong>
                            @elseif($occassion->status === 'rescheduled')
                                - <strong>{{ _e('Rescheduled', 'event-integration') }}</strong>
                            @endif
                        @endlink
                    </li>
                @endforeach
            </ul>

            @if(count($event['occasions']) > 3)
                @typography([])
                    @link([
                        'href' => $event['eventArchive']
                    ])
                        {{ __('Show all occasions', 'event-integration') }}
                    @endlink
                @endtypography
            @endif
        @endif
    </div>
@endcard