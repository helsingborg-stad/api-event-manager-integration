{{-- Content --}}
<div class="form-group">

    @typography([
        'variant' => 'subtitle' 
    ])
        {{ $content->label }}
        @includeWhen($content->required, 'components.required')
    @endtypography

    @if(!$content->hidden_description)
        <small class="text-dark-gray">{!! $content->description !!}</small>
    @endif

    @textarea([
        'id'   => $content->name,
        'type'          => 'text',
        'label'         => $content->label,
        'required'      =>  $content->required,
        'rows'          => '5',
        'attributeList' => [
            'type' => 'textarea',
            'name' => $content->name,
        ],
        
    ])
    @endtextarea
</div>
