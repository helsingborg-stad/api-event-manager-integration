
<div class="c-field">
    @include('components.fields.label', ['label' => $field['label']])

    @imageinput([
        'classList' => ['unlist'],
        'name' => $field['name'],
        'display' => 'area',
        'multiple' => false,
        'label' => $field['label'] ?? '',
        'helperText' => $field['description'] ?? '',
    ])
    @endimageinput

    @include('components.fields.helper', ['helper' => $field['description']])
</div>
