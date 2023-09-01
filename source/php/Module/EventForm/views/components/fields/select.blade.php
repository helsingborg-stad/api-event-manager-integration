@php
    $preselected = !empty($field['value']) && is_string($field['value']) ? $field['value'] : false;
    $preselected = !empty($preselected) 
        ? $preselected 
        : (!empty($field['options']) && is_array($field['options'])
        ? array_key_first($field['options']) : '');
        
@endphp

@select([
    'id'   => !empty($field['name']) ? $field['name'] : uniqid(),
    'label' => !empty($field['label']) ? $field['label'] : $field['name'],
    'helperText' => !empty($field['description']) ? $field['description'] : false,
    'required' => !empty($field['required']) ? true : false,
    'preselected' => !empty($preselected) ? true : false,
    'placeholder' => !empty($field['placeholder']) ? $field['placeholder'] : false,
    'options' => !empty($field['options']) ? $field['options'] : [],
    'attributeList' => [
        'data-source' => json_encode($field['dataSource']),
        'name' => $field['name']
    ],
    'multiple' => !empty($field['multiple']) ? true : false,
])
@endselect
