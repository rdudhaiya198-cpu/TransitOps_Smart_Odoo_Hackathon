@php
$user = $currentUser ?? auth()->user();
$displayName = $user?->name ?? 'Guest User';
$roleName = $user?->role ?? 'Operator';
$avatarInitials = collect(explode(' ', $displayName))->filter()->take(2)->map(fn ($part) => mb_substr($part, 0, 1))->join('');
@endphp

<header class="app-topbar">
    <nav class="navbar navbar-expand-lg navbar-dark px-3 px-xl-4">
        <div class="container-fluid gap-3 px-0">
            <button class="navbar-toggler border-0 app-topbar-action d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileSidebar" aria-controls="mobileSidebar" aria-label="Toggle navigation">
                <i class="bi bi-list"></i>
            </button>

            <div class="app-topbar-search d-flex align-items-center flex-grow-1">
                <x-ui.search-input :placeholder="$searchPlaceholder" class="w-100" />
            </div>

            <div class="d-flex align-items-center gap-2 gap-md-3 ms-auto">
                <a href="#" class="app-topbar-action" aria-label="Notifications">
                    <i class="bi bi-bell"></i>
                </a>

                <a href="#" class="app-topbar-action d-none d-md-inline-flex" aria-label="Apps">
                    <i class="bi bi-grid-3x3-gap"></i>
                </a>

                <span class="app-topbar-divider d-none d-md-inline-block"></span>

                <div class="dropdown">
                    <button class="btn btn-link text-decoration-none p-0 border-0 app-user-chip dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" type="button">
                        <span class="app-user-avatar" aria-hidden="true">{{ $avatarInitials ?: 'TO' }}</span>
                        <span class="d-none d-xl-flex flex-column align-items-start lh-sm">
                            <span class="app-user-name fw-semibold">{{ $displayName }}</span>
                            <span class="app-user-role">{{ $roleName }}</span>
                        </span>
                    </button>

                    <ul class="dropdown-menu dropdown-menu-end app-dropdown-menu shadow-lg mt-3">
                        <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i>Profile</a></li>
                        <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i>Settings</a></li>
                        <li><a class="dropdown-item" href="#"><i class="bi bi-life-preserver me-2"></i>Support</a></li>
                        <li>
                            <hr class="dropdown-divider border-secondary-subtle">
                        </li>
                        <li><a class="dropdown-item" href="#"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
</header>