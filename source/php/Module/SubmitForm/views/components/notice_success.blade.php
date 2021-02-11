{{-- Notice Success --}}
<div class="form-group submit-success hidden">
    @notice([
        'classList' => [
            'u-display--none'
        ],
        'attributeList' => [
            'event-submit__success' => ''
        ],
        'type' => 'success',
        'message' => [
            'text' => '#@ event-submit__success__text @#',
            'size' => 'sm'
        ],
        'icon' => [
            'name' => 'check',
            'size' => 'md',
            'color' => 'white'
        ]
    ])
    @endnotice
</div>