<ul class="event-module-list">
   <?php //var_dump($events); ?>
    @if (!$events)
        <li><span class="event-info"><?php _e('No events found', 'event-integration'); ?></span></li>
    @else
        @foreach ($events as $event)

			   {!! (isset($event->end_date) && (strtotime($event->end_date) < $date_now)) ? '<li class="passed-event ">' : '<li>' !!}
	            @if (!empty($event->start_date) && in_array('occasion', $mod_event_fields) && $mod_event_occ_pos == 'left')
	                <?php
				   		$occasionStart = \EventManagerIntegration\App::formatShortDate($event->start_date);
				   		$occasionEnd = \EventManagerIntegration\App::formatShortDate($event->end_date);
	                ?>
	                <span class="event-date">
	                @if ($occasionStart['today'] == true)
	                    <span><strong><?php _e('Today', 'event-integration'); ?>
								@if (date('Y-m-d', strtotime($event->end_date)) !== date('Y-m-d', strtotime($event->start_date)))
									-
									<strong><span class="">{{ $occasionEnd['date'] }} {{ $occasionEnd['month'] }}</span></strong>

								@endif
							</strong></span>
	                    <span>{{ $occasionStart['time'] }}</span>
	                @else
						@if (date('Y-m-d', strtotime($event->end_date)) !== date('Y-m-d', strtotime($event->start_date)))
							@if($occasionStart['month'] !== $occasionEnd['month'])
								<strong><span>{{ $occasionStart['date'] }}</span></strong>
								<span>{{ $occasionStart['month'] }}</span>
									-
									<strong><span class="">{{ $occasionEnd['date'] }}</span></strong>
								<span>{{ $occasionEnd['month'] }}</span>
							@else
									<strong><span>{{ $occasionStart['date'] }} - {{ $occasionEnd['date'] }} </span></strong>
									<span>{{ $occasionStart['month'] }}</span>

							@endif
						@else
							<strong><span>{{ $occasionStart['date'] }}</span></strong>
							<span>{{ $occasionStart['month'] }}</span>
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
	               	<a href="{{ esc_url(add_query_arg('date', preg_replace('/\D/', '', $event->start_date), get_permalink($event->ID))) }}" class="title"><span class="link-item title">{{ $event->post_title }}</span></a>
	            @endif
	            @if (! empty($event->start_date) && ! empty($event->end_date) && in_array('occasion', $mod_event_fields) && $mod_event_occ_pos == 'below')
	                <p class="text-sm"><i class="pricon pricon-calendar"></i> <strong><?php _e('Date', 'event-integration'); ?>: </strong>{{ \EventManagerIntegration\App::formatEventDate($event->start_date, $event->end_date) }}</p>
	            @endif
	            @if (in_array('location', $mod_event_fields))
                    @php
                        $location = \EventManagerIntegration\Helper\SingleEventData::getEventLocation($event->ID, $event->start_date);
                    @endphp
                    @if(!empty($location['title']))
                        <p class="text-sm"><i class="pricon pricon-location-pin"></i> <strong><?php _e('Location', 'event-integration'); ?>:</strong> {{ $location['title'] }}</p>
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
