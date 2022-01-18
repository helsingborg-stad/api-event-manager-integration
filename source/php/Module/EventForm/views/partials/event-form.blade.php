<form name="submit-event" class="submit-event-form js-event-form" enctype="multipart/form-data">
    @include('partials.field-loop', ['fields' => $fields])

    @button([
        'text' => __('Send', 'event-integration'),
        'color' => 'primary',
        'style' => 'filled',
        'type' => 'submit',
        'attributeList' => [
            'event-submit__submit-button' => ''
        ]
    ])
    @endbutton
</form>