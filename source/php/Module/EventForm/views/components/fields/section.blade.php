<section class="form-section">
    @if (!empty($field['label']) || !empty($field['description']))
        <header class="form-section__header form-section__body u-margin__bottom--3">
            @typography([
                'element' => "h2"
                ])
                {!! $field['label'] !!}
            @endtypography
            @typography([
                'element' => "p"
                ])
                {!! $field['description'] !!}
            @endtypography
        </header>
    @endif

    @foreach($field['fields'] as $subField)
        <div @if(!empty($subField['condition']))data-condition="{{ json_encode($subField['condition'] ?? []) }}"@endif>
            @includeFirst(
                [
                    'components.fields.' . $subField['type'] ?? '',
                    'components.fields._error'
                ],
                [
                    'field' => $subField
                ]
            )
        </div>
    @endforeach
</section>
