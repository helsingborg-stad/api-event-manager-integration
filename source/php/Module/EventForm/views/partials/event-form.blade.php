<form name="submit-event" class="submit-event-form js-event-form" enctype="multipart/form-data">
    @foreach($fields as $field)
        <div @if(!empty($field['condition']))data-condition="{{ json_encode($field['condition'] ?? []) }}"@endif>
            @includeFirst(
                [
                    'components.fields.' . $field['type'] ?? '',
                    'components.fields._error'
                ],
                [
                    'field' => $field
                ]
            )
        </div>
    @endforeach

    @include('components.notice_warning')
    @include('components.notice_success')

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