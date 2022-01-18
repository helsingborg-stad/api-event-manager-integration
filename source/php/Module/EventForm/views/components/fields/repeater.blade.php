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
<div class="js-repeater">
    <div class="sub-fields">
        @include('partials.field-loop', ['fields' => $field['subFields']])
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
