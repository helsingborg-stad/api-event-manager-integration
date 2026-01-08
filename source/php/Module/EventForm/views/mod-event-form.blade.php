@card([
    'classList' => [
        'c-card--panel',
        $classes
    ]
])
    @if (!$hideTitle && !empty($postTitle))
        <div class="c-card__header">
            @typography([
                'element' => "h4"
                ])
                {!! $postTitle !!}
            @endtypography
        </div>
    @endif
            
    <div class="c-card__body">
        @if (!empty($fields))
            @include('partials.event-form')
        @endif
    </div>
@endcard
