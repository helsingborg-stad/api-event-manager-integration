@if(!empty($event['booking_link']) || !empty($event['ticket_includes']))
    @card([])
        <div class="c-card__body">

            @include('partials.heading', ['heading' => $eventLang->ticket])

            @if(!empty($bookingInfo['price_information']))
                @typography
                    {{ $bookingInfo['price_information'] }}
                @endtypography
            @endif

            @if(!empty($bookingInfo['ticket_includes']))
                @typography
                    {{ sprintf($eventLang->ticketIncludes, $bookingInfo['ticket_includes']) }}
                @endtypography
            @endif
            
            @if(!empty($event['booking_link']))
                @button([
                    'color' => 'primary',
                    'style' => 'filled',
                    'href' => $event['booking_link'],
                    'classList' => ['u-margin__top--3'],
                    'icon' => 'arrow_forward',
                    'fullWidth' => true,
                    'text' => $eventLang->bookingLinkButton,
                    'attributeList' => ['aria-label' => $eventLang->bookingLinkAriaLabel]
                ])
                @endbutton
            @endif
        </div>
    @endcard
@endif