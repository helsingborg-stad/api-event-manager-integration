@php
    $class = [];
    $class[] = !empty($field['marginTop']) ? 'u-margin__top--3' : '';
    $class[] = !empty($field['marginBottom']) ? 'u-margin__bottom--3' : '';
    $class = trim(implode(' ', $class));
@endphp

<div class="{{$class}}">
    @if (!empty($field['label']))
        @typography([
            'element' => $field['element'] ?? 'h2'
            ])
            {!! $field['label'] !!}
        @endtypography
    @endif
    @if (!empty($field['description']))
        @typography([
            'element' => 'p'
            ])
            {!! $field['description'] !!}
        @endtypography
    @endif
</div>
