<form name="submit-event" class="submit-event-form js-event-form" enctype="multipart/form-data">
    @foreach($fields as $field)
        @includeFirst(
            [
                'components.fields.' . $field['type'] ?? '', 
                'components.fields._error'
            ], 
            [
                'field' => $field
            ]
        )
    @endforeach

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
