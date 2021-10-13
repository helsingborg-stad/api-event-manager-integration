@field([
    'id'   => 'location-title',
    'type' => 'text',
    'attributeList' => [
        'type' => 'text',
        'name' => $location->name . '-title',
        'field' => 'title',
        'autocomplete' => 'off'
    ],
    'label' => __('Name', 'event-integration')
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
    'label' => __('Street address', 'event-integration')
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
    'label' => __('Postal code', 'event-integration')
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
    'label' => __('City', 'event-integration')
])
@endfield




