@if(!empty($groups) || !empty($categories) || !empty($tags))
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
                <ul role="list">
                    @foreach ($groups as $group)
                        <li role="listitem">{{ $group['name'] }}</li>
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
                <ul role="list">
                    @foreach ($categories as $category)
                        <li role="listitem">{{ $category }}</li>
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
                <ul role="list">
                    @foreach ($tags as $tag)
                        <li role="listitem">{{ $tag }}</li>
                    @endforeach
                </ul>
            @endif
        </div>
    @endcard
@endif
