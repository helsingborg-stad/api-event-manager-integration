{{-- Booking link --}}
<div class="form-group">
    @typography([
        'variant' => 'subtitle' 
    ])
        {{ $booking_link->label }}
    @endtypography

    @includeWhen(!$booking_link->hidden_description, 'components.description', [
        'description' => $booking_link->description
    ])

    @field([
        'id'   => $booking_link->name,
        'type' => 'text',
        'attributeList' => [
            'type' => 'text',
            'name' => $booking_link->name,
        ],
        'label' => $booking_link->label,
        'required' => $booking_link->required,
    ])
    @endfield
</div>