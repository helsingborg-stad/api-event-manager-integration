@php
$addButtonLabel = __('Add', 'event-integration');
if (!empty($field['labels']) && !empty($field['labels']['addButton'])) {
    $addButtonLabel = $field['labels']['addButton'];
}
$removeButtonLabel = __('Remove', 'event-integration');
if (!empty($field['labels']) && !empty($field['labels']['removeButton'])) {
    $removeButtonLabel = $field['labels']['removeButton'];
}
@endphp
<div id="{{ $field['name'] }}" class="js-repeater">
    <div class="sub-fields">
        @foreach($field['subFields'] as $subField)
            <div @if(!empty($subField['condition']))data-condition="{{ json_encode($subField['condition'] ?? []) }}"@endif>
                @includeFirst(
                    [
                        'components.fields.' . $subField['type'] ?? '',
                        'components.fields._error'
                    ],
                    [
                        'field' => $subField
                    ]
                )
            </div>
        @endforeach
    </div>
    @button([
        'text' => $addButtonLabel,
        'color' => 'primary',
        'style' => 'filled',
        'classList' => ['btn-repeater-add']
    ])
    @endbutton
    @button([
        'text' => $removeButtonLabel,
        'color' => 'default',
        'style' => 'filled',
        'classList' => ['btn-repeater-remove', 'u-display--none']
    ])
    @endbutton
</div>
