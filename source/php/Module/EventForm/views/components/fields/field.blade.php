@field(array_merge([
    'id'   => $field['name'],
    'type' => $field['type'],
    'attributeList' => [
        'type' => $field['type'],
        'name' => $field['name'],
    ],
    'label' => $field['label'],
    'required' => $field['required'],
    'helperText' => $field['description'] ?? '',
], (array )$field['props'] ?? []))
@endfield