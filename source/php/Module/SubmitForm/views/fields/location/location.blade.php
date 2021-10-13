{{-- Location --}}
<div class="form-group">
    @typography([
        'variant' => 'subtitle' 
    ])
        {{ $location->label }}
        @includeWhen($location->required, 'components.required')
    @endtypography

    @includeWhen(!$location->hidden_description, 'components.description', [
        'description' => $location->description
    ])

    @option([
        'type' => 'radio',
        'checked' => 'true',
        'attributeList' => [
            'data-id' => 'excisting-location',
            'name' => 'location-type',
        ],
        'classList' => ['u-display--inline-block'],
        'label' => __('Excisting location', 'event-integration')
    ])
    @endoption

    @option([
        'type' => 'radio',
        'attributeList' => [
            'data-id' => 'new-location',
            'name' => 'location-type',
        ],
        'classList' => ['u-display--inline-block'],
        'label' => __('New location', 'Event recurrence rules', 'event-integration')
    ])
    @endoption
    
    <div id="excisting-location" class="form-group">
        @include('fields.location.excisting')
    </div>

    <div id="new-location" class="form-group">
        @include('fields.location.new')    
    </div>
    
    <input name="{{ $location->name }}" id="{{ $location->name }}" type="hidden">

</div>