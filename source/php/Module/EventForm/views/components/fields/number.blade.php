@php
    $attributeList = [
        'placeholder' => $field['placeholder'] ?? '',
    ];
    if (!empty($field['min'])) {
        $attributeList['min'] = $field['min'];
    } 

    if (!empty($field['max'])) {
        $attributeList['max'] = $field['max'];
    }
@endphp
@include('components.fields.field', ['field' => array_merge($field, ['props' => [
            'attributeList' => $attributeList,
            'type' => $field['type'],
            'name' => $field['name'],
        ]
    ]),
])
