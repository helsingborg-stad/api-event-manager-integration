@if($bookingInfo['membership_cards'])
    @foreach($bookingInfo['membership_cards'] as $card)
        @card([])
            <div class="c-card__body">
                @include('partials.heading', ['heading' => $card['post_title']])

                @if($card['post_content'])
                    @typography
                        {{ $card['post_content'] }}
                    @endtypography
                @endif

                @if($card['website'])
                    @button([
                        'text' => ucfirst(str_replace('www.', '', strtolower(parse_url($card['website'])['host']))),
                        'fullWidth' => true,
                        'href' => $card['website'],
                        'color' => 'primary',
                        'style' => 'filled',
                        'icon' => 'arrow_forward',
                        'classList' => ['u-margin__top--2']
                    ])
                    @endbutton
                @endif
            </div>
        @endcard
    @endforeach
@endif