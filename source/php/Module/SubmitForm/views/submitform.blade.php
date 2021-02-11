@card([
    'classList' => [
        'c-card--panel',
        $classes
    ]
])
    @if (!$hideTitle && !empty($post_title))
        <div class="c-card__header">
            @typography([
                'element' => "h4"
            ])
                {!! apply_filters('the_title', $post_title) !!}
            @endtypography
        </div>
    @endif

    <div class="c-card__body">
        @include('formfields')
    </div>
@endcard