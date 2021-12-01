@field([
    'id'   => $field->name,
    'type' => 'number',
    'attributeList' => [
        'type' => 'number',
        'name' => $field->name,
    ],
    'label' => $field->label,
        'required' => $field->required,
    ])
@endfield
