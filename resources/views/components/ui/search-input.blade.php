@props([
'placeholder' => 'Search...',
'name' => 'search',
'value' => null,
])

<div {{ $attributes->merge(['class' => 'input-group']) }}>
    <span class="input-group-text bg-transparent border-0 text-app-muted ps-0 pe-2">
        <i class="bi bi-search"></i>
    </span>
    <input
        type="search"
        name="{{ $name }}"
        value="{{ $value ?? request($name) }}"
        class="form-control app-search-input border-0"
        placeholder="{{ $placeholder }}"
        autocomplete="off">
</div>