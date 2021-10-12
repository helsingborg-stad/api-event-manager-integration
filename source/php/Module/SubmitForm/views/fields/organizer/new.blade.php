@field([
    'id'   => 'organizer-title',
    'type' => 'text',
    'attributeList' => [
        'type' => 'text',
        'name' => $organizer->name . '-name',
        'field' => 'title',
        'autocomplete' => 'off'
    ],
    'label' => 'name'
])
@endfield

@field([
    'id'   => 'organizer-phone',
    'type' => 'tel',
    'attributeList' => [
        'type' => 'text',
        'name' => $organizer->name . '-phone',
        'field' => 'phone',
        'autocomplete' => 'off'
    ],
    'label' => 'phone'
])
@endfield

@field([
    'id'   => 'organizer-mail',
    'type' => 'email',
    'attributeList' => [
        'type' => 'text',
        'name' => $organizer->name . '-mail',
        'field' => 'email',
        'autocomplete' => 'off'
    ],
    'label' => 'email'
])
@endfield




