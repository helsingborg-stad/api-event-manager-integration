{{-- Tags --}}
<div class="form-group">

    @typography([
        'variant' => 'subtitle'
    ])
        {{ $event_tags->label }}
    @endtypography

    @includeWhen(!$event_tags->hidden_description, 'components.description', [
        'description' => $event_tags->description
    ])

    @select([
        'label' => $event_tags->label,
        'name' => $event_tags->name,
        'id' => $event_tags->name,
        'required' => $event_tags->required,
        'preselected' => false,
        'multiple' => true,
        'options' => [
            'loading'   => __('Loading', 'event-integration') . "...",
        ]
    ])
    @endselect
    
</div>