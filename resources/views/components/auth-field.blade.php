@props([
'type' => 'text',
'label' => null,
'name' => null,
'icon' => null,
'placeholder' => null,
'autocomplete' => null,
'required' => false,
'options' => [],
'value' => null,
'toggleable' => false,
'ariaLabel' => null,
])

@php
$fieldId = $attributes->get('id', $name);
$isInvalid = $name && $errors->has($name);
$controlClass = $type === 'select' ? 'form-select auth-control' : 'form-control auth-control';
$controlClass .= $isInvalid ? ' is-invalid' : '';
$currentValue = $value ?? old($name);
$fieldName = $name ?? $fieldId;
@endphp

<div class="auth-field mb-3">
    @if ($type === 'select')
    <div class="form-floating auth-floating-field">
        <span class="auth-input-icon"><i class="bi bi-{{ $icon }}"></i></span>
        <select
            id="{{ $fieldId }}"
            name="{{ $fieldName }}"
            class="{{ $controlClass }} auth-control-select"
            aria-label="{{ $ariaLabel ?? $label }}"
            {{ $required ? 'required' : '' }}>
            <option value="" selected disabled>{{ $placeholder ?? 'Select an option' }}</option>
            @foreach ($options as $option)
            @php
            $optionValue = is_array($option) ? ($option['value'] ?? '') : $option;
            $optionLabel = is_array($option) ? ($option['label'] ?? $optionValue) : $option;
            @endphp
            <option value="{{ $optionValue }}" @selected((string) $currentValue===(string) $optionValue)>{{ $optionLabel }}</option>
            @endforeach
        </select>
        <label for="{{ $fieldId }}">{{ $label }}</label>
    </div>
    @else
    <div class="form-floating auth-floating-field {{ $toggleable ? 'auth-floating-field-password' : '' }}">
        @if ($icon)
        <span class="auth-input-icon"><i class="bi bi-{{ $icon }}"></i></span>
        @endif

        <input
            type="{{ $type }}"
            id="{{ $fieldId }}"
            name="{{ $fieldName }}"
            value="{{ $type === 'password' ? '' : $currentValue }}"
            class="{{ $controlClass }} {{ $toggleable ? 'auth-password-input' : '' }}"
            placeholder="{{ $placeholder ?? $label }}"
            autocomplete="{{ $autocomplete ?? 'off' }}"
            aria-label="{{ $ariaLabel ?? $label }}"
            {{ $required ? 'required' : '' }}>
        <label for="{{ $fieldId }}">{{ $label }}</label>

        @if ($toggleable)
        <button
            type="button"
            class="btn auth-password-toggle"
            data-auth-password-toggle
            data-target="#{{ $fieldId }}"
            aria-label="Toggle password visibility">
            <i class="bi bi-eye" data-auth-password-icon></i>
        </button>
        @endif
    </div>
    @endif

    @error($name)
    <div class="invalid-feedback d-block">{{ $message }}</div>
    @enderror
</div>