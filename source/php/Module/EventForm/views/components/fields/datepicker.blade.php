@field([
    'type' => 'datepicker',
    'value' => '',
    'label' => $field->label,
    'attributeList' => [
        'type' => 'text',
        'name' => $field->type->props['name'],
    ],
    'classList' => ['datepicker'],
    'required' => $field->required,
    'datepicker' => [
        'title'    => $field->type->props['title'],
        'required' => $field->required,
    ]
])
@endfield
