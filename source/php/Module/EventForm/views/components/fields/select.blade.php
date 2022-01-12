@php
    $preselected = !empty($field['value']) && is_string($field['value']) ? $field['value'] : false;
    $preselected = !empty($preselected) 
        ? $preselected 
        : is_array($field['options']) && !empty($field['options']) 
        ? array_key_first($field['options']) 
        : ''
@endphp

@select([
    'label' => $field['label'],
    'required' => $field['required'] ?? false,
    'preselected' => $preselected,
    'options' => $field['options'],
    'attributeList' => [
        'data-source' => htmlspecialchars(json_encode($field['dataSource']), ENT_QUOTES, 'UTF-8')
    ],
    'multiple' => $field['multiple'] ?? false,
])
@endselect
