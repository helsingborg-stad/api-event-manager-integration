{{-- Price student --}}
<div class="form-group">
    @typography([
        'variant' => 'subtitle' 
    ])
        {{ $price_student->label }}
        @includeWhen($price_student->required, 'components.required')
    @endtypography

    @includeWhen(!$price_student->hidden_description, 'components.description', [
        'description' => $price_student->description
    ])

    @field([
        'id'   => $price_student->name,
        'type' => 'number',
        'attributeList' => [
            'type' => 'number',
            'name' => $price_student->name,
        ],
        'label' => $price_student->label,
        'required' => $price_student->required,
    ])
    @endfield
</div>
