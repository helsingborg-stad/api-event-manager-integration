{{-- Age group --}}
<div class="form-group form-horizontal">

    @typography([
        'variant' => 'subtitle' 
    ])
        {{ $age_group->label }}
        @includeWhen($age_group->required, 'components.required')
    @endtypography

    @includeWhen(!$age_group->hidden_description, 'components.description', [
        'description' => $age_group->description
    ])

    <div class="form-group u-margin__bottom--2">
        @field([
            'type' => 'number',
            'attributeList' => [
                'type' => 'number',
                'name' => 'age_group_from',
                'required' => $age_group->required ,
            ],
            'label' => __('From', 'event-integration')
        ])
        @endfield
    </div>

    <div class="form-group">
        @field([
            'type' => 'number',
            'attributeList' => [
                'type' => 'number',
                'name' => 'age_group_to',
                'required' => $age_group->required ,
            ],
            'label' => __('To', 'event-integration')
        ])
        @endfield
    </div>
</div>
