<form name="submit-event" class="submit-event" enctype="multipart/form-data">
    {{-- User groups --}}
    @if(!empty($user_groups))
        <input type="hidden" name="user_groups" value="{{ $user_groups }}">
    @endif

    {{-- Client name --}}
    @if(!empty($client_name))
        <input type="hidden" name="client_name" value="{{ $client_name }}">
    @endif

    {{-- Title --}}
    @if(!$title->hidden)
        <div class="form-group">
            <label for="{{ $title->name }}">{{ $title->label }} {!! $title->required ? '<span class="text-danger">*</span></label>' : '' !!}</label>
            @if(!$title->hidden_description)
                <small class="text-dark-gray">{{ $title->description }}</small>
            @endif
            <input type="text"
                   name="{{ $title->name }}"
                   id="{{ $title->name }}"
                   placeholder="{{ $title->label }}"
                    {{ $title->required ? 'required' : '' }}>
        </div>
    @endif

    {{-- Content --}}
    @if(!$content->hidden)
        <div class="form-group">
            <label for="{{ $content->name }}">{{ $content->label }} {!! $content->required ? '<span class="text-danger">*</span></label>' : '' !!}</label>
            @if(!$content->hidden_description)
                <small class="text-dark-gray">{!! $content->description !!}</small>
            @endif
            <textarea name="{{ $content->name }}"
                      rows="5"
                      id="{{ $content->name }} textarea"
                      placeholder="{{ $content->label }}"
                    {{ $content->required ? 'required' : '' }}></textarea>
        </div>
    @endif

    {{-- Occasions --}}
    @if(!$occasion->hidden)
        <div class="form-group">
            <label for="radio">{{ $occasion->label }} {!! $occasion->required ? '<span class="text-danger">*</span></label>' : '' !!}</label>
            @if(!$occasion->hidden_description)
                <small class="text-dark-gray">{!! $occasion->description !!}</small>
            @endif
            <label class="radio">
                <input data-id="single-event" type="radio" name="occurance-type"
                       checked> <?php _e('Single occurrence', 'event-integration'); ?>
            </label>
            <label class="radio">
                <input data-id="recurring-event" type="radio"
                       name="occurance-type"> <?php _ex('Schedule', 'Event recurrence rules', 'event-integration'); ?>
            </label>
        </div>

        {{-- Single/multiple occasions --}}
        <div id="single-event" class="event-occasion form-group">
            <div class="box box-panel box-panel-secondary">
                <div class="box-content">
                    <h4><?php _e('Single occurrence', 'event-integration'); ?></h4>
                    <div class="form-group occurrence occurance-group-single gutter gutter-bottom"
                         style="border-bottom:1px solid #ddd;">
                        <div class="form-group">
                            <label for="start_date"><?php _e('Start date', 'event-integration'); ?> <span
                                        class="text-danger">*</span></label>
                            <input type="text" name="start_date" placeholder="<?php _e('Date', 'event-integration'); ?>"
                                   value="" class="datepicker" required="required">
                        </div>
                        <div class="form-group form-horizontal">
                            <label for="start_time_h"><?php _e('Start time', 'event-integration'); ?> <span
                                        class="text-danger">*</span></label>
                            <div class="form-group">
                                <input type="number" name="start_time_h" placeholder="HH" value="" min="0" max="24"
                                       required="required">
                            </div>
                            <div class="form-group">
                                <i>: </i><input type="number" name="start_time_m" placeholder="MM" value="" min="0"
                                                max="59"
                                                required="required">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="end_date"><?php _e('End date', 'event-integration'); ?> <span
                                        class="text-danger">*</span></label>
                            <input type="text" name="end_date" placeholder="<?php _e('Date', 'event-integration'); ?>"
                                   value="" class="datepicker" required="required">
                        </div>
                        <div class="form-group form-horizontal">
                            <label for="end_time_h"><?php _e('End time', 'event-integration'); ?> <span
                                        class="text-danger">*</span></label>
                            <div class="form-group">
                                <input type="number" name="end_time_h" placeholder="HH" value="" min="0" max="24"
                                       required="required">
                            </div>
                            <div class="form-group">
                                <i>: </i><input type="number" name="end_time_m" placeholder="MM" value="" min="0"
                                                max="59"
                                                required="required">
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <button class="btn btn btn-primary btn-sm add-occurance"><i class="pricon pricon-plus-o"></i>
                            <?php _e('Add', 'event-integration'); ?>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {{-- Recurring event --}}
        <div id="recurring-event" class="event-occasion form-group">
            <div class="box box-panel box-panel-secondary">
                <div class="box-content">
                    <h4><?php _e('Recurrence rules for weekly recurring event', 'event-integration'); ?></h4>
                    <div class="form-group occurrence occurance-group-recurring gutter gutter-bottom"
                         style="border-bottom:1px solid #ddd;">
                        <div class="form-group">
                            <label for="weekday"><?php _e('Weekday', 'event-integration'); ?> <span
                                        class="text-danger">*</span></label>
                            <small><?php _e('The event will occur on this weekday.', 'event-integration'); ?></small>
                            <select name="weekday">
                                <option value="Monday"><?php _e('Monday', 'event-integration'); ?></option>
                                <option value="Tuesday"><?php _e('Tuesday', 'event-integration'); ?></option>
                                <option value="Wednesday"><?php _e('Wednesday', 'event-integration'); ?></option>
                                <option value="Thursday"><?php _e('Thursday', 'event-integration'); ?></option>
                                <option value="Friday"><?php _e('Friday', 'event-integration'); ?></option>
                                <option value="Saturday"><?php _e('Saturday', 'event-integration'); ?></option>
                                <option value="Sunday"><?php _e('Sunday', 'event-integration'); ?></option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="weekly_interval"><?php _e('Weekly interval', 'event-integration'); ?></label>
                            <small class="text-dark-gray"><?php _e('Enter the weekly interval when the event occurs. 1 equals every week.', 'event-integration'); ?></small>
                            <input type="number" name="weekly_interval" id="weekly_interval" min="1" max="52" value="1"
                                   placeholder="<?php _e('Weekly interval', 'event-integration'); ?> required">
                        </div>
                        <div class="form-group form-horizontal">
                            <label for="recurring_start_h"><?php _e('Start time', 'event-integration'); ?> <span
                                        class="text-danger">*</span></label>
                            <small><?php _e('Start time for the event', 'event-integration'); ?></small>
                            <div class="form-group">
                                <input type="number" name="recurring_start_h" placeholder="HH" value="" min="0"
                                       max="24">
                            </div>
                            <div class="form-group">
                                <i>: </i><input type="number" name="recurring_start_m" placeholder="MM" value="" min="0"
                                                max="59">
                            </div>
                        </div>
                        <div class="form-group form-horizontal">
                            <label for="recurring_end_h"><?php _e('End time', 'event-integration'); ?> <span
                                        class="text-danger">*</span></label>
                            <small><?php _e('End time for the event', 'event-integration'); ?></small>
                            <div class="form-group">
                                <input type="number" name="recurring_end_h" placeholder="HH" value="" min="0" max="24">
                            </div>
                            <div class="form-group">
                                <i>: </i><input type="number" name="recurring_end_m" placeholder="MM" value="" min="0"
                                                max="59">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="recurring_start_d"><?php _e('Start date', 'event-integration'); ?> <span
                                        class="text-danger">*</span></label>
                            <small><?php _e('When the recurring event period starts', 'event-integration'); ?></small>
                            <input type="text" name="recurring_start_d"
                                   placeholder="<?php _e('Start date', 'event-integration'); ?>" value=""
                                   class="datepicker">
                        </div>
                        <div class="form-group">
                            <label for="recurring_end_d"><?php _e('End date', 'event-integration'); ?> <span
                                        class="text-danger">*</span></label>
                            <small><?php _e('When the recurring event period ends', 'event-integration'); ?></small>
                            <input type="text" name="recurring_end_d"
                                   placeholder="<?php _e('End date', 'event-integration'); ?>" value=""
                                   class="datepicker">
                        </div>
                    </div>
                    <div class="form-group">
                        <button class="btn btn btn-primary btn-sm add-occurance"><i class="pricon pricon-plus-o"></i>
                            <?php _e('Add', 'event-integration'); ?>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    @endif

    {{-- Event link --}}
    @if(!$event_link->hidden)
        <div class="form-group">
            <label for="{{ $event_link->name }}">{{ $event_link->label }} {!! $event_link->required ? '<span class="text-danger">*</span></label>' : '' !!}</label>
            @if(!$event_link->hidden_description)
                <small class="text-dark-gray">{{ $event_link->description }}</small>
            @endif
            <input type="url"
                   name="{{ $event_link->name }}"
                   id="{{ $event_link->name }}"
                   placeholder="{{ $event_link->label }}"
                    {{ $event_link->required ? 'required' : '' }}>
        </div>
    @endif

    {{-- Booking link --}}
    @if(!$booking_link->hidden)
        <div class="form-group">
            <label for="{{ $booking_link->name }}">{{ $booking_link->label }} {!! $booking_link->required ? '<span class="text-danger">*</span></label>' : '' !!}</label>
            @if(!$booking_link->hidden_description)
                <small class="text-dark-gray">{{ $booking_link->description }}</small>
            @endif
            <input type="url"
                   name="{{ $booking_link->name }}"
                   id="{{ $booking_link->name }}"
                   placeholder="{{ $booking_link->label }}"
                    {{ $booking_link->required ? 'required' : '' }}>
        </div>
    @endif

    {{-- Price adult --}}
    @if(!$price_adult->hidden)
        <div class="form-group">
            <label for="{{ $price_adult->name }}">{{ $price_adult->label }} {!! $price_adult->required ? '<span class="text-danger">*</span></label>' : '' !!}</label>
            @if(!$price_adult->hidden_description)
                <small class="text-dark-gray">{{ $price_adult->description }}</small>
            @endif
            <input type="number"
                   name="{{ $price_adult->name }}"
                   id="{{ $price_adult->name }}"
                   placeholder="{{ $price_adult->label }}"
                    {{ $price_adult->required ? 'required' : '' }}>
        </div>
    @endif

    {{-- Price student --}}
    @if(!$price_student->hidden)
        <div class="form-group">
            <label for="{{ $price_student->name }}">{{ $price_student->label }} {!! $price_student->required ? '<span class="text-danger">*</span></label>' : '' !!}</label>
            @if(!$price_student->hidden_description)
                <small class="text-dark-gray">{{ $price_student->description }}</small>
            @endif
            <input type="number"
                   name="{{ $price_student->name }}"
                   id="{{ $price_student->name }}"
                   placeholder="{{ $price_student->label }}"
                    {{ $price_student->required ? 'required' : '' }}>
        </div>
    @endif

    {{-- Price children --}}
    @if(!$price_children->hidden)
        <div class="form-group">
            <label for="{{ $price_children->name }}">{{ $price_children->label }} {!! $price_children->required ? '<span class="text-danger">*</span></label>' : '' !!}</label>
            @if(!$price_children->hidden_description)
                <small class="text-dark-gray">{{ $price_children->description }}</small>
            @endif
            <input type="number"
                   name="{{ $price_children->name }}"
                   id="{{ $price_children->name }}"
                   placeholder="{{ $price_children->label }}"
                    {{ $price_children->required ? 'required' : '' }}>
        </div>
    @endif

    {{-- Children age --}}
    @if(!$children_age->hidden)
        <div class="form-group">
            <label for="{{ $children_age->name }}">{{ $children_age->label }} {!! $children_age->required ? '<span class="text-danger">*</span></label>' : '' !!}</label>
            @if(!$children_age->hidden_description)
                <small class="text-dark-gray">{{ $children_age->description }}</small>
            @endif
            <input type="number"
                   name="{{ $children_age->name }}"
                   id="{{ $children_age->name }}"
                   placeholder="{{ $children_age->label }}"
                    {{ $children_age->required ? 'required' : '' }}>
        </div>
    @endif

    {{-- Price senior --}}
    @if(!$price_senior->hidden)
        <div class="form-group">
            <label for="{{ $price_senior->name }}">{{ $price_senior->label }} {!! $price_senior->required ? '<span class="text-danger">*</span></label>' : '' !!}</label>
            @if(!$price_senior->hidden_description)
                <small class="text-dark-gray">{{ $price_senior->description }}</small>
            @endif
            <input type="number"
                   name="{{ $price_senior->name }}"
                   id="{{ $price_senior->name }}"
                   placeholder="{{ $price_senior->label }}"
                    {{ $price_senior->required ? 'required' : '' }}>
        </div>
    @endif

    {{-- Senior age --}}
    @if(!$senior_age->hidden)
        <div class="form-group">
            <label for="{{ $senior_age->name }}">{{ $senior_age->label }} {!! $senior_age->required ? '<span class="text-danger">*</span></label>' : '' !!}</label>
            @if(!$senior_age->hidden_description)
                <small class="text-dark-gray">{{ $senior_age->description }}</small>
            @endif
            <input type="number"
                   name="{{ $senior_age->name }}"
                   id="{{ $senior_age->name }}"
                   placeholder="{{ $senior_age->label }}"
                    {{ $senior_age->required ? 'required' : '' }}>
        </div>
    @endif

    {{-- Age group --}}
    @if(!$age_group->hidden)
        <div class="form-group form-horizontal">
            <label>{{ $age_group->label }} {!! $age_group->required ? '<span class="text-danger">*</span></label>' : '' !!}</label>
            @if(!$age_group->hidden_description)
                <small class="text-dark-gray">{{ $age_group->description }}</small>
            @endif
            <br>
            <div class="form-group">
                <label for="age_group_from"><?php _e('From', 'event-integration'); ?></label>
                <input type="number"
                       name="age_group_from"
                       placeholder="<?php _e('From', 'event-integration'); ?>"
                        {{ $age_group->required ? 'required' : '' }}>
            </div>
            <div class="form-group">
                <label for="age_group_to"><?php _e('To', 'event-integration'); ?></label>
                <input type="number"
                       name="age_group_to"
                       placeholder="<?php _e('To', 'event-integration'); ?>"
                        {{ $age_group->required ? 'required' : '' }}>
            </div>
        </div>
    @endif

    {{-- Organizer --}}
    @if(!$organizer->hidden)
        <div class="form-group">
            <label for="{{ $organizer->name }}">{{ $organizer->label }}</label>
            @if(!$organizer->hidden_description)
                <small class="text-dark-gray">{{ $organizer->description }}</small>
            @endif
            <input id="organizer-selector" autofocus="" type="text" name="q"
                   placeholder="{{ $organizer->label }}"
                   autocomplete="off">
            <input name="{{ $organizer->name }}" id="{{ $organizer->name }}" type="hidden">
        </div>
    @endif

    {{-- Location --}}
    @if(!$location->hidden)
        <div class="form-group">
            <label for="{{ $location->name }}">{{ $location->label }}</label>
            @if(!$location->hidden_description)
                <small class="text-dark-gray">{{ $location->description }}</small>
            @endif
            <input id="location-selector" autofocus="" type="text" name="q"
                   placeholder="{{ $location->label }}"
                   autocomplete="off">
            <input name="{{ $location->name }}" id="{{ $location->name }}" type="hidden">
        </div>
    @endif

    {{-- Accessibility --}}
    @if(!$accessibility->hidden)
        <div class="form-group">
            <label>{{ $accessibility->label }}</label>
            @if(!$accessibility->hidden_description)
                <small class="text-dark-gray">{{ $accessibility->description }}</small>
            @endif
            <label class="checkbox">
                <input type="checkbox" name="{{ $accessibility->name }}"
                       value="elevator"> <?php _e('Elevator/ramp', 'event-integration'); ?>
            </label>
            <label class="checkbox">
                <input type="checkbox" name="{{ $accessibility->name }}"
                       value="accessible_toilet"> <?php _e('Accessible toilet', 'event-integration'); ?>
            </label>
        </div>
    @endif

    {{-- Categories --}}
    @if(!$event_categories->hidden)
        <div class="form-group">
            <label for="{{ $event_categories->name }}">{{ $event_categories->label }}</label>
            @if(!$event_categories->hidden_description)
                <small class="text-dark-gray">{{ $event_categories->description }}</small>
            @endif
            <select name="{{ $event_categories->name }}"
                    id="{{ $event_categories->name }}"
                    multiple
                    {{ $event_categories->required ? 'required' : '' }}>
                <option value=""><?php _e('Loading', 'event-integration'); ?>...</option>
            </select>
        </div>
    @endif

    {{-- Categories --}}
    @if(!$event_tags->hidden)
        <div class="form-group">
            <label for="{{ $event_tags->name }}">{{ $event_tags->label }}</label>
            @if(!$event_tags->hidden_description)
                <small class="text-dark-gray">{{ $event_tags->description }}</small>
            @endif
            <select name="{{ $event_tags->name }}"
                    id="{{ $event_tags->name }}"
                    multiple
                    {{ $event_tags->required ? 'required' : '' }}>
                <option value=""><?php _e('Loading', 'event-integration'); ?>...</option>
            </select>
        </div>
    @endif

    {{-- Image --}}
    @if(!$image_input->hidden)
        <div class="form-group gutter creamy image-box text-center">
            <p><i class="pricon pricon-badge pricon-badge-red-3 pricon-3x pricon-picture"></i></p>
            <p>
                <strong>{{ $image_input->label }} {!! $image_input->required ? '<span class="text-danger">*</span></label>' : '' !!}</strong>
            </p>

            <p>
                @if(!$image_input->hidden_description)
                    <small class="text-dark-gray">{!! $image_input->description !!}</small>
                @endif
            </p>
            <p>
                <button class="btn btn-secondary img-button">{{ $image_input->label }}</button>
            </p>
        </div>
        <div class="form-group gutter creamy image-approve" style="display:none;">
            <label><?php _e('Before you can upload an image, you need to confirm the following terms', 'event-integration'); ?>
                :</label>
            <label class="checkbox">
                <input type="checkbox" name="approve"
                       id="first-approve"> <?php _e('I have the right to use this image to promote this event.', 'event-integration'); ?>
            </label>
            <label class="checkbox">
                <input type="checkbox" name="approve"
                       id="second-approve"> <?php _e('There are no identifiable persons on the image/images.', 'event-integration'); ?>
            </label>
        </div>
        <div class="form-group image-upload" style="display:none;">
            <label for="{{ $image_input->name }}"><?php _e('Upload an image', 'event-integration'); ?> {!! $image_input->required ? '<span class="text-danger">*</span></label>' : '' !!}</label>
            <input name="{{ $image_input->name }}"
                   id="{{ $image_input->name }}"
                   type="file"
                   accept="image/gif, image/jpeg, image/png"
                    {{ $image_input->required ? 'required' : '' }}>
        </div>
    @endif

    @if(!$submitter_email->hidden || !$submitter_phone->hidden)
        <div class="form-group">
            <h4><?php _e('Contact details', 'event-integration'); ?></h4>
            <p class="text-sm"><?php _e('Enter your contact details below for eventual questions.', 'event-integration'); ?></p>
        </div>
    @endif

    {{-- Email --}}
    @if(!$submitter_email->hidden)
        <div class="form-group">
            <label for="{{ $submitter_email->name }}">{{ $submitter_email->label }} {!! $submitter_email->required ? '<span class="text-danger">*</span></label>' : '' !!}</label>
            @if(!$submitter_email->hidden_description)
                <small class="text-dark-gray">{{ $submitter_email->description }}</small>
            @endif
            <input type="email"
                   name="{{ $submitter_email->name }}"
                   id="{{ $submitter_email->name }}"
                   placeholder="{{ $submitter_email->label }}"
                    {{ $submitter_email->required ? 'required' : '' }}>
        </div>

        <div class="form-group">
            <label for="submitter_repeat_email"><?php _e('Repeat email', 'event-integration'); ?> {!! $submitter_email->required ? '<span class="text-danger">*</span></label>' : '' !!}</label>
            <input type="email"
                   name="submitter_repeat_email"
                   id="submitter_repeat_email"
                   placeholder="<?php _e('Repeat email', 'event-integration'); ?>"
                    {{ $submitter_email->required ? 'required' : '' }}>
        </div>
    @endif

    {{-- Phone --}}
    @if(!$submitter_phone->hidden)
        <div class="form-group">
            <label for="{{ $submitter_phone->name }}">{{ $submitter_phone->label }} {!! $submitter_phone->required ? '<span class="text-danger">*</span></label>' : '' !!}</label>
            @if(!$submitter_phone->hidden_description)
                <small class="text-dark-gray">{{ $submitter_phone->description }}</small>
            @endif
            <input type="text"
                   name="{{ $submitter_phone->name }}"
                   id="{{ $submitter_phone->name }}"
                   placeholder="{{ $submitter_phone->label }}"
                    {{ $submitter_phone->required ? 'required' : '' }}>
        </div>
    @endif

    <div class="form-group">
        <p>
            <small><?php _e('Done? Click here to submit your event for review.', 'event-integration'); ?></small>
        </p>
    </div>
    <div class="form-group submit-error hidden">
        <li class="notice warning"></li>
    </div>
    <div class="form-group submit-success hidden">
        <li class="notice success"></li>
    </div>
    <div class="form-group">
        <input type="submit" class="btn btn-primary" value="<?php _e('Send', 'event-integration'); ?>">
    </div>
</form>