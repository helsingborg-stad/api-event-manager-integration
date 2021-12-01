@textarea([
    'id'            => $content->name,
    'type'          => 'text',
    'label'         => $content->label,
    'required'      =>  $content->required,
    'rows'          => '5',
    'attributeList' => [
        'type' => 'textarea',
        'name' => $content->name,
    ],
])
@endtextarea
