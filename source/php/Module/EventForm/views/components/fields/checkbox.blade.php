<div class="c-field">
    @include('components.fields.label', ['label' => $field['label']])

    @foreach($field['options'] as $value => $label)
        @option([
            'type' => 'checkbox',
            'checked' => false,
            'value' => $value,
            'name' => $field['name'],
            'attributeList' => [
                'data-id' => !empty($option->id) ? $option->id : uniqid()
            ],
            'classList' => ['u-display--inline-block'],
            'label' => $label,
            'required' => !empty($field['required']) ? true : false,
        ])
        @endoption
    @endforeach

    @include('components.fields.helper', ['helper' => !empty($field['description']) ? $field['description'] : false])
</div>
