@if($heading)
    @typography([
        'element'   => 'h2',
        'variant'   => 'h3',
        'classList' => ['c-card__heading']
    ])
        {{ $heading }}
    @endtypography
@endif