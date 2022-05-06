@card([])
    <div class="c-card__body">
        @include('partials.heading', ['heading' => $eventLang->date])

        @if(is_array($event['occasions']))
            <ul>
                @foreach(array_slice($event['occasions'], 0, 3) as $occasion)
                    <li>
                        @link([
                            'href' => $occasion->permalink
                        ])
                            {{ $occasion->formatted }}
                            @if($occassion->status === 'cancelled')
                                - <strong>{{ $eventLang->cancelled }}</strong>
                            @elseif($occassion->status === 'rescheduled')
                                - <strong>{{ $eventLang->rescheduled }}</strong>
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
                        {{ $eventLang->occasionShowAll }}
                    @endlink
                @endtypography
            @endif
        @endif
    </div>
@endcard