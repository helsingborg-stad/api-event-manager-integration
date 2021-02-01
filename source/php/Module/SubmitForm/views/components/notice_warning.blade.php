{{-- Notice Warning--}}
<div class="form-group submit-error hidden">
    @notice([
        'classList' => [
            'u-display--none'
        ],
        'attributeList' => [
            'event-submit__error' => ''
        ],
        'type' => 'danger',
        'message' => [
            'text' => '#@ event-submit__error__text @#',
            'size' => 'sm'
        ],
        'icon' => [
            'name' => 'report',
            'size' => 'md',
            'color' => 'white'
        ]
    ])
    @endnotice
</div>