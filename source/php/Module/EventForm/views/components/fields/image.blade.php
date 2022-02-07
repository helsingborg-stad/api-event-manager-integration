<div class="c-field">
    @include('components.fields.label', ['label' => $field['label']])

    @imageinput([
        'classList' => ['unlist'],
        'name' => $field['name'],
        'display' => 'area',
        'multiple' => false,
        'label' => $field['label'] ?? '',
        'helperText' => $field['description'] ?? '',
        'maxFileSize' => $field['maxFileSize'] ?? 0,
        'maxWidth' => $field['maxWidth'] ?? 0,
        'maxHeight' => $field['maxHeight'] ?? 0,
    ])
    @endimageinput

    @include('components.fields.helper', ['helper' => $field['description']])
</div>
