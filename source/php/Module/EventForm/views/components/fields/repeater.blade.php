<div class="repeater">
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
