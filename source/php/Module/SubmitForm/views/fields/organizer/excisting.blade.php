@field([
    'id'   => 'organizer-selector',
    'type' => 'text',
    'attributeList' => [
        'type' => 'text',
        'name' => $organizer->name,
        'autocomplete' => 'off'
    ],
    'label' => $organizer->label,
    'required' => $organizer->required,
])
@endfield
