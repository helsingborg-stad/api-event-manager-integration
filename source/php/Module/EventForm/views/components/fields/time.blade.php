@php
    $hourId = $hourId ?? uniqid();
    $minuteId = $minuteId ?? uniqid();
    $required = !$field['required'] ? $field['required'] : true;
@endphp

<div class="o-grid">
    <div class="o-grid-12">
        @field([
            'type' => 'time',
            'required' => $required,
            'attributeList' => [
                'id' => $hourId ,
                'type' => 'time',
                'name' => $field['name'],
                'min' => '0',
                'max' => '24',
            ],
            'label' => $field['label']
        ])
        @endfield
    </div>
</div>
