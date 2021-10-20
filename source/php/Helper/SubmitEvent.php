<?php
/**
 * Define form fields
 */

namespace EventManagerIntegration\Helper;

class SubmitEvent
{
    public static function geFields($id = 0)
    {
        $data = get_fields($id);

        

        $fields = array(
            'title' => (object)array(
                'name' => 'title',
                'label' => !empty($data['title']['label']) ? $data['title']['label'] : __('Event name', 'event-integration'),
                'description' => !empty($data['title']['description']) ? $data['title']['description'] : __('Name of the event.', 'event-integration'),
                'required' => true,
                'hidden' => false,
                'hidden_description' => !empty($data['title']['hidden_description']),
            ),
            'content' => (object)array(
                'name' => 'content',
                'label' => !empty($data['content']['label']) ? $data['content']['label'] : __('Description', 'event-integration'),
                'description' => !empty($data['content']['description']) ? $data['content']['description'] :
                    __('Describe your event. What happens and why should you visit it?', 'event-integration') . '<br>' .
                    __('Plain language tips', 'event-integration') . ':<br>' .
                    __('Write the most important first.', 'event-integration') . '<br>' .
                    __('Use words that you think the readers understand.', 'event-integration') . '<br>' .
                    __('Write short and concise.', 'event-integration'),
                'required' => true,
                'hidden' => false,
                'hidden_description' => !empty($data['content']['hidden_description']),
            ),
            'occasion' => (object)array(
                'name' => '',
                'label' => !empty($data['occasion']['label']) ? $data['occasion']['label'] : __('Event occurrence', 'event-integration'),
                'description' => !empty($data['occasion']['description']) ? $data['occasion']['description'] : __('Add occasions to this event. Does the event occur each week? Then add a rule for recurring events. Note that end time for the event can\'t be the same as the start time.', 'event-integration'),
                'required' => true,
                'hidden' => false,
                'hidden_description' => !empty($data['occasion']['hidden_description']),
            ),
            'event_link' => (object)array(
                'name' => 'event_link',
                'label' => !empty($data['event_link']['label']) ? $data['event_link']['label'] : __('Website', 'event-integration'),
                'description' => !empty($data['event_link']['description']) ? $data['event_link']['description'] : __('Link to event website.', 'event-integration'),
                'required' => !empty($data['event_link']['required']),
                'hidden' => !empty($data['event_link']['hidden']),
                'hidden_description' => !empty($data['event_link']['hidden_description']),
            ),
            'booking_link' => (object)array(
                'name' => 'booking_link',
                'label' => !empty($data['booking_link']['label']) ? $data['booking_link']['label'] : __('Link to booking', 'event-integration'),
                'description' => !empty($data['booking_link']['description']) ? $data['booking_link']['description'] : __('Link to the event\'s booking page.', 'event-integration'),
                'required' => !empty($data['booking_link']['required']),
                'hidden' => !empty($data['booking_link']['hidden']),
                'hidden_description' => !empty($data['booking_link']['hidden_description']),
            ),
            'price_adult' => (object)array(
                'name' => 'price_adult',
                'label' => !empty($data['price_adult']['label']) ? $data['price_adult']['label'] : __('Price adult', 'event-integration'),
                'description' => !empty($data['price_adult']['description']) ? $data['price_adult']['description'] : __('Price for adults. Are there multiple price ranges? Please add it in the description.', 'event-integration'),
                'required' => !empty($data['price_adult']['required']),
                'hidden' => !empty($data['price_adult']['hidden']),
                'hidden_description' => !empty($data['price_adult']['hidden_description']),
            ),
            'price_student' => (object)array(
                'name' => 'price_student',
                'label' => !empty($data['price_student']['label']) ? $data['price_student']['label'] : __('Price student', 'event-integration'),
                'description' => !empty($data['price_student']['description']) ? $data['price_student']['description'] : __('Price for students.', 'event-integration'),
                'required' => !empty($data['price_student']['required']),
                'hidden' => !empty($data['price_student']['hidden']),
                'hidden_description' => !empty($data['price_student']['hidden_description']),
            ),
            'price_children' => (object)array(
                'name' => 'price_children',
                'label' => !empty($data['price_children']['label']) ? $data['price_children']['label'] : __('Price children', 'event-integration'),
                'description' => !empty($data['price_children']['description']) ? $data['price_children']['description'] : __('Price for children.', 'event-integration'),
                'required' => !empty($data['price_children']['required']),
                'hidden' => !empty($data['price_children']['hidden']),
                'hidden_description' => !empty($data['price_children']['hidden_description']),
            ),
            'children_age' => (object)array(
                'name' => 'children_age',
                'label' => !empty($data['children_age']['label']) ? $data['children_age']['label'] : __('Age restriction for children price', 'event-integration'),
                'description' => !empty($data['children_age']['description']) ? $data['children_age']['description'] : __('Children price is valid up to this age.', 'event-integration'),
                'required' => !empty($data['children_age']['required']),
                'hidden' => !empty($data['children_age']['hidden']),
                'hidden_description' => !empty($data['children_age']['hidden_description']),
            ),
            'price_senior' => (object)array(
                'name' => 'price_senior',
                'label' => !empty($data['price_senior']['label']) ? $data['price_senior']['label'] : __('Price senior', 'event-integration'),
                'description' => !empty($data['price_senior']['description']) ? $data['price_senior']['description'] : __('Price for seniors.', 'event-integration'),
                'required' => !empty($data['price_senior']['required']),
                'hidden' => !empty($data['price_senior']['hidden']),
                'hidden_description' => !empty($data['price_senior']['hidden_description']),
            ),
            'senior_age' => (object)array(
                'name' => 'senior_age',
                'label' => !empty($data['senior_age']['label']) ? $data['senior_age']['label'] : __('Age restriction for senior price', 'event-integration'),
                'description' => !empty($data['senior_age']['description']) ? $data['senior_age']['description'] : __('Senior price is valid from this age.', 'event-integration'),
                'required' => !empty($data['senior_age']['required']),
                'hidden' => !empty($data['senior_age']['hidden']),
                'hidden_description' => !empty($data['senior_age']['hidden_description']),
            ),
            'age_group' => (object)array(
                'name' => 'age_group',
                'label' => !empty($data['age_group']['label']) ? $data['age_group']['label'] : __('Age group', 'event-integration'),
                'description' => !empty($data['age_group']['description']) ? $data['age_group']['description'] : __('Age group that the activity is addressed to.', 'event-integration'),
                'required' => !empty($data['age_group']['required']),
                'hidden' => !empty($data['age_group']['hidden']),
                'hidden_description' => !empty($data['age_group']['hidden_description']),
            ),
            'organizer' => (object)array(
                'name' => 'organizer',
                'label' => !empty($data['organizer']['label']) ? $data['organizer']['label'] : __('Organizer', 'event-integration'),
                'description' => !empty($data['organizer']['description']) ? $data['organizer']['description'] : __('Type name of organizer, select from suggestions. If your business is not available, please add an organizer to the description.', 'event-integration'),
                'required' => false,
                'hidden' => !empty($data['organizer']['hidden']),
                'hidden_description' => !empty($data['organizer']['hidden_description']),
            ),
            'location' => (object)array(
                'name' => 'location',
                'label' => !empty($data['location']['label']) ? $data['location']['label'] : __('Location', 'event-integration'),
                'description' => !empty($data['location']['description']) ? $data['location']['description'] : __('Type location name and select from suggestions. If the location is not available, please add an address in the description.', 'event-integration'),
                'required' => false,
                'hidden' => !empty($data['location']['hidden']),
                'hidden_description' => !empty($data['location']['hidden_description']),
            ),
            'accessibility' => (object)array(
                'name' => 'accessibility',
                'label' => !empty($data['accessibility']['label']) ? $data['accessibility']['label'] : __('Accessibility', 'event-integration'),
                'description' => !empty($data['accessibility']['description']) ? $data['accessibility']['description'] : __('Select which accessibility actions that exist for the event.', 'event-integration'),
                'required' => false,
                'hidden' => !empty($data['accessibility']['hidden']),
                'hidden_description' => !empty($data['accessibility']['hidden_description']),
            ),
            'event_categories' => (object)array(
                'name' => 'event_categories',
                'label' => !empty($data['event_categories']['label']) ? $data['event_categories']['label'] : __('Categories', 'event-integration'),
                'description' => !empty($data['event_categories']['description']) ? $data['event_categories']['description'] : __('Select appropriate categories for your event or activity. To select multiple categories, press Ctrl (Windows) / command (macOS) at the same time as you click on the categories.', 'event-integration'),
                'required' => !empty($data['event_categories']['required']),
                'hidden' => !empty($data['event_categories']['hidden']),
                'hidden_description' => !empty($data['event_categories']['hidden_description']),
            ),
            'event_tags' => (object)array(
                'name' => 'event_tags',
                'label' => !empty($data['event_tags']['label']) ? $data['event_tags']['label'] : __('Tags', 'event-integration'),
                'description' => !empty($data['event_tags']['description']) ? $data['event_tags']['description'] : __('Select appropriate tags for your event or activity. To select multiple tags, press Ctrl (Windows) / command (macOS) at the same time as you click on the tags.', 'event-integration'),
                'required' => !empty($data['event_tags']['required']),
                'hidden' => !empty($data['event_tags']['hidden']),
                'hidden_description' => !empty($data['event_tags']['hidden_description']),
            ),
            'image_input' => (object)array(
                'name' => 'image_input',
                'label' => !empty($data['image_input']['label']) ? $data['image_input']['label'] : __('Upload an image', 'event-integration'),
                'description' => !empty($data['image_input']['description']) ? $data['image_input']['description'] :
                    __('Keep in mind that the image may be cropped, so avoid text in the image.', 'event-integration') . '<br>' .
                    __('Images with identifiable persons are not accepted and will be replaced.', 'event-integration') . '<br>' .
                    __('You must also have the right to use and distribute the image.', 'event-integration'),
                'required' => !empty($data['image_input']['required']),
                'hidden' => !empty($data['image_input']['hidden']),
                'hidden_description' => !empty($data['image_input']['hidden_description']),
            ),
            'submitter_email' => (object)array(
                'name' => 'submitter_email',
                'label' => !empty($data['submitter_email']['label']) ? $data['submitter_email']['label'] : __('Email', 'event-integration'),
                'description' => !empty($data['submitter_email']['description']) ? $data['submitter_email']['description'] : __('Your email address.', 'event-integration'),
                'required' => !empty($data['submitter_email']['required']),
                'hidden' => !empty($data['submitter_email']['hidden']),
                'hidden_description' => !empty($data['submitter_email']['hidden_description']),
            ),
            'submitter_phone' => (object)array(
                'name' => 'submitter_phone',
                'label' => !empty($data['submitter_phone']['label']) ? $data['submitter_phone']['label'] : __('Phone number', 'event-integration'),
                'description' => !empty($data['submitter_phone']['description']) ? $data['submitter_phone']['description'] : __('Your phone number.', 'event-integration'),
                'required' => !empty($data['submitter_phone']['required']),
                'hidden' => !empty($data['submitter_phone']['hidden']),
                'hidden_description' => !empty($data['submitter_phone']['hidden_description']),
            ),
        );

        $fields['translations'] =  [
            'name' => __('Name', 'event-integration'),
            'streetAddress' => __('Street address', 'event-integration'),
            'postalCode' => __('Postal code', 'event-integration'),
            'city' => __('City', 'event-integration'),
            'phoneNumber' => __('Phone number', 'event-integration'),
            'email' => __('Email', 'event-integration'),
            'newOrganizer' => __('New organizer', 'event-integration'),
            'newLocation' => __('New location', 'event-integration'),
            'existingLocation' => __('Existing location', 'event-integration'),
            'existingOrganizer' => __('Existing organizer', 'event-integration'),
            'elevatorRamp' => __('Elevator/ramp', 'event-integration'),
            'accessibleToilet' => __('Accessible toilet', 'event-integration'),
            'identifiablePersons' => __('Are there identifiable persons on the image/images?', 'event-integration'),
            'acceptedCondition' => __('They have accepted that the image is used to promote this event and have been informed that after the image has been added to the database, it may appear in different channels to promote the event.', 'event-integration'),
            'recurring' => __('Recurring', 'event-integration')

        ]; 

        return $fields;
    }
}
