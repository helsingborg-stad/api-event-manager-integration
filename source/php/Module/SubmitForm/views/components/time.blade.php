@php
    $hourId = $hourId ?? uniqid();
    $minuteId = $minuteId ?? uniqid();

@endphp

<div class="o-grid">
    <div class="o-grid-6">
        @field([
            'type' => 'number',
            'min' => '0',
            'max' => '24',
            'attributeList' => [
                'id' => $hourId ,
                'type' => 'number',
                'name' => $hourName,
                'required' => true,
                
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
            'attributeList' => [
                'id' => $minuteId,
                'type' => 'number',
                'name' => $minuteName,
                'required' => true,
                
            ],
            'label' => $minuteLabel
        ])
        @endfield
    </div>
</div>