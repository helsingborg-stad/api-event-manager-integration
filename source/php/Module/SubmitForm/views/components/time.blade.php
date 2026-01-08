@php
    $hourId = $hourId ?? uniqid();
    $minuteId = $minuteId ?? uniqid();
    $required = !$required ? $required : true;
@endphp

<div class="o-grid">
    <div class="o-grid-12">
        @field([
            'type' => 'time',
            'required' => $required,
            'attributeList' => [
                'id' => $hourId ,
                'type' => 'time',
                'name' => $name,
                'min' => '0',
                'max' => '24',
                
            ],
            'label' => $label
        ])
        @endfield
    </div>
</div>
