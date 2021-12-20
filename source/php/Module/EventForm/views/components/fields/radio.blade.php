@php ($i = 0)
@foreach($field['options'] as $value => $label)
    @option([
        'type' => 'radio',
        'checked' => $i === 0,
        'attributeList' => [
            'data-id' => $option->id,
            'name' => $field['name'],
            'value' => $value,
        ],
        'classList' => ['u-display--inline-block'],
        'label' => $label
    ])
    @endoption
    @php ($i++)
@endforeach
