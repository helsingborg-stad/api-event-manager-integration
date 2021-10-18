{{-- Title --}}
<div class="form-group">
    @typography([
        'variant' => 'subtitle' 
    ])
        {{ $title->label }}
        @includeWhen($title->required, 'components.required')
    @endtypography

    @includeWhen(!$title->hidden_description, 'components.description', [
        'description' => $title->description
    ])

    @field([
        'id'   => $title->name,
        'type' => 'text',
        'attributeList' => [
            'type' => 'text',
            'name' => $title->name,
        ],
        'required' => $title->required,
    ])
    @endfield
</div>