@props([
'align' => 'end',
])

<div {{ $attributes->merge(['class' => 'dropdown']) }}>
    @isset($trigger)
    {{ $trigger }}
    @endisset

    @isset($menu)
    <ul class="dropdown-menu dropdown-menu-{{ $align }} app-dropdown-menu">
        {{ $menu }}
    </ul>
    @endisset
</div>