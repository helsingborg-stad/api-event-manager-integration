{{-- Price senior --}}
<div class="form-group">
    
    @typography([
        'variant' => 'subtitle' 
    ])
        {{ $price_senior->label }}
        @includeWhen($price_senior->required, 'components.required')
    @endtypography

    @includeWhen(!$price_senior->hidden_description, 'components.description', [
        'description' => $price_senior->description
    ])

    @field([
        'id'   => $price_senior->name,
        'type' => 'number',
        'attributeList' => [
            'type' => 'number',
            'name' => $price_senior->name,
        ],
        'label' => $price_senior->label,
        'required' => $price_senior->required,
    ])
    @endfield
</div>
