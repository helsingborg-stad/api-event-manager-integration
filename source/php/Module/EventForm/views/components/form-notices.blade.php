@notice([
    'type' => 'success',
    'message' => [
        'text' => $lang['validateMessage'],
    ],
    'icon' => [
        'name' => 'check',
        'size' => 'md',
        'color' => 'black'
    ],
    'classList' => [
        'c-form__notice-success',
        'u-margin__bottom--4',
    ],
    'attributeList' => [
        'aria-hidden' => 'true',
    ]
])
@endnotice

@notice([
    'type' => 'danger',
    'message' => [
        'text' => $lang['errorMessage'],
    ],
    'icon' => [
        'name' => 'report',
        'size' => 'md',
        'color' => 'black'
    ],
    'classList' => [
        'c-form__notice-failed',
        'u-margin__bottom--4'
    ],
    'attributeList' => [
        'aria-hidden' => 'true',
    ]
])
@endnotice