<nav {{ $attributes->merge(['aria-label' => 'Pagination']) }}>
    <ul class="pagination app-pagination justify-content-end mb-0">
        {{ $slot }}
    </ul>
</nav>