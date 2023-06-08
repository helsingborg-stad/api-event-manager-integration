
@card([
    'heading' => $postTitle,
    'classList' => [$classes],
    'attributeList' => [
        'modularity-event' => '',
        'data-js-pagination-target' => ''
    ],
    'context' => ['module.posts.list']
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
