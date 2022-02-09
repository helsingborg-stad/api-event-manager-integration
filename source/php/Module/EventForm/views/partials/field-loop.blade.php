<div class="o-grid o-grid--form">
    @foreach($fields as $field)
        @php
            $colSpan = $field['span'] ?? 12;
        @endphp
        <div class="o-grid-12 o-grid-{{$colSpan}}@sm" @if(!empty($field['condition']))data-condition="{{ json_encode($field['condition'] ?? []) }}"@endif>
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
</div>