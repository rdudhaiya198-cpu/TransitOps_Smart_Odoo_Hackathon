@props([
'title' => null,
'value' => null,
'icon' => null,
'change' => null,
'changeLabel' => null,
'changeTone' => 'positive',
])

<div {{ $attributes->merge(['class' => 'card app-card h-100']) }}>
    <div class="card-body app-card-body app-metric-card">
        <div class="d-flex align-items-start justify-content-between gap-3">
            <div>
                @if ($title)
                <div class="text-app-muted small text-uppercase fw-semibold letter-spacing-1">{{ $title }}</div>
                @endif

                @if ($value)
                <div class="app-metric-card-value mt-2">{{ $value }}</div>
                @endif
            </div>

            @if ($icon)
            <div class="app-metric-card-icon">
                <i class="bi bi-{{ $icon }}"></i>
            </div>
            @endif
        </div>

        @if ($change || $changeLabel)
        <div class="small {{ $changeTone === 'negative' ? 'app-metric-card-change-negative' : 'app-metric-card-change-positive' }}">
            @if ($change)
            <span class="fw-semibold me-1">{{ $change }}</span>
            @endif

            @if ($changeLabel)
            <span>{{ $changeLabel }}</span>
            @endif
        </div>
        @endif

        {{ $slot }}
    </div>
</div>