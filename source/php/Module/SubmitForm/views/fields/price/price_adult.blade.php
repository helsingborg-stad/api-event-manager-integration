{{-- Price adult --}}
<div class="form-group">
    @typography([
        'variant' => 'subtitle' 
    ])
        {{ $price_adult->label }}
    @endtypography

    @includeWhen(!$price_adult->hidden_description, 'components.description', [
        'description' => $price_adult->description
    ])

    @field([
        'id'   => $price_adult->name,
        'type' => 'number',
        'attributeList' => [
            'type' => 'number',
            'name' => $price_adult->name,
        ],
        'label' => $price_adult->label,
        'required' => $price_adult->required,
    ])
    @endfield
</div>