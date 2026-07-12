@props([
'striped' => false,
'hover' => true,
])

<div {{ $attributes->merge(['class' => 'app-table-wrapper']) }}>
    <table class="table app-table mb-0 {{ $striped ? 'table-striped' : '' }} {{ $hover ? 'table-hover' : '' }}">
        {{ $slot }}
    </table>
</div>