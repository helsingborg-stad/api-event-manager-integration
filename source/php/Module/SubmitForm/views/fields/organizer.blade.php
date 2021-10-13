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
    
    @option([
        'type' => 'radio',
        'checked' => 'true',
        'attributeList' => [
            'data-id' => 'excisting-organizer',
            'name' => 'organizer-type',
        ],
        'classList' => ['u-display--inline-block'],
        'label' => __('Excisting organizer', 'event-integration')
    ])
    @endoption

    @option([
        'type' => 'radio',
        'attributeList' => [
            'data-id' => 'new-organizer',
            'name' => 'organizer-type',
        ],
        'classList' => ['u-display--inline-block'],
        'label' => __('New organizer', 'Event recurrence rules', 'event-integration')
    ])
    @endoption

    <div id="excisting-organizer" class="form-group">
        @include('fields.organizer.excisting')
    </div>

    <div id="new-organizer" class="form-group">
        @include('fields.organizer.new')    
    </div>

    <input name="{{ $organizer->name }}" id="{{ $organizer->name }}" type="hidden">
    <input name="contact_phone" id="contact_phone" type="hidden">
    <input name="contact_email" id="contact_email" type="hidden">

</div>