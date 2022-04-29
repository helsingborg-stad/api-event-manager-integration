@card([])
    <div class="c-card__body">
        @include('partials.heading', ['heading' => __('Contact', 'event-integration')])
        
        <ul class="unlist u-margin__top--2">
            @if($contactInfo['contact_information'])
                <li>{{ $contactInfo['contact_information'] }}</li>
            @endif
            
            @if($contactInfo['contact_phone'])
                <li>
                    {{ _e('Phone:', 'event-integration') }}
                    @link(['href' => 'tel:' . $contactInfo['contact_phone']])
                        {{ $contactInfo['contact_phone'] }}
                    @endlink
                </li>
            @endif
            
            @if($contactInfo['contact_email'])
                <li>
                    {{ _e('E-mail:', 'event-integration') }}
                    @link(['href' => 'mailto:' . $contactInfo['contact_email']])
                        {{ $contactInfo['contact_email'] }}
                    @endlink
                </li>
            @endif
        </ul>
    </div>
@endcard