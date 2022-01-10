<div {!! $field->type->props['id'] ? 'id="' . $field->type->props['id'] . '"' : '' !!} class="{{$field->type->props['classList']}}">
    <div class="field-group">
        @foreach($field->type->props['fields'] as $subField)
            <div class="form-group box">
                @typography([
                    'variant' => 'subtitle'
                ])
                    {{ $subField->label }}
                    @includeWhen($subField->required, 'components.required')
                @endtypography

                @includeWhen(!$subField->hidden_description, 'components.description', [
                    'description' => $subField->description
                ])

                @if(isset($subField->type))
                    @includeWhen(!$subField->hidden, 'components.fields.' . $subField->type->component, ['field' => $subField])
                @else
                    <span>{{$subField->label}}</span>
                @endif
            </div>
        @endforeach
    </div>
</div>
