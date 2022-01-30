<div class="c-field">
    @include('components.fields.label', ['label' => $field['label']])

    @foreach($field['options'] as $value => $label)
        @option([
            'type' => 'radio',
            'checked' => $loop->index === 0,
            'attributeList' => [
                'data-id' => $option->id,
                'name' => $field['name'],
                'value' => $value,
            ],
            'classList' => ['u-display--inline-block'],
            'label' => $label
        ])
        @endoption
    @endforeach

    @include('components.fields.helper', ['helper' => $field['description']])
</div>