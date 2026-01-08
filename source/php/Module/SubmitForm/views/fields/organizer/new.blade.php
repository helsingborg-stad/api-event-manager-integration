@field([
    'id'   => 'organizer-title',
    'type' => 'text',
    'attributeList' => [
        'type' => 'text',
        'name' => $organizer->name . '-name',
        'field' => 'title',
        'autocomplete' => 'off'
    ],
    'label' => $translations['name']
])
@endfield

@field([
    'id'   => 'organizer-phone',
    'attributeList' => [
        'type' => 'tel',
        'name' => $organizer->name . '-phone',
        'field' => 'phone',
        'autocomplete' => 'off'
    ],
    'label' => $translations['phoneNumber']
])
@endfield

@field([
    'id'   => 'organizer-mail',
    'attributeList' => [
        'type' => 'email',
        'name' => $organizer->name . '-mail',
        'field' => 'email',
        'autocomplete' => 'off',
        'pattern' => '^[^@]+@[^@]+\.[^@]+$'
    ],
    'label' => $translations['email']
])
@endfield
