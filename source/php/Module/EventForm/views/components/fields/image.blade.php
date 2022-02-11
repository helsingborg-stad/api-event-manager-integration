@imageinput([
    'classList' => ['unlist'],
    'name' => $field['name'],
    'display' => 'area',
    'multiple' => false,
    'required' => $field['required'],
    'label' => $field['label'] ?? '',
    'helperText' => $field['description'] ?? '',
    'maxFileSize' => $field['maxFileSize'] ?? 0,
    'maxWidth' => $field['maxWidth'] ?? 0,
    'maxHeight' => $field['maxHeight'] ?? 0,
])
@endimageinput