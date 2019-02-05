<div class="{{ $classes }} {{ isset($font_size) ? $font_size : '' }}">
    @if (!$hideTitle && !empty($post_title))
    <h4 class="box-title">{!! apply_filters('the_title', $post_title) !!}</h4>
    @endif
    <div class="box-content">
        @include('formfields')
    </div>
</div>
