@php
$primaryNav = [
['label' => 'Dashboard', 'icon' => 'speedometer2', 'url' => '#', 'active' => 'dashboard*', 'path' => 'dashboard*'],
['label' => 'Fleet Registry', 'icon' => 'truck-front', 'url' => '#', 'active' => 'fleet-registry*', 'path' => 'fleet-registry*'],
['label' => 'Drivers', 'icon' => 'person-badge', 'url' => '#', 'active' => 'drivers*', 'path' => 'drivers*'],
['label' => 'Trips', 'icon' => 'signpost-split', 'url' => '#', 'active' => 'trips*', 'path' => 'trips*'],
['label' => 'Maintenance', 'icon' => 'tools', 'url' => '#', 'active' => 'maintenance*', 'path' => 'maintenance*'],
['label' => 'Fuel & Expenses', 'icon' => 'fuel-pump', 'url' => '#', 'active' => 'expenses*', 'path' => 'expenses*'],
['label' => 'Analytics', 'icon' => 'graph-up', 'url' => '#', 'active' => 'analytics*', 'path' => 'analytics*'],
];

$supportNav = [
['label' => 'Settings', 'icon' => 'gear', 'url' => '#', 'active' => 'settings*', 'path' => 'settings*'],
['label' => 'Support', 'icon' => 'life-preserver', 'url' => '#', 'active' => 'support*', 'path' => 'support*'],
['label' => 'Requirements', 'icon' => 'clipboard-check', 'url' => '#', 'active' => 'requirements*', 'path' => 'requirements*'],
];
@endphp

<aside class="app-sidebar d-none d-lg-flex flex-column">
    <div class="app-sidebar-brand">
        <div class="app-sidebar-brand-title">TransitOps</div>
        <div class="app-sidebar-brand-subtitle">Fleet Management</div>
    </div>

    <div class="app-sidebar-section-title">Navigation</div>
    @include('partials.sidebar-nav', ['items' => $primaryNav])

    <div class="app-sidebar-footer">
        <a href="#" class="btn btn-app-primary rounded-pill mb-3">
            <i class="bi bi-plus-lg me-2"></i> New Dispatch
        </a>

        @include('partials.sidebar-nav', ['items' => $supportNav])

        <div class="app-sidebar-footer-copy text-app-muted small mt-3">
            Dark modern operations workspace.
        </div>
    </div>
</aside>

<div class="offcanvas offcanvas-start app-sidebar d-lg-none" tabindex="-1" id="mobileSidebar" aria-labelledby="mobileSidebarLabel">
    <div class="offcanvas-header app-sidebar-brand">
        <div>
            <div class="app-sidebar-brand-title" id="mobileSidebarLabel">TransitOps</div>
            <div class="app-sidebar-brand-subtitle">Fleet Management</div>
        </div>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>

    <div class="offcanvas-body d-flex flex-column p-0">
        <div class="app-sidebar-section-title">Navigation</div>
        @include('partials.sidebar-nav', ['items' => $primaryNav])

        <div class="app-sidebar-footer mt-auto">
            <a href="#" class="btn btn-app-primary rounded-pill mb-3">
                <i class="bi bi-plus-lg me-2"></i> New Dispatch
            </a>

            @include('partials.sidebar-nav', ['items' => $supportNav])
        </div>
    </div>
</div>