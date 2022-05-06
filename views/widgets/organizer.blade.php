@card([])
    <div class="c-card__body">
        @include('partials.heading', ['heading' => $eventLang->organizer])

        @if(!empty($event['organizers']))
            @foreach($event['organizers'] as $organizer)
                @if(!empty($organizer['organizer']))
                    @typography([])
                        <strong>{{ $organizer['organizer'] }}</strong>
                    @endtypography
                @endif
                <ul>
                    @if(!empty($organizer['organizer_phone']))
                        <li>
                            @link(['href' => 'tel:' . $organizer['organizer_phone']])
                                {{ $organizer['organizer_phone'] }}
                            @endlink
                        </li>
                    @endif

                    @if(!empty($organizer['organizer_email']))
                        <li>
                            @link(['href' => 'mailto:' . $organizer['organizer_email']])
                                {{ $organizer['organizer_email'] }}
                            @endlink
                        </li>
                    @endif

                    @if($parsedUrl = parse_url($organizer['organizer_link']))
                        @link(['href' => $organizer['organizer_link']])
                            <li>{{ ucfirst($parsedUrl['host']) }}</li>
                        @endlink
                    @endif
                </ul>
            @endforeach
        @endif

        @if(!empty($event['supporters']))
            @typography([])
                <strong>{{ $eventLang->supporters }}</strong>
            @endtypography

            <ul>
                @foreach($event['supporters'] as $supporter)
                    @if(!empty($supporter['post_title']))
                        <li>{{ $supporter['post_title'] }}</li>
                    @endif
                @endforeach
            </ul>
        @endif
    </div>
@endcard
