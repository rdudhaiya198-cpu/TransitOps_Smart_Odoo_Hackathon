@props([
'items' => [],
'compact' => false,
])

<div class="app-sidebar-nav">
    @foreach ($items as $item)
    @php
    $isActive = request()->routeIs($item['active'] ?? '') || request()->is($item['path'] ?? '');
    $linkClasses = 'app-sidebar-nav-link';

    if ($compact) {
    $linkClasses .= ' justify-content-center';
    }

    if ($isActive) {
    $linkClasses .= ' active';
    }
    @endphp

    <a href="{{ $item['url'] ?? '#' }}" class="{{ $linkClasses }}" @if(!empty($item['label'])) aria-label="{{ $item['label'] }}" @endif>
        <i class="bi bi-{{ $item['icon'] ?? 'dot' }}"></i>
        @unless ($compact)
        <span class="app-sidebar-nav-link-text">{{ $item['label'] ?? '' }}</span>
        @endunless
    </a>
    @endforeach
</div>