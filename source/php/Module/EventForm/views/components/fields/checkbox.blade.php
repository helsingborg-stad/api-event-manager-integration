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
