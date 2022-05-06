@if($groups|| $categories || $tags)
    @card([])
        <div class="c-card__body">
            @if (!empty($groups) && is_array($groups))
                @typography([
                    'element'   => 'h2',
                    'variant'   => 'h3',
                    'classList' => ['c-card__heading', 'u-margin__top--2']
                ])
                    {{ $eventLang->groups }}
                @endtypography
                <ul>
                    @foreach ($groups as $group)
                        <li>{{ $group['name'] }}</li>
                    @endforeach
                </ul>
            @endif

            @if (!empty($categories) && is_array($categories))
                @typography([
                    'element'   => 'h2',
                    'variant'   => 'h3',
                    'classList' => ['c-card__heading', 'u-margin__top--2']
                ])
                    {{ $eventLang->categories }}
                @endtypography
                <ul>
                    @foreach ($categories as $category)
                        <li>{{ $category }}</li>
                    @endforeach
                </ul>
            @endif

            @if (!empty($tags) && is_array($tags))
                @typography([
                    'element'   => 'h2',
                    'variant'   => 'h3',
                    'classList' => ['c-card__heading', 'u-margin__top--2']
                ])
                    {{ $eventLang->tags }}
                @endtypography
                <ul>
                    @foreach ($tags as $tag)
                        <li>{{ $tag }}</li>
                    @endforeach
                </ul>
            @endif
        </div>
    @endcard
@endif
