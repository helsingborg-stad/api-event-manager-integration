{{-- Categories --}}
<div class="form-group">

    @typography([
        'variant' => 'subtitle'
    ])
        {{ $event_categories->label }}
        @includeWhen($event_categories->required, 'components.required')
    @endtypography

    @includeWhen(!$event_categories->hidden_description, 'components.description', [
        'description' => $event_categories->description
    ])

    @select([
        'label' => $event_categories->label,
        'name' => $event_categories->name,
        'id' => $event_categories->name,
        'required' => $event_categories->required,
        'preselected' => false,
        'multiple' => true,
        'options' => [
            'loading'   => __('Loading', 'event-integration') . "...",
        ]
    ])
    @endselect

</div>
