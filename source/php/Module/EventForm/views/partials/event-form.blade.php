<form name="submit-event" class="submit-event" enctype="multipart/form-data">
    @foreach($fields as $fieldGroup)
        @if(isset($fieldGroup->fields) && is_array($fieldGroup->fields))
            @typography([
                'variant' => 'title'
            ])
                {{ $fieldGroup->label }}
            @endtypography

            @foreach($fieldGroup->fields as $field)
                <div class="form-group">
                    @typography([
                    'variant' => 'subtitle'
                    ])
                        {{ $field->label }}
                        @includeWhen($field->required, 'components.required')
                    @endtypography

                    @includeWhen(!$field->hidden_description, 'components.description', [
                        'description' => $field->description
                    ])

                    @if(isset($field->type))
                        @includeWhen(!$field->hidden, 'components.fields.' . $field->type->component)
                    @else
                        <span>
                            {{$field->label}}
                        </span>
                    @endif
                </div>
            @endforeach
        @else
            <div>
                <span>not implemented</span>
            </div>
        @endif
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
