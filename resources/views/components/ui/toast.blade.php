@props([
'id' => null,
'title' => null,
'subtitle' => null,
'icon' => 'bell',
])

<div {{ $attributes->merge(['class' => 'toast app-toast']) }} id="{{ $id }}" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header bg-transparent text-app border-0">
        <i class="bi bi-{{ $icon }} me-2 text-app-muted"></i>
        <strong class="me-auto">{{ $title }}</strong>
        @if ($subtitle)
        <small class="text-app-muted">{{ $subtitle }}</small>
        @endif
        <button type="button" class="btn-close btn-close-white ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
        {{ $slot }}
    </div>
</div>