<?php

namespace EventManagerIntegration\Module\Event\TemplateController;

class ListTemplate
{
    protected $module;
    protected $args;

    public $data = array();

    public function __construct($module, array $args, $data)
    {
        $this->module = $module;
        $this->args = $args;
        $this->data = $data;
    }
}
