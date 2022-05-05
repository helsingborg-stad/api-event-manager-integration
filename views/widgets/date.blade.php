@card([])
    <div class="c-card__body">
        @include('partials.heading', ['heading' => $lang->date])

        @if(is_array($event['occasions']))
            <ul>
                @foreach(array_slice($event['occasions'], 0, 3) as $occasion)
                    <li>
                        @link([
                            'href' => $occasion->permalink
                        ])
                            {{ $occasion->formatted }}
                            @if($occassion->status === 'cancelled')
                                - <strong>{{ $lang->cancelled }}</strong>
                            @elseif($occassion->status === 'rescheduled')
                                - <strong>{{ $lang->rescheduled }}</strong>
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
                        {{ $lang->occasionShowAll }}
                    @endlink
                @endtypography
            @endif
        @endif
    </div>
@endcard