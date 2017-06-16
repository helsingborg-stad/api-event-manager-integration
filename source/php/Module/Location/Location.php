<?php

namespace EventManagerIntegration\Module;

class Location extends \Modularity\Module
{
    public $slug = 'location';
    public $supports = array();

    public function init()
    {
        $this->nameSingular = __('Location', 'modularity');
        $this->namePlural = __('Locations', 'modularity');
        $this->description = __('Displays a specific location', 'modularity');
    }

    public function data() : array
    {
        $data = array();
        $data['location'] = get_field('location_module', $this->ID);
        $data['classes'] = implode(' ', apply_filters('Modularity/Module/Classes', array('box', 'box-panel'), $this->post_type, $this->args));
        return $data;
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
