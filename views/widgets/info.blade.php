@card([])
    <div class="c-card__body">
        @include('partials.heading', ['heading' => get_the_title()])
        
        @if(is_array($event['occasions']))
            <ul>
                @foreach(array_slice($event['occasions'], 0, 3) as $occasion)
                    <li>
                        @if($occasion->formatted !== $event['occasion']['formatted'])
                            @link([
                                'href' => $occasion->permalink
                            ])
                                @include('partials.occasion-date')
                            @endlink
                        @else
                            @include('partials.occasion-date')
                        @endif
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
                <li><strong>{{ $eventLang->occasionDuration }}:</strong> {{ $event['occasion']['duration_formatted'] }}</li>
            @endif

            @if($event['age_group'])
                <li><strong>{{ $eventLang->age }}:</strong> {{ $event['age_group'] }}</li>
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

        @if($event['eventLink'])
            <div class="u-margin__top--3">
                @link(['href' => $event['eventLink']])
                    {{ $eventLang->goToEventWebsite}}
                @endlink
            </div>
        @endif
        
        @include('partials.price')
    </div>
@endcard