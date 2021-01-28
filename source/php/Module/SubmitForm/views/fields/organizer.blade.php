{{-- Organizer --}}
<div class="form-group">
    @typography([
        'variant' => 'subtitle' 
    ])
        {{ $organizer->label }}
    @endtypography

    @includeWhen(!$organizer->hidden_description, 'components.description', [
        'description' => $organizer->description
    ])
    
    @field([
        'id'   => $organizer->name,
        'type' => 'text',
        'attributeList' => [
            'type' => 'text',
            'name' => $organizer->name,
        ],
        'label' => $organizer->label,
        'required' => $organizer->required,
    ])
    @endfield
</div>