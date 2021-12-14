@field([
    'id'            => $content->name,
    'type'          => 'text',
    'label'         => $content->label,
    'required'      =>  $content->required,
    'multiline'      => true,
    'attributeList' => [
        'type' => 'textarea',
        'name' => $content->name,
        'rows'          => '5',
    ],
])
@endfield
