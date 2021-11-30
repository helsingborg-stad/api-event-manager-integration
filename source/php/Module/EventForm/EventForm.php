<?php

namespace EventManagerIntegration\Module;

class EventForm extends \Modularity\Module
{
    public $slug = 'event-form';
    public $supports = array();
    public $isBlockCompatible = false;

    public function init()
    {
        $this->nameSingular = __('Event form v2', 'event-integration'); // TODO: Remove v2!
        $this->namePlural = __('Event forms', 'event-integration');
        $this->description = __('Displays submit event form', 'event-integration');
    }

    public function data(): array
    {
        $data = [];
        $data['classes'] = implode(' ', apply_filters('Modularity/Module/Classes', array(), $this->post_type, $this->args));
        return $data;
    }

    public function template()
    {
        return "event-form.blade.php";
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
