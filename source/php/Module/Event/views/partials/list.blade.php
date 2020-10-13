

@if (!empty($events))
	@collection(['classList' => ['c-collection--event', 'c-collection--bordered']])
		@foreach($events as $event)
		@php
			$event->passed = (isset($event->end_date) && (strtotime($event->end_date) < $date_now)) ? true : false;
		@endphp
		
			{{-- @if(!$loop->first)
				<hr class="c-collection__divider c-collection__divider--inset" />
			@endif --}}
			<a href="{{get_permalink($event->ID)}}" class="c-collection__item c-collection__item--action {{$event->passed ? 'c-collection__item--passed' : ''}}">
				<span class="c-collection__icon c-collection__icon--date">
					<span class="c-collection__date">
						<strong class="c-collection__day"><span>{{ $event->occasionStart['date'] }}</span></strong>
						<span class="c-collection__month">{{ $event->occasionStart['month'] }}</span>										
					</span>
				</span>
				<span class="c-collection__content">
					@typography(['element' => 'h4'])
						{{$event->post_title}}
						@typography(['variant' => 'meta', 'element' => 'p'])
							{{\EventManagerIntegration\Helper\SingleEventData::singleEventDate($event->ID)['formatted']}}
						@endtypography
					@endtypography
				</span>

				@if($event->passed)
					<span class="c-collection__secondary">
						@typography(['variant' => 'meta', 'element' => 'p'])
							<?php _e('Passed', 'event-integration'); ?>
						@endtypography
					</span>
				@elseif ($event->occasionStart['today'] == true)
					<span class="c-collection__secondary">
						@typography(['variant' => 'meta', 'element' => 'p'])
							<?php _e('Today', 'event-integration'); ?>
						@endtypography
					</span>
				@endif
			</a>
		@endforeach
	@endcollection

	@if ($mod_event_pagination && $pagesCount > 1 || $mod_event_archive)
		<div class="c-card__footer">
			<div class="o-grid o-grid--no-gutter o-grid--no-margin">
				@if ($mod_event_pagination && $pagesCount > 1)
					<div class="o-grid-12 o-grid-auto@sm">
						@pagination([
							'list' => $paginationList, 
							'classList' => [], 
							'current' => isset($_GET['paged']) ? $_GET['paged'] : 1,
							'linkPrefix' => '?paged=',
							'anchorTag' => '#event-' . $ID
							])
						@endpagination
					</div>
				@endif

				@if ($mod_event_archive)
					<div class="o-grid-12 o-grid-auto@sm  u-text-align--right">
						@button([
							'text' =>  __('More events', 'event-integration'),
							'color' => 'primary',
							'style' => 'basic',
							'href' => get_post_type_archive_link('event'),
							'icon' => 'add',
							'reversePositions' => true,
							'size' => 'lg'
							])
						@endbutton 
					</div>
				@endif
			</div>
		</div>
	@endif
@else
	<div class="c-card__body">
		{{$no_events}}
	</div>
@endif


