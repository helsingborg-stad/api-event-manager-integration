<form name="submit-event" class="submit-event" enctype="multipart/form-data">
    <input type="hidden" name="user_groups" value="312">

    <div class="form-group">
        <label for="title"><?php _e('Event name', 'event-integration'); ?> <span class="text-danger">*</span></label>
        <input type="text" name="title" id="title" placeholder="<?php _e('Event name', 'event-integration'); ?>" required>
    </div>

    <div class="form-group">
        <label for="content"><?php _e('Description', 'event-integration'); ?> <span class="text-danger">*</span></label>
        <small class="text-dark-gray"><?php _e('Describe your event. What happens and why should you visit it?', 'event-integration'); ?></small>
        <textarea name="content" id="content textarea" placeholder="<?php _e('Description', 'event-integration'); ?>" required></textarea>
    </div>

    <div class="form-group">
        <label for="radio"><?php _e('Event occurrence', 'event-integration'); ?> <span class="text-danger">*</span></label>
        <small class="text-dark-gray">
            <?php _e('Add occasions to this event. Does the event occur each week? Then add a rule for recurring events.', 'event-integration'); ?>
        </small>
        <label class="radio">
            <input data-id="single-event" type="radio" name="occurance-type" checked> <?php _e('Single occurrence', 'event-integration'); ?>
        </label>
        <label class="radio">
            <input data-id="recurring-event" type="radio" name="occurance-type"> <?php _ex('Schedule', 'Event recurrence rules', 'event-integration'); ?>
        </label>
    </div>

    <div id="single-event" class="event-occasion form-group">
        <div class="box box-panel box-panel-secondary">
            <div class="box-content">
                <h4><?php _e('Single occurrence', 'event-integration'); ?></h4>
                <div class="form-group occurance-group-single gutter gutter-bottom"
                     style="border-bottom:1px solid #ddd;">
                    <div class="form-group">
                        <label for="start_date"><?php _e('Start date', 'event-integration'); ?> <span class="text-danger">*</span></label>
                        <input type="text" name="start_date" placeholder="<?php _e('Date', 'event-integration'); ?>" value="" class="datepicker"
                               required="required">
                    </div>
                    <div class="form-group form-horizontal">
                        <label for="start_time_h"><?php _e('Start time', 'event-integration'); ?> <span class="text-danger">*</span></label>
                        <div class="form-group">
                            <input type="number" name="start_time_h" placeholder="HH" value="" min="0" max="24"
                                   required="required">
                        </div>
                        <div class="form-group">
                            <i>: </i><input type="number" name="start_time_m" placeholder="MM" value="" min="0"
                                            max="60" required="required">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="end_date"><?php _e('End date', 'event-integration'); ?> <span class="text-danger">*</span></label>
                        <input type="text" name="end_date" placeholder="<?php _e('Date', 'event-integration'); ?>" value="" class="datepicker"
                               required="required">
                    </div>
                    <div class="form-group form-horizontal">
                        <label for="end_time_h"><?php _e('End time', 'event-integration'); ?> <span class="text-danger">*</span></label>
                        <div class="form-group">
                            <input type="number" name="end_time_h" placeholder="HH" value="" min="0" max="24"
                                   required="required">
                        </div>
                        <div class="form-group">
                            <i>: </i><input type="number" name="end_time_m" placeholder="MM" value="" min="0"
                                            max="60" required="required">
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

    <div id="recurring-event" class="event-occasion form-group">
        <div class="box box-panel box-panel-secondary">
            <div class="box-content">
                <h4><?php _e('Recurrence rules for weekly recurring event', 'event-integration'); ?></h4>
                <div class="form-group occurance-group-recurring gutter gutter-bottom"
                     style="border-bottom:1px solid #ddd;">
                    <div class="form-group">
                        <label for="weekday"><?php _e('Weekday', 'event-integration'); ?> <span class="text-danger">*</span></label>
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
                    <div class="form-group form-horizontal">
                        <label for="recurring_start_h"><?php _e('Start time', 'event-integration'); ?> <span class="text-danger">*</span></label>
                        <small><?php _e('Start time for the event', 'event-integration'); ?></small>
                        <div class="form-group">
                            <input type="number" name="recurring_start_h" placeholder="HH" value="" min="0" max="24">
                        </div>
                        <div class="form-group">
                            <i>: </i><input type="number" name="recurring_start_m" placeholder="MM" value="" min="0" max="60">
                        </div>
                    </div>
                    <div class="form-group form-horizontal">
                        <label for="recurring_end_h"><?php _e('End time', 'event-integration'); ?> <span class="text-danger">*</span></label>
                        <small><?php _e('End time for the event', 'event-integration'); ?></small>
                        <div class="form-group">
                            <input type="number" name="recurring_end_h" placeholder="HH" value="" min="0" max="24">
                        </div>
                        <div class="form-group">
                            <i>: </i><input type="number" name="recurring_end_m" placeholder="MM" value="" min="0" max="60">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="recurring_start_d"><?php _e('Start date', 'event-integration'); ?> <span class="text-danger">*</span></label>
                        <small><?php _e('When the recurring event period starts', 'event-integration'); ?></small>
                        <input type="text" name="recurring_start_d" placeholder="<?php _e('Start date', 'event-integration'); ?>" value=""
                               class="datepicker">
                    </div>
                    <div class="form-group">
                        <label for="recurring_end_d"><?php _e('End date', 'event-integration'); ?> <span class="text-danger">*</span></label>
                        <small><?php _e('When the recurring event period ends', 'event-integration'); ?></small>
                        <input type="text" name="recurring_end_d" placeholder="<?php _e('End date', 'event-integration'); ?>" value=""
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

    <div class="form-group">
        <label for="event_link"><?php _e('Website', 'event-integration'); ?></label>
        <small class="text-dark-gray"><?php _e('Link to event website.', 'event-integration'); ?></small>
        <input type="url" name="event_link" id="event_link" placeholder="<?php _e('Website', 'event-integration'); ?>">
    </div>

    <div class="form-group">
        <label for="booking_link"><?php _e('Link to booking', 'event-integration'); ?></label>
        <small class="text-dark-gray"><?php _e('Link to the event\'s booking page, e.g. ticketmaster.', 'event-integration'); ?></small>
        <input type="url" name="booking_link" id="booking_link" placeholder="<?php _e('Link to booking', 'event-integration'); ?>">
    </div>

    <div class="form-group">
        <label for="price_adult"><?php _e('Price', 'event-integration'); ?></label>
        <small class="text-dark-gray"><?php _e('For adults. Are there multiple price ranges? Please add it in the description.', 'event-integration'); ?></small>
        <input type="number" name="price_adult" id="price_adult" placeholder="<?php _e('Price', 'event-integration'); ?>">
    </div>

    <div class="form-group">
        <label for="organizer"><?php _e('Arrangör', 'event-integration'); ?></label>
        <small class="text-dark-gray"><?php _e('Choose from existing organizers in the list. If your business is not available, please add an organizer to the description.', 'event-integration'); ?></small>
        <select name="organizer" id="organizer">
            <option value=""><?php _e('Loading', 'event-integration'); ?>...</option>
        </select>
    </div>

    <div class="form-group">
        <label for="location"><?php _e('Location', 'event-integration'); ?></label>
        <small class="text-dark-gray"><?php _e('Choose from existing locations in the list. If the location is not available, please add an address in the description.', 'event-integration'); ?></small>
        <select name="location" id="location">
            <option value=""><?php _e('Loading', 'event-integration'); ?>...</option>
        </select>
    </div>

    <div class="form-group">
        <label for="event_categories"><?php _e('Categories', 'event-integration'); ?></label>
        <small class="text-dark-gray"><?php _e('Select appropriate categories for your event or activity. To select multiple categories, press Ctrl (Windows) / command (macOS) at the same time as you click on the categories.', 'event-integration'); ?></small>
        <select name="event_categories" id="event_categories" multiple>
            <option value=""><?php _e('Loading', 'event-integration'); ?>...</option>
        </select>
    </div>

    <div class="form-group gutter creamy image-box text-center">
        <p><i class="pricon pricon-badge pricon-badge-red-3 pricon-3x pricon-picture"></i></p>
        <p>
            <small>
                <?php _e('Upload an image. Keep in mind that the image may be cropped, so avoid text in the image.', 'event-integration'); ?><br>
                <?php _e('You must also have the right to use and distribute the image.', 'event-integration'); ?>
            </small>
        </p>
        <p>
            <button class="btn btn-secondary img-button"><?php _e('Upload an image', 'event-integration'); ?></button>
        </p>
    </div>
    <div class="form-group gutter creamy image-approve" style="display:none;">
        <label><?php _e('Before you can upload an image, you need to confirm the following terms', 'event-integration'); ?>:</label>
        <label class="checkbox">
            <input type="checkbox" name="approve" id="first-approve"> <?php _e('I have the right to use this image to promote this event.', 'event-integration'); ?>
        </label>
        <label><?php _e('Are there identifiable persons on the image/images?', 'event-integration'); ?></label>
        <label class="radio">
            <input type="radio" name="approve" value="1"> <?php _e('Yes', 'event-integration'); ?>
        </label>
        <label class="radio">
            <input type="radio" name="approve" value="0"> <?php _e('No', 'event-integration'); ?>
        </label>
        <label class="checkbox hidden" id="persons-approve">
            <input type="checkbox" name="approve" id="second-approve"> <?php _e('They have approved that the image is used to promote this event and has been informed that after the image has been added to the location and event database, it may appear in different channels to promote the event.', 'event-integration'); ?>
        </label>
    </div>

    <div class="form-group image-upload" style="display:none;">
        <label for="image-input"><?php _e('Upload an image', 'event-integration'); ?></label>
        <input name="image-input" id="image-input" type="file" accept="image/gif, image/jpeg, image/png">
    </div>

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