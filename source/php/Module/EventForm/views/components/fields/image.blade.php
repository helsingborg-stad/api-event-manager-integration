@imageinput([
    'classList' => ['unlist'],
    'name' => $field['name'],
    'required' => $field['required'] ?? false,
    'display' => 'area',
    'multiple' => false,
    'label' => 'Choose images...'
])
@endimageinput
