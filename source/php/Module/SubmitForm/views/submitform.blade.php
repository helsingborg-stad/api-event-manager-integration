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
        @include('formfields')
    </div>
@endcard
