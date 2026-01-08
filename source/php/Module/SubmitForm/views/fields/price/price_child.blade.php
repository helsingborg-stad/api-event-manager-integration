{{-- Price children --}}
<div class="form-group">
    @typography([
        'variant' => 'subtitle' 
    ])
        {{ $price_children->label }}
        @includeWhen($price_children->required, 'components.required')
    @endtypography

    @includeWhen(!$price_children->hidden_description, 'components.description', [
        'description' => $price_children->description
    ])

    @field([
        'id'   => $price_children->name,
        'type' => 'number',
        'attributeList' => [
            'type' => 'number',
            'name' => $price_children->name,
        ],
        'label' => $price_children->label,
        'required' => $price_children->required,
    ])
    @endfield
</div>
