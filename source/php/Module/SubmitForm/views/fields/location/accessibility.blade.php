{{-- Accessibility --}}
<div class="form-group">
    @typography([
        'variant' => 'subtitle' 
    ])
        {{ $accessibility->label }}
        @includeWhen($accessibility->required, 'components.required')
    @endtypography
    
    @includeWhen(!$accessibility->hidden_description, 'components.description', [
        'description' => $accessibility->description
    ])

    @option([
        'type' => 'checkbox',
        'value' => 'elevator',
        'attributeList' => [
            'name' => $accessibility->name
        ],
        'label' => $translations['elevatorRamp']
    ])
    @endoption

    @option([
        'type' => 'checkbox',
        'value' => 'accessible_toilet',
        'attributeList' => [
            'name' => $accessibility->name,
        ],
        'label' => $translations['accessibleToilet']
    ])
    @endoption
</div>