@include('partials.info')
@include('partials.membership-cards')
@include('partials.additional-ticket-types')
@include('partials.location')
@include('partials.organizer')
{{-- @include('partials.date') --}}
@includeWhen(!empty($contactInfo), 'partials.contacts')
