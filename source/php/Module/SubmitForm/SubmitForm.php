<?php

namespace EventManagerIntegration\Module;

class SubmitForm extends \Modularity\Module
{
    public $slug = 'event-submit';
    public $supports = array();

    public function init()
    {
        $this->nameSingular = __('Event form', 'event-integration');
        $this->namePlural = __('Event forms', 'event-integration');
        $this->description = __('Displays an event submit form', 'event-integration');
    }

    public function data() : array
    {
        $data = \EventManagerIntegration\Helper\SubmitEvent::geFields($this->ID);
        $data['user_groups'] = get_field('user_groups', $this->ID);
        $data['client_name'] = get_field('client_name', $this->ID);
        $data['classes'] = implode(' ', apply_filters('Modularity/Module/Classes', array('box', 'box-panel'), $this->post_type, $this->args));
        return $data;
    }

    public function template()
    {
        return "submitform.blade.php";
    }

    /**
     * Available "magic" methods for modules:
     * init()            What to do on initialization (if you must, use __construct with care, this will probably break stuff!!)
     * data()            Use to send data to view (return array)
     * style()           Enqueue style only when module is used on page
     * script            Enqueue script only when module is used on page
     * adminEnqueue()    Enqueue scripts for the module edit/add page in admin
     * template()        Return the view template (blade) the module should use when displayed
     */
}
