@if(!empty($contactInfo)) 
    @card([])
        <div class="c-card__body">
            @include('partials.heading', ['heading' => $eventLang->contact])
            
            <ul role="list" class="unlist u-margin__top--2">
                @if(!empty($contactInfo['contact_information']))
                    <li role="listitem">{{ $contactInfo['contact_information'] }}</li>
                @endif
                
                @if($contactInfo['contact_phone'])
                    <li role="listitem">
                        {{ $eventLang->contactPhone }}:
                        @link(['href' => 'tel:' . $contactInfo['contact_phone']])
                            {{ $contactInfo['contact_phone'] }}
                        @endlink
                    </li>
                @endif
                
                @if($contactInfo['contact_email'])
                    <li role="listitem">
                        {{ $eventLang->contactEmail }}:
                        @link(['href' => 'mailto:' . $contactInfo['contact_email']])
                            {{ $contactInfo['contact_email'] }}
                        @endlink
                    </li>
                @endif
            </ul>
        </div>
    @endcard
@endif