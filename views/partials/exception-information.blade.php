@if ($event['rescheduled'])
    <div>
        @typography([
            'element' => 'strong',
            'classList' => ['u-color__text--danger']
        ])
            {{ $event['rescheduled'] }}
        @endtypography

        @typography(['element' => 'span'])
            {{ $event['exception_information'] ? ' - ' . $event['exception_information'] : ''  }}
        @endtypography
    </div>
@endif

@if ($event['cancelled'])
    <div>
        @typography([
            'element' => 'strong',
            'classList' => ['u-color__text--danger']
        ])
            {{ $event['cancelled'] }}
        @endtypography

        @typography(['element' => 'span'])
            {{ $event['exception_information'] ? ' - ' . $event['exception_information'] : ''  }}
        @endtypography
    </div>
@endif