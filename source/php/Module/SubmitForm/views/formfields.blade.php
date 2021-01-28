<form name="submit-event" class="submit-event" enctype="multipart/form-data">

    @includeWhen(!empty($user_groups), 'fields.meta.user_groups')

    @includeWhen(!empty($client_name), 'fields.meta.client_name')

    @includeWhen(!$title->hidden, 'fields.title')

    @includeWhen(!$content->hidden, 'fields.content')

    @includeWhen(!$occasions->hidden, 'fields.occasion')

    @includeWhen(!$event_link->hidden, 'fields.event_link')

    @includeWhen(!$booking_link->hidden, 'fields.booking_link')

    @includeWhen(!$price_adult->hidden, 'fields.price.price_adult')

    @includeWhen(!$price_student->hidden, 'fields.price.price_student')

    @includeWhen(!$price_children->hidden, 'fields.price.price_child')

    @includeWhen(!$children_age->hidden, 'fields.price.children_age')

    @includeWhen(!$price_senior->hidden, 'fields.price.price_senior')

    @includeWhen(!$senior_age->hidden, 'fields.price.senior_age')

    @includeWhen(!$age_group->hidden, 'fields.age_group')

    @includeWhen(!$organizer->hidden, 'fields.organizer')

    @includeWhen(!$location->hidden, 'fields.location.location')

    @includeWhen(!$accessibility->hidden, 'fields.location.accessibility')

    @includeWhen(!$event_categories->hidden, 'fields.event_categories')

    @includeWhen(!$tags->hidden, 'fields.event_tags')

    @includeWhen(!$image->hidden, 'fields.image')

    @includeWhen(
        (!$submitter_email->hidden || !$submitter_phone->hidden),
        'fields.contact_details'
    )

    @include('components.notice_warning')
    @include('components.notice_success')

    {{-- Submit Button --}}
    @typography([
        "element" => "p",
        "variant" => "meta"
    ])
        {{ __('Done? Click here to submit your event for review.', 'event-integration') }}
    @endtypography

    @button([
        'text' => __('Send', 'event-integration'),
        'color' => 'primary',
        'style' => 'filled',
        'type' => 'submit'
    ])
    @endbutton
</form>
