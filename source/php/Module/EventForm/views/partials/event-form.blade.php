    @form([
        'errorMessage' => $lang['errorMessage'],
        'validateMessage' => $lang['validateMessage'],
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
@endform


