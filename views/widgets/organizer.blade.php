@if(!empty($event['organizers']))
    @card([])
        <div class="c-card__body">
            @include('partials.heading', ['heading' => $eventLang->organizer])

            @if(!empty($event['organizers']))
                @foreach($event['organizers'] as $orgindex => $organizer)
                    @if(!empty($organizer['organizer']))
                        @typography(['id' => 'single-event-organizer-' . $orgindex])
                            <strong>{{ $organizer['organizer'] }}</strong>
                        @endtypography
                    @endif
                    @if(!empty($organizer['organizer_phone']) || !empty($organizer['organizer_email']) || !empty($organizer['organizer_link']))
                        <ul role="list" aria-labelledby="single-event-organizer-{{$orgindex}}">
                            @if(!empty($organizer['organizer_phone']))
                                <li role="listitem">
                                    @link(['href' => 'tel:' . $organizer['organizer_phone']])
                                        {{ $organizer['organizer_phone'] }}
                                    @endlink
                                </li>
                            @endif

                            @if(!empty($organizer['organizer_email']))
                                <li role="listitem">
                                    @link(['href' => 'mailto:' . $organizer['organizer_email']])
                                        {{ $organizer['organizer_email'] }}
                                    @endlink
                                </li>
                            @endif

                            @if($parsedUrl = parse_url($organizer['organizer_link']))
                                <li role="listitem">
                                    @link(['href' => $organizer['organizer_link']])
                                        {{ ucfirst($parsedUrl['host']) }}
                                    @endlink
                                </li>
                            @endif
                        </ul>
                    @endif
                @endforeach
            @endif

            @if(!empty($event['supporters']))
                @typography(['id' => 'single-event-organizer-supporters'])
                    <strong>{{ $eventLang->supporters }}</strong>
                @endtypography

                <ul role="list" aria-labelledby="single-event-organizer-supporters">
                    @foreach($event['supporters'] as $supporter)
                        @if(!empty($supporter['post_title']))
                            <li role="listitem">{{ $supporter['post_title'] }}</li>
                        @endif
                    @endforeach
                </ul>
            @endif
        </div>
    @endcard
@endif