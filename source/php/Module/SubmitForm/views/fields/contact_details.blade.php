{{-- Contact Details --}}
@if(!$submitter_email->hidden || !$submitter_phone->hidden)
    @typography([
        'variant' => 'subtitle' 
    ])
        {{ __('Contact details', 'event-integration') }}
    @endtypography

    @typography([
        'variant' => 'caption' 
    ])
        {{ __('Enter your contact details below for eventual questions.', 'event-integration') }}
    @endtypography
@endif

{{-- Email --}}
@if(!$submitter_email->hidden)
    <div class="form-group u-margin__bottom--2 u-margin__top--2">

        @includeWhen(!$submitter_email->hidden_description, 'components.description', [
            'description' => $submitter_email->description
        ])

        @field([
            'id' => 'submitter_email',
            'type' => 'text',
            'attributeList' => [
                'type' => 'email',
                'name' => $submitter_email->name,
                'pattern' => '^[^@]+@[^@]+\.[^@]+$',
                'autocomplete' => 'e-mail',
            ],
            'label' => $submitter_email->label,
            'required' => $submitter_email->required,
        ])
        @endfield

    </div>

    <div class="form-group u-margin__bottom--2">

        @field([
            'id' => 'submitter_repeat_email',
            'type' => 'text',
            'attributeList' => [
                'type' => 'email',
                'name' => $submitter_email->name,
                'pattern' => '^[^@]+@[^@]+\.[^@]+$',
                'autocomplete' => 'e-mail',
            ],
            'label' => __('Repeat email', 'event-integration'),
            'required' => $submitter_email->required,
        ])
        @endfield

    </div>

@endif

{{-- Phone --}}
@if(!$submitter_phone->hidden)
    <div class="form-group u-margin__bottom--2">

        @includeWhen(!$submitter_phone->hidden_description, 'components.description', [
            'description' => $submitter_phone->description
        ])

        @field([
            'type' => 'number',
            'attributeList' => [
                'type' => 'number',
                'name' => $submitter_phone->name,
                'pattern' => '^[^@]+@[^@]+\.[^@]+$',
                'autocomplete' => 'e-mail',
            ],
            'label' => __('Repeat email', 'event-integration'),
            'required' => $submitter_phone->required,
        ])
        @endfield
    </div>
@endif