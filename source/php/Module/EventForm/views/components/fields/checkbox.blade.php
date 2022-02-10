<div class="c-field">
    @if(!empty($field['label']))
        <div class="c-field__label">
            {!! $field['label'] !!}
        </div>
    @endif

    @if(!empty($field['description']))
        <div class="c-field__helper">
            {!! $field['description'] !!}
        </div>
    @endif

    @foreach($field['options'] as $value => $label)
        @option([
            'type' => 'checkbox',
            'checked' => false,
            'attributeList' => [
                'data-id' => $option->id,
                'name' => $field['name'],
                'value' => $value,
            ],
            'classList' => ['u-display--inline-block'],
            'label' => $label
        ])
        @endoption
    @endforeach
</div>