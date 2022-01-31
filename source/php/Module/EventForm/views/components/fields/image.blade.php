@imageinput([
    'classList' => ['unlist'],
    'name' => $field['name'],
    'required' => $field['required'] ?? false,
    'aspectRatio' => $field['aspectRatio'],
    'display' => 'area',
    'multiple' => false,
    'label' => 'Choose images...'
])
@endimageinput
