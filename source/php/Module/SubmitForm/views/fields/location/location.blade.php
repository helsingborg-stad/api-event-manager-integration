{{-- Location --}}
<div class="form-group">
    @typography([
        'variant' => 'subtitle' 
    ])
        {{ $location->label }}
    @endtypography

    @includeWhen(!$location->hidden_description, 'components.description', [
        'description' => $location->description
    ])
    
    @field([
        'id'   => 'location-selector',
        'type' => 'text',
        'attributeList' => [
            'type' => 'text',
            'name' => 'q',
            'autocomplete' => 'off'
        ],
        'label' => $location->label,
        'required' => $location->required,
    ])
    @endfield

    @field([
        'id'   => 'location-selector',
        'type' => 'hidden',
        'classList' => ['u-display--none'],
        'attributeList' => [
            'type' => 'text',
            'name' => $location->name,
            'autocomplete' => 'off'
        ],
        'label' => $location->label,
        'required' => $location->required,
    ])
    @endfield
</div>