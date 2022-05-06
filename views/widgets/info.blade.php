@card([])
    <div class="c-card__body">
        @include('partials.heading', ['heading' => get_the_title()])
        
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

        <ul class="unlist u-margin__top--3">
            @if ($event['occasion']['duration_formatted'])
                <li><strong>{{ $eventLang->occasionDuration }}</strong> {{ $event['occasion']['duration_formatted'] }}</li>
            @endif

            @if ($locationInfo)
                <li><strong>{{ $eventLang->location }}</strong> {{ $locationInfo['title'] }}</li>
            @endif


            @if($event['age_group'])
                <li><strong>{{ $eventLang->age }}</strong> {{ $event['age_group'] }}</li>
            @endif
        </ul>
        
        @if($locationInfo['accessibility'])
            <div class="u-margin__top--3">
                <strong>{{ $eventLang->locationAccessibility }}</strong>
                <ul>
                    @foreach($locationInfo['accessibility'] as $accessibility)
                        <li>{{ $accessibility }}</li>
                    @endforeach
                </ul>
            </div>
        @endif
        
        @typography([
            'element'   => 'h2',
            'variant'   => 'h3',
            'classList' => ['c-card__heading', 'u-margin__top--2']
        ])
            {{ $eventLang->price }}
        @endtypography
        @include('partials.price')
    </div>
@endcard