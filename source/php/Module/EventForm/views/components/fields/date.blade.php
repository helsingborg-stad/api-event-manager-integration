@field([
    'type' => 'datepicker',
    'value' => '',
    'label' => $field['label'],
    'attributeList' => [
        'type' => 'text',
        'name' => $field['name'],
    ],
    'classList' => ['datepicker'],
    'required' => $field['required'],
    'datepicker' => [
        'title'    => $field['label'],
        'required' => $field['required'],
    ]
])
@endfield
