<div class="c-field">
    @if(!empty($field['label']))
        <div class="c-field__label">
            {!! $field['label'] !!}
        </div>
    @endif
    
    @imageinput([
        'classList' => ['unlist'],
        'name' => $field['name'],
        'display' => 'area',
        'multiple' => false,
        'label' => 'Choose images...'
    ])
    @endimageinput

    @if(!empty($field['description']))
        <div class="c-field__helper">
            {!! $field['description'] !!}
        </div>
    @endif
</div>
