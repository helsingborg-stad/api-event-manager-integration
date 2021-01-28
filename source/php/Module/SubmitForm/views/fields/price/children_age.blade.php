{{-- Children age --}}
<div class="form-group">
    @typography([
        'variant' => 'subtitle' 
    ])
        {{ $children_age->label }}
    @endtypography

    @includeWhen(!$children_age->hidden_description, 'components.description', [
        'description' => $children_age->description
    ])

    @field([
        'id'   => $children_age->name,
        'type' => 'number',
        'attributeList' => [
            'type' => 'number',
            'name' => $children_age->name,
        ],
        'label' => $children_age->label,
        'required' => $children_age->required,
    ])
    @endfield
</div>