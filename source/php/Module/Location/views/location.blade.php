<div class="{{ $classes }} {{ isset($font_size) ? $font_size : '' }}">
    @if (!$hideTitle && !empty($post_title))
    <h4 class="box-title">{!! apply_filters('the_title', $post_title) !!}</h4>
    @endif
    <div class="box-content">
    	@if($address)
	    	<ul>
			    @if (isset($location->title->rendered) && !empty($location->title->rendered))
			    	<li><strong>{{ $location->title->rendered }}</strong></li>
			    @endif
			    @if (isset($location->street_address) && !empty($location->street_address))
			    	<li><span>{{ $location->street_address }}</span></li>
			    @endif
			    @if (isset($location->postal_code) && !empty($location->postal_code) && isset($location->city) && !empty($location->city))
			    	<li><span>{{ $location->postal_code }} {{ $location->city }}</span></li>
			    @endif
			   	@if (isset($location->latitude) && !empty($location->latitude) && isset($location->longitude) && !empty($location->longitude))
			    	<li><a class="link-item" href="https://www.google.com/maps/place/{{ $location->latitude }},{{ $location->longitude }}" target="_blank"><span><?php _e('Show map', 'event-integration'); ?></span></a></li>
			    @endif
			</ul>
		@endif
		@if($open_hours)
			<ul>
			   	@if (isset($location->open_hours) && !empty($location->open_hours))
					@foreach($location->open_hours as $open_hour)
						<li>
							<span>
							<strong>{{ ucfirst(mysql2date('l', $open_hour->weekday, true)) }}</strong>
							@if(isset($open_hour->closed) && $open_hour->closed == true)
								<?php _e('Closed', 'event-integration'); ?>
							@elseif(isset($open_hour->opening) && isset($open_hour->closing))
								{{ $open_hour->opening }} - {{ $open_hour->closing }}
							@endif
							</span>
						</li>
					@endforeach
			    @endif
				@if (isset($location->open_hour_exceptions) && !empty($location->open_hour_exceptions))
					@foreach($location->open_hour_exceptions as $exception)
						@if(isset($exception->exception_date) && !empty($exception->exception_date) && isset($exception->exeption_information) && !empty($exception->exeption_information))
							<li class="gutter gutter-vertical gutter-top">
								<span><strong>{{ mysql2date('j F Y', $exception->exception_date, true) }}</strong>
								{{ $exception->exeption_information }}
								</span>
							</li>
						@endif
					@endforeach
				@endif
		    </ul>
		@endif
		@if($organizers)
		    <ul>
				@if(isset($location->_embedded->organizers) && !empty($location->_embedded->organizers))
					@foreach($location->_embedded->organizers as $organizer)
						@if(isset($organizer->title->plain_text))
							<li class="card-title"><strong>{{ $organizer->title->plain_text }}</strong></li>
						@endif
						@if(isset($organizer->phone) && !empty($organizer->phone))
							<li><a class="link-item" href="tel:+{{ preg_replace('/[^0-9]/', '', $organizer->phone) }}">{{ $organizer->phone }}</a></li>
						@endif
						@if(isset($organizer->email) && !empty($organizer->email))
							<li><a class="link-item" href="mailto:{{ $organizer->email }}">{{ $organizer->email }}</a></li>
						@endif
						@if(isset($organizer->website) && !empty($organizer->website))
							<li><a class="link-item" href="{{ $organizer->website }}" target="_blank"><?php _e('Website', 'event-integration'); ?></a></li>
						@endif
					@endforeach
				@endif
		    </ul>
		@endif
		@if($prices)
			<ul>
				<li><strong>{{ __('Prices', 'event-integration') }}</strong></li>
				@if(isset($location->price_adult) && !empty($location->price_adult))
					<li><span>{{ __('Adult', 'event-integration') }}: {{ $location->price_adult }} kr</span></li>
				@endif
				@if(isset($location->price_children) && !empty($location->price_children))
					@if(isset($location->children_age) && !empty($location->children_age))
						<li><span>{{ __('Children', 'event-integration') }} ({{ __('below', 'event-integration') . ' ' . $location->children_age }}): {{ $location->price_children }} kr</span></li>
					@else
						<li><span>{{ __('Children', 'event-integration') }}: {{ $location->price_children }} kr</span></li>
					@endif
				@endif
				@if(isset($location->price_student) && !empty($location->price_student))
					<li><span>{{ __('Student', 'event-integration') }}: {{ $location->price_student }} kr</span></li>
				@endif
				@if(isset($location->price_senior) && !empty($location->price_senior))
					@if(isset($location->senior_age) && !empty($location->senior_age))
						<li><span>{{ __('Senior', 'event-integration') }} ({{ __('above', 'event-integration') . ' ' . $location->senior_age }}): {{ $location->price_senior }} kr</span></li>
					@else
						<li><span>{{ __('Senior', 'event-integration') }}: {{ $location->price_senior }} kr</span></li>
					@endif
				@endif
				@if(isset($location->age_restriction) && !empty($location->age_restriction))
					<li><span>{{ __('Age restriction', 'event-integration') }}: {{ $location->age_restriction }} {{ __('years', 'event-integration') }}</span></li>
				@endif
				@if(isset($location->price_information) && !empty($location->price_information))
					<li class="gutter gutter-vertical"><span>{{ $location->price_information }}</span></li>
				@endif
				@if(isset($location->_embedded->membership_cards) && !empty($location->_embedded->membership_cards))
					<li><strong>{{ __('Included in membership cards', 'event-integration') }}</strong></li>
					@foreach($location->_embedded->membership_cards as $card)
						<li><span>{{ $card->title->plain_text }}</span></li>
					@endforeach
				@endif

			</ul>
		@endif
		@if($links)
			<ul>
				@if(isset($location->links) && !empty($location->links))
					@foreach($location->links as $link)
						<li><a class="link-item" href="{{ $link->url }}" target="_blank">{{ ucfirst($link->service) }}</a></li>
					@endforeach
				@endif
			</ul>
		@endif
    </div>
</div>
