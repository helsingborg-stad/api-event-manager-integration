{{-- Image --}}
@typography([
    'variant' => 'subtitle' 
])
    {{ $image_input->label }}
    @includeWhen($image->required, 'components.required')
@endtypography

<div class="form-group image-box">

    @includeWhen(!$image_input->hidden_description, 'components.description', [
        'description' => $image_input->description
    ])
    
    @button([
        'text'  => $image_input->label,
        'color' => 'primary',
        'style' => 'filled',
        'classList' => [
            'img-button'
        ]
    ])
    @endbutton

</div>

<div class="form-group gutter creamy image-approve" style="display:none;">

    @typography([
        'variant' => 'lead' 
    ])
        {{ _e('Before you can upload an image, you need to confirm the following terms', 'event-integration') }}
    @endtypography

    @include('components.option', [
        'id' => 'first-approve', 'event-integration',
        'label' => __('I have the right to use this image to promote this event.', 'event-integration')
    ])

    @typography([
        'variant' => 'lead' 
    ])
        {{ _e('Are there identifiable persons on the image/images?', 'event-integration') }}
    @endtypography

    @option([
        'type' => 'radio',
        'value' => '1',
        'attributeList' => [
            'name' => 'approve',
        ],
        'label' => __('Yes')
    ])
    @endoption

    @option([
        'type' => 'radio',
        'value' => '0',
        'attributeList' => [
            'name' => 'approve',
        ],
        'label' => __('No')
    ])
    @endoption

    @include('components.option', [
        'uid' => 'persons-approve',
        'id' => 'second-approve',
        'name' => 'approve',
        'label' => __('They have accepted that the image is used to promote this event and have been informed that after the image has been added to the database, it may appear in different channels to promote the event.', 'event-integration')
    ])

</div>

<div class="form-group image-upload" style="display:none;">
    @fileinput([
        'id' => $image_input->name,
        'name' => $image_input->name,
        'display' => 'area',
        'label' => __('Upload an image', 'event-integration'),
        'accept' => "image/gif, image/jpeg, image/png",
        'attributeList' => [
            'required' => 'required'
        ]

    ])
    @endfileinput
</div>