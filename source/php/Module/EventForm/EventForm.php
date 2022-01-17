<?php

namespace EventManagerIntegration\Module;

class EventForm extends \Modularity\Module
{
    public $slug = 'event-form';
    public $supports = array();
    public $isBlockCompatible = false;

    private $validator;
    private $schemaPath = EVENTMANAGERINTEGRATION_PATH . 'source/php/Module/EventForm/assets/schemas/%s.json';

    public function init()
    {
        $this->nameSingular = __('Event form v2', 'event-integration'); // TODO: Remove v2!
        $this->namePlural = __('Event forms v2', 'event-integration'); // TODO: Remove v2!
        $this->description = __('Displays submit event form', 'event-integration');
        $this->validator = new \JsonSchema\Validator;
    }

    public function data(): array
    {
        $data = [];

        $data['fields'] = \EventManagerIntegration\Module\EventForm\Fields::get($this->id);

        $this->validateFields($data['fields']);

        $data['classes'] = implode(' ', apply_filters('Modularity/Module/Classes', array(), $this->post_type, $this->args));
        return $data;
    }

    public function template()
    {
        return "mod-event-form.blade.php";
    }

    private function validateFields(array $fields)
    {
        foreach ($fields as $field) {
            if (!empty($field['fields'])) {
                $this->validateFields($field['fields']);
            }
            $schemaFilePath = sprintf($this->schemaPath, $field['type']);
            if (!file_exists($schemaFilePath)) {
                continue;
            }
            $this->validator->validate(json_decode(json_encode($field)), (object)['$ref' => 'file://' . realpath($schemaFilePath)]);
            if (!$this->validator->isValid()) {
                echo "JSON does not validate. Violations:\n";
                foreach ($this->validator->getErrors() as $error) {
                    printf("[%s] %s\n", $error['property'], $error['message']);
                }
            }
        }
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
