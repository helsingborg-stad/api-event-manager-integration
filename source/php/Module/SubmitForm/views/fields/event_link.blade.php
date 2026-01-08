{{-- Event link --}}
<div class="form-group">
    @typography([
        'variant' => 'subtitle' 
    ])
        {{ $event_link->label }}
        @includeWhen($event_link->required, 'components.required')
    @endtypography

    @includeWhen(!$event_link->hidden_description, 'components.description', [
        'description' => $event_link->description
    ])

    @field([
        'id'   => $event_link->name,
        'type' => 'text',
        'attributeList' => [
            'type' => 'text',
            'name' => $event_link->name,
        ],
        'label' => $event_link->label,
        'required' => $event_link->required,
    ])
    @endfield
</div>
