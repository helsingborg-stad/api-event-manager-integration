@card([])
    <div class="c-card__body">
        @include('partials.heading', ['heading' => get_the_title()])
        
        @include('partials.occasions')

        @if ($event['location'])
            @typography([])
                <strong>{{ _e('Location:', 'event-integration') }}</strong> {{ $event['location']['title'] }}
            @endtypography
        @endif

        @include('partials.heading', ['heading' => __('Price', 'event-integration')])
        @include('partials.price')
    </div>
@endcard