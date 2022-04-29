@include('partials.info')
@includeWhen(!empty($contactInfo), 'partials.contacts')
@include('partials.membership-cards')
@include('partials.location')