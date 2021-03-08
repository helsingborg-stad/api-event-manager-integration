{{-- Organizer --}}
<div class="form-group">
    @typography([
        'variant' => 'subtitle' 
    ])
        {{ $organizer->label }}
        @includeWhen($organizer->required, 'components.required')
    @endtypography

    @includeWhen(!$organizer->hidden_description, 'components.description', [
        'description' => $organizer->description
    ])
    
    @field([
        'id'   => 'organizer-selector',
        'type' => 'text',
        'attributeList' => [
            'type' => 'text',
            'name' => $organizer->name,
            'autocomplete' => 'off'
        ],
        'label' => $organizer->label,
        'required' => $organizer->required,
    ])
    @endfield

    <input name="{{ $organizer->name }}" id="{{ $organizer->name }}" type="hidden">
    <input name="contact_phone" id="contact_phone" type="hidden">
    <input name="contact_email" id="contact_email" type="hidden">

</div>