@field([
    'id'   => 'location-title',
    'type' => 'text',
    'attributeList' => [
        'type' => 'text',
        'name' => $location->name . '-title',
        'field' => 'title',
        'autocomplete' => 'off'
    ],
    'label' => $translations['name']
])
@endfield

@field([
    'id'   => 'location-street-address',
    'type' => 'text',
    'attributeList' => [
        'type' => 'text',
        'name' => $location->name . '-street-address',
        'field' => 'street_address',
        'autocomplete' => 'off'
    ],
    'label' => $translations['streetAddress']
])
@endfield

@field([
    'id'   => 'location-phone',
    'attributeList' => [
        'type' => 'tel',
        'name' => $location->name . '-postal-code',
        'field' => 'postal_code',
        'autocomplete' => 'off'
    ],
    'label' => $translations['postalCode']
])
@endfield

@field([
    'id'   => 'location-city',
    'type' => 'text',
    'attributeList' => [
        'type' => 'text',
        'name' => $location->name . '-city',
        'field' => 'city',
        'autocomplete' => 'off'
    ],
    'label' => $translations['city']
])
@endfield
