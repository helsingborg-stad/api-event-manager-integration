<?php

namespace EventManagerIntegration\Module\Event\TemplateController;

class IndexTemplate
{
    protected $module;
    protected $args;

    public $data = array();

    public function __construct($module, array $args, $data)
    {
        $this->module = $module;
        $this->args = $args;
        $this->data = $data;


        $this->data['gridColumn'] = $this->gridColumn();
        $this->data['imageRatio'] = (isset($this->data['mod_event_image_ratio'])) ? str_replace('-', ':', $this->data['mod_event_image_ratio']) : '1:1';
        $this->data['imageDimensions'] = $this->imageDimensions(400);

        $this->data['classes'] = !empty($this->args) ? implode(' ', apply_filters('Modularity/Module/Classes', array(), 'mod-event', $this->args)) : '';
    }

    public function imageDimensions($width = 400, $ratio = array(1, 1))
    {
        $ratio = (isset($this->data['mod_event_image_ratio']) && count(explode('-', $this->data['mod_event_image_ratio'])) == 2) ? explode('-', $this->data['mod_event_image_ratio']) : $ratio;


        if (!is_array($ratio) || empty($ratio) || !isset($ratio[0]) || !isset($ratio[1]))
        {
            return array('width' => $width, 'height' => $width);
        }

        $dimensions = array();
        $dimensions['width'] = $width;
        $dimensions['height'] =  ($width / $ratio[0]) * ($ratio[1]);

        return $dimensions;
    }

    public function gridColumn()
    {
        $columns = apply_filters('/EventManagerIntegration/Module/Event/TemplateController/IndexTemplate/Grid',
            array(
                '1' => 'grid-xs-12',
                '2' => 'grid-xs-12 grid-md-6',
                '3' => 'grid-xs-12 grid-md-4',
                '4' => 'grid-xs-12 grid-md-6 grid-lg-3'
            ), $this->data, $this->args);

        if (isset($this->data['mod_event_columns']) && isset($columns[$this->data['mod_event_columns']])) {
            return $columns[$this->data['mod_event_columns']];
        }

        return $columns['3'];
    }
}
