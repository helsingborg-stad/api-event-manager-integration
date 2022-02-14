<form name="submit-event" class="submit-event-form js-event-form js-form-validation" enctype="multipart/form-data">
    @include('partials.field-loop', ['fields' => $fields])

    @include('components.notice_warning')
    @include('components.notice_success')

    @button([
        'text' => __('Send', 'event-integration'),
        'color' => 'primary',
        'style' => 'filled',
        'type' => 'submit',
        'classList' => ['event-submit__submit-button'],
    ])
    @endbutton
</form>