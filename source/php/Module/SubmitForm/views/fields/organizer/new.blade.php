@field([
    'id'   => 'organizer-title',
    'type' => 'text',
    'attributeList' => [
        'type' => 'text',
        'name' => $organizer->name . '-name',
        'field' => 'title',
        'autocomplete' => 'off'
    ],
    'label' => __('Name', 'event-integration')
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
    'label' => __('Phone', 'event-integration')
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
    'label' => __('Email', 'event-integration')
])
@endfield




