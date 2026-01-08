{{-- Senior age --}}
<div class="form-group">
    @typography([
        'variant' => 'subtitle' 
    ])
        {{ $senior_age->label }}
        @includeWhen($senior_age->required, 'components.required')
    @endtypography

    @includeWhen(!$senior_age->hidden_description, 'components.description', [
        'description' => $senior_age->description
    ])

    @field([
        'id'   => $senior_age->name,
        'type' => 'number',
        'attributeList' => [
            'type' => 'number',
            'name' => $senior_age->name,
        ],
        'label' => $senior_age->label,
        'required' => $senior_age->required,
    ])
    @endfield
</div>
