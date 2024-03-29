@if(!empty($social['links']))
    @card([])
        <div class="c-card__body">
            @include('partials.heading', ['heading' => $eventLang->socialLinks])

            <ul role="list">
                @foreach ($social['links'] as $key => $link)
                    @if(is_array($link))
                        @foreach($link as $sublink)
                            <li role="listitem">
                                @link(['href' => $sublink['youtube_link'] ?? $sublink['vimeo_link']])
                                    {{ $social['labels'][$key] }}
                                @endlink
                            </li>
                        @endforeach
                    @else
                        <li role="listitem">
                            @link(['href' => $link])
                                {{ $social['labels'][$key] }}
                            @endlink
                        </li>
                    @endif
                @endforeach
            </ul>
        </div>
    @endcard
@endif
