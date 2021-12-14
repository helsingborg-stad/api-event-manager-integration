@foreach($field->type->props['options'] as $option)
    @option([
        'type' => 'radio',
        'checked' => $option->checked,
        'attributeList' => [
            'data-id' => $option->id,
            'name' => $field->props['name'],1
        ],
        'classList' => ['u-display--inline-block'],
        'label' => $option->label
    ])
    @endoption
@endforeach
