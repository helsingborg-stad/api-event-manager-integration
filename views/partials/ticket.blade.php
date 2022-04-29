@card([
    'classList' => ['u-margin__top--5']
])
    <div class="c-card__body">
        @include('partials.heading', ['heading' => __('Ticket', 'event-integration')])

        @if($bookingInfo['price_information'])
            @typography
                {{ $bookingInfo['price_information'] }}
            @endtypography
        @endif

        @if($bookingInfo['ticket_includes'])
            @typography
                {{ sprintf(__('The ticket includes %s.', 'event-integration'), $bookingInfo['ticket_includes']) }}
            @endtypography
        @endif
        
        @if($event['booking_link'])
            @button([
                'color' => 'primary',
                'style' => 'filled',
                'href' => $event['booking_link'],
                'classList' => ['u-margin__top--3'],
                'icon' => 'arrow_forward',
                'fullWidth' => true,
                'text' => __('Buy ticket', 'event-integration')
            ])
            @endbutton
        @endif
    </div>
@endcard