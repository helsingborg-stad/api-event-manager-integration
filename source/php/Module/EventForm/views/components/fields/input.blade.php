@field([
    'id'   => $field->name,
    'type' => $field->type->props['type'] ?? 'text',
    'attributeList' => [
        'type' => $field->type->props['type'] ?? 'text',
        'name' => $field->name,
    ],
    'label' => $field->label,
    'required' => $field->required,
])
@endfield
