<ul class="unlist">
    @typography([])
        @if($bookingInfo['price_adult']['formatted_price'])
            <li>
                <strong>{{ _e('Price:', 'event-integration') }}</strong>
                {{ $bookingInfo['price_adult']['formatted_price'] }}
            </li>
        @endif

        @if($bookingInfo['price_children']['formatted_price'])
            <li>
                <strong>{{ sprintf(__('Children (below %d years):', 'event-integration'), $bookingInfo['children_age']) }}</strong>
                {{ $bookingInfo['price_children']['formatted_price'] }}
            </li>
        @endif

        @if($bookingInfo['price_senior']['formatted_price'])
            <li>
                <strong>{{ sprintf(__('Seniors (above %d years):', 'event-integration'), $bookingInfo['senior_age']) }}</strong>
                {{ $bookingInfo['price_senior']['formatted_price'] }}
            </li>
        @endif

        @if($bookingInfo['price_student']['formatted_price'])
            <li>
                <strong>{{ _e('Students:', 'event-integration') }}</strong>
                {{ $bookingInfo['price_student']['formatted_price'] }}
            </li>
        @endif
    @endtypography
</ul>

@if($membershipCards)
    <p>
        {{ _e('Included in membership cards', 'event-integration') }}
    </p>
    <ul class="unlist">
        @foreach($membershipCards as $card)
            <li>{{ $card['post_title'] }}</li>
        @endforeach
    </ul>
@endif