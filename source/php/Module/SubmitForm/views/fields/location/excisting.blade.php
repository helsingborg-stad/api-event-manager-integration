@field([
    'id'   => 'location-selector',
    'type' => 'text',
    'attributeList' => [
        'type' => 'text',
        'name' => 'q',
        'autocomplete' => 'off'
    ],
    'label' => $location->label,
    'required' => $location->required,
])
@endfield
