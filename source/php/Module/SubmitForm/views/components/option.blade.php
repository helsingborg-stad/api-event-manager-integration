@php
    $uid  = $uid ?? uniqid(); //60109ab01b6ef
    $uid2 = uniqid(); //60109ab01b6d6
    $uid3 = uniqid(); //60109ab01bcf4
    $uid4 = uniqid(); //60109ab01bcd8
@endphp

<div
    id="{{ $uid }}"
    class="c-option c-option__checkbox"
    role="checkbox"
>
    <input
        name="{{ $name }}"
        data-uid="{{ $uid2 }}"
        type="checkbox"
        class="c-option__checkbox--hidden-box"
        id="{{ $id }}"
        placeholder="{{ $label }}"
        value=""
        aria-checked="false"
    >

    <label for="{{ $id }}" class="c-option__checkbox--label">
        <span class="c-option__checkbox--label-box"></span>
        <span class="c-option__checkbox--label-text">{{ $label }}</span>
    </label>

    <div id="error_input_{{ $uid }}_message" class="c-option__input-invalid-message">
        <!-- icon.blade.php -->
        <i id="{{ $uid3 }}" class="c-icon c-icon--size-sm material-icons" data-uid="{{ $uid4 }}">
                error
        </i>
        <span class="errorText"></span>
    </div>
</div>