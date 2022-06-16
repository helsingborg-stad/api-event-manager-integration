<div id="{{ $field['name'] }}" class="js-repeater">
    <div class="sub-fields">
        @include('partials.field-loop', ['fields' => $field['fields']])
    </div>
    @button([
        'text' => $field['labels']['addButton'],
        'color' => 'primary',
        'style' => 'filled',
        'classList' => ['btn-repeater-add']
    ])
    @endbutton
    @button([
        'text' => $field['labels']['removeButton'],
        'color' => 'default',
        'style' => 'filled',
        'classList' => ['btn-repeater-remove', 'u-display--none']
    ])
    @endbutton
</div>
