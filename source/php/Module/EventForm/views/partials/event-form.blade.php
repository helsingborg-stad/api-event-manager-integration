<form name="submit-event" class="submit-event" enctype="multipart/form-data">
    @foreach($fields as $field)
        <div>
            <span>
                {{$field->label}}
            </span>
        </div>
    @endforeach

    @button([
        'text'              => __('Send', 'event-integration'),
        'color'             => 'primary',
        'style'             => 'filled',
        'type'              => 'submit',
        'attributeList'    => [
            'event-submit__submit-button' => ''
        ]
    ])
    @endbutton
</form>