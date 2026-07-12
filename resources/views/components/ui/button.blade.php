@props([
'variant' => 'primary',
'href' => null,
'type' => 'button',
'icon' => null,
'size' => null,
])

@php
$variantClass = $variant === 'ghost' ? 'btn-app-ghost' : 'btn-app-primary';
$sizeClass = $size ? 'btn-' . $size : '';
$classes = trim('btn rounded-pill ' . $variantClass . ' ' . $sizeClass);
@endphp

@if ($href)
<a href="{{ $href }}" {{ $attributes->merge(['class' => $classes]) }}>
    @if ($icon)
    <i class="bi bi-{{ $icon }} me-2"></i>
    @endif
    {{ $slot }}
</a>
@else
<button type="{{ $type }}" {{ $attributes->merge(['class' => $classes]) }}>
    @if ($icon)
    <i class="bi bi-{{ $icon }} me-2"></i>
    @endif
    {{ $slot }}
</button>
@endif