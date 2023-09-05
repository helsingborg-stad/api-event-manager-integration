    @form([
        'classList' => [
            "submit-event-form",
            "js-event-form",
            "js-form-validation"
        ],
        'attributeList' => [
            'name' => 'submit-event',
            'enctype' => 'multipart/form-data',
        ],

    ])
    @include('partials.field-loop', ['fields' => $fields])

    @includeWhen($userGroups, 'partials.user_group')

    @button([
        'text' => $lang['submitButtonText'],
        'color' => 'primary',
        'style' => 'filled',
        'type' => 'submit',
        'classList' => ['event-submit__submit-button'],
    ])
    @endbutton

    @include('components.form-notices')
    
    @button([
        'text' => $lang['reloadButtonText'],
        'color' => 'default',
        'style' => 'filled',
        'type' => 'submit',
        'classList' => ['event-reload__button', 'u-display--none'],
    ])
    @endbutton


@endform


