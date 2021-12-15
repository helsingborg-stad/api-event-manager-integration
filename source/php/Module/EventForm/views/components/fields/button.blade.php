@button([
    'text' => $field->type->props['text'] ?? '', //__('Add', 'event-integration'),
    'color' => $field->type->props['color'] ?? 'primary',
    'style' => 'filled',
    'classList' => $field->type->props['classList'] ?? []
])
@endbutton
