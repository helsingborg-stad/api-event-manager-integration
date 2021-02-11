@php
    $hourId = $hourId ?? uniqid();
    $minuteId = $minuteId ?? uniqid();
    $required = !$required ? $required : true;
@endphp

<div class="o-grid">
    <div class="o-grid-6">
        @field([
            'type' => 'number',
            'required' => $required,
            'attributeList' => [
                'id' => $hourId ,
                'type' => 'number',
                'name' => $hourName,
                'min' => '0',
                'max' => '24',
                
            ],
            'label' => $hourLabel
        ])
        @endfield
    </div>

    <div class="o-grid-6">
        @field([
            'type' => 'number',
            'min' => '0',
            'max' => '59',
            'required' => $required,
            'attributeList' => [
                'id' => $minuteId,
                'type' => 'number',
                'name' => $minuteName,
                'min' => '0',
            'max' => '59',
            ],
            'label' => $minuteLabel
        ])
        @endfield
    </div>
</div>