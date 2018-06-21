<a class="c-card c-card--action u-text-center" href="{{ esc_url(add_query_arg('date', preg_replace('/\D/', '', $event->start_date), get_permalink($event->ID))) }}">
    {{-- Image --}}
    @if (in_array('image', $mod_event_fields) && function_exists('municipio_get_thumbnail_source') && municipio_get_thumbnail_source($event->ID,array($imageDimensions['width'], $imageDimensions['height']), $imageRatio))
        <img class="c-card__image" src="{{ municipio_get_thumbnail_source($event->ID,array($imageDimensions['width'],$imageDimensions['height']), $imageRatio) }}">
    @endif

    <div class="c-card__body">
        {{-- Date --}}
        @if (! empty($event->start_date) && ! empty($event->end_date) && in_array('occasion', $mod_event_fields))
            <div class="c-card__time u-mb-2">
                <time>
                    {{ \EventManagerIntegration\App::formatEventDate($event->start_date, $event->end_date) }}
                </time>
            </div>
        @endif

        {{-- Title --}}
        @if (!empty($event->post_title))
            <h4 class="c-card__title">{{ $event->post_title }}</h4>
        @endif

        {{-- Location --}}
        @if (in_array('location', $mod_event_fields) && get_post_meta($event->ID, 'location', true))
            <span class="c-card__sub o-text-small">
                <?php $location = get_post_meta($event->ID, 'location', true); ?>
                {{ $location['title'] }}
            </span>
        @endif
    </div>
</a>
