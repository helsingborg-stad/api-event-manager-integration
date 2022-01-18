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

    @include('partials.field-loop', ['fields' => $field['fields']])
</section>
