@field([
    'id'   => $field->name,
    'type' => 'text',
    'attributeList' => [
        'type' => 'text',
        'name' => $field->name,
    ],
    'required' => $field->required,
])
@endfield
