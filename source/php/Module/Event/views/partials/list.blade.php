@if (!empty($events))
    @collection([
        'classList' => [
            'c-collection--event', 'c-collection--bordered'
        ],
        'attributeList' => [
            'js-pagination-container' => '',
        ]
    ])
        @foreach($events as $event)
		@php
			$event->passed = (isset($event->end_date) && (strtotime($event->end_date) < $date_now)) ? true : false;
		@endphp
			<a href="{{$event->permalink}}" class="c-collection__item c-collection__item--action {{$event->passed ? 'c-collection__item--passed' : ''}}" js-pagination-item>
				<span class="c-collection__icon c-collection__icon--date">
					<span class="c-collection__date">
						<strong class="c-collection__day"><span>{{ $event->occasionStart['date'] }}</span></strong>
						<span class="c-collection__month">{{ $event->occasionStart['month'] }}</span>										
					</span>
				</span>
				<span class="c-collection__content">
					@typography(['element' => 'h2', 'variant' => 'h4'])
						{{$event->post_title}}
						@typography(['variant' => 'meta', 'element' => 'p'])
							{{$event->occasionDateFormatted}}
						@endtypography
					@endtypography
				</span>
			</a>
		@endforeach
	@endcollection

	@if ($mod_event_pagination && $pagesCount > 1 || $mod_event_archive)
		<div class="c-card__footer u-padding__x--2 u-margin--0">
			<div class="o-grid">
				@if ($mod_event_pagination && $pagesCount > 1)
					<div class="o-grid-12 o-grid-auto@sm u-display--none@xs">
						@pagination([
							'list' => $paginationList, 
              				'classList' => [],
							'buttonSize' => 'sm',
							'current' => isset($_GET['paged']) ? $_GET['paged'] : 1,
							'linkPrefix' => '?paged=',
                            'anchorTag' => '#event-' . $ID,
                            'useJS' => true,
                            'perPage' => $mod_event_limit,
                            'maxPages' => $mod_event_pagination_limit
                        ])
						@endpagination
					</div>
				@endif

				@if ($mod_event_archive)
					<div class="o-grid-12 o-grid-auto@sm u-text-align--right">
						@button([
							'text' =>  __('More events', 'event-integration'),
							'color' => 'secondary',
							'style' => 'filled',
							'href' => get_post_type_archive_link('event'),
							'icon' => 'add',
							'reversePositions' => true,
							'size' => 'sm',
							'classList' => ['u-display--block@xs']
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


