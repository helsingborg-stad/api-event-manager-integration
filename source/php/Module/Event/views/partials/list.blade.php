
		@if (!$hideTitle && !empty($post_title))   
			@typography(['variant' => 'h4', 'element' => 'h4', 'classList' => ['box-title']])
				{{_e($post_title, 'event-integration')}}
			@endtypography
		@endif

	<ul class="event-module-list">

			@if (!$events)
				<li><span class="event-info">{{$no_events}}</span></li>
			@else
			
			@foreach ($events as $event)

				{!! (isset($event->end_date) && (strtotime($event->end_date) < $date_now)) ? '<li class="passed-event ">' : '<li>' !!}

					@if (!empty($event->start_date) && in_array('occasion', $mod_event_fields) && $mod_event_occ_pos == 'left')
						<span class="event-date">
							@if ($event->occasionStart['today'] == true)
								<span><strong><?php _e('Today', 'event-integration'); ?>
										@if (date('Y-m-d', strtotime($event->end_date)) !== date('Y-m-d', strtotime($event->start_date)))
											-
											<strong><span class="">{{ $event->occasionEnd['date'] }} {{ $event->occasionEnd['month'] }}</span></strong>

										@endif
									</strong></span>
								<span>{{ $event->occasionStart['time'] }}</span>
							@else
								@if (date('Y-m-d', strtotime($event->end_date)) !== date('Y-m-d', strtotime($event->start_date)))
									@if($event->occasionStart['month'] !== $event->occasionEnd['month'])
										<strong><span>{{ $event->occasionStart['date'] }}</span></strong>
										<span>{{ $event->occasionStart['month'] }}</span>
											-
											<strong><span class="">{{ $event->occasionEnd['date'] }}</span></strong>
										<span>{{ $event->occasionEnd['month'] }}</span>
									@else
											<strong><span>{{ $event->occasionStart['date'] }} - {{ $event->occasionEnd['date'] }} </span></strong>
											<span>{{ $event->occasionStart['month'] }}</span>

									@endif
								@else
									<strong><span>{{ $event->occasionStart['date'] }}</span></strong>
									<span>{{ $event->occasionStart['month'] }}</span>
								@endif

							@endif
						</span>
					@endif

					<span class="event-info">

						@if (in_array('image', $mod_event_fields))
							@if (get_the_post_thumbnail($event->ID))
								{!! get_the_post_thumbnail($event->ID, 'large', array('class' => 'image-responsive')) !!}
							@elseif ($mod_event_def_image)
								{!! wp_get_attachment_image($mod_event_def_image->ID, array('700', '500'), "", array( "class" => "image-responsive" )) !!}
							@endif
						@endif

						@if (!empty($event->post_title))
							@link([
								'href' => esc_url(add_query_arg('date', preg_replace('/\D/', '', $event->start_date), get_permalink($event->ID)))
							])
								{{$event->post_title}}
							@endlink
						@endif

						@if (! empty($event->start_date) && ! empty($event->end_date) && in_array('occasion', $mod_event_fields) && $mod_event_occ_pos == 'below')
							<p class="event-date">
								 @icon([
									'icon' => 'date_range',
									'size' => 'md',
									'classList' => ['u-align--top']
								])
								@endicon 
								<strong><?php _e('Date', 'event-integration'); ?>: </strong>
								{{ \EventManagerIntegration\App::formatEventDate($event->start_date, $event->end_date) }}
							</p>
						@endif

						@if (in_array('location', $mod_event_fields))
						
							@if($event->location_name)
								<p class="event-location">
									@icon([
										'icon' => 'location_searching',
										'size' => 'md',
										'classList' => ['u-align--top']
									])
									@endicon
									<strong><?php _e('Location', 'event-integration'); ?>:</strong> {{ $event->location_name }}</p>
								</p>
							@endif
						@endif

						@if (in_array('description', $mod_event_fields) && $event->content_mode == 'custom' && ! empty($event->content))
							{!! \EventManagerIntegration\Helper\QueryEvents::stringLimiter($event->content, $descr_limit) !!}
						@elseif (! empty($event->post_content) && in_array('description', $mod_event_fields))
							{!! \EventManagerIntegration\Helper\QueryEvents::stringLimiter($event->post_content, $descr_limit) !!}
						@endif

					</span>
				</li>
			@endforeach
		@endif
	</ul>






