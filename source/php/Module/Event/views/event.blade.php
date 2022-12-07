
@card([
    'heading' => $postTitle,
    'classList' => [$classes],
    'attributeList' => [
        'modularity-event' => '',
        'js-pagination-target' => ''
    ]
])
    @if (!$hideTitle && !empty($postTitle))
        <div class="c-card__header">
            @typography([
                'element' => 'h2',
                'variant'   => 'h4'
            ])
                {!! $postTitle !!}
            @endtypography
        </div>
    @endif


    @include('partials.list')        
@endcard
