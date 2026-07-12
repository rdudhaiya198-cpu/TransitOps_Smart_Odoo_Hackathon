@props([
'title' => null,
'subtitle' => null,
])

<div {{ $attributes->merge(['class' => 'card app-card']) }}>
    @if ($title || $subtitle || isset($header))
    <div class="card-header app-card-header d-flex align-items-start justify-content-between gap-3">
        <div>
            @if ($title)
            <div class="h5 mb-1">{{ $title }}</div>
            @endif

            @if ($subtitle)
            <div class="text-app-muted small">{{ $subtitle }}</div>
            @endif
        </div>

        @isset($header)
        <div>{{ $header }}</div>
        @endisset
    </div>
    @endif

    <div class="card-body app-card-body">
        {{ $slot }}
    </div>

    @isset($footer)
    <div class="card-footer app-card-footer">
        {{ $footer }}
    </div>
    @endisset
</div>