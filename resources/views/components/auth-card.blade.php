@props([
'icon' => 'truck',
'brand' => 'TransitOps',
'subtitle' => 'Fleet Management Command Center',
'title' => 'Secure Login',
'description' => 'Enter your credentials to access the fleet dashboard.',
])

<div class="auth-panel mx-auto">
    <div class="auth-brand text-center mb-4 mb-md-5">
        <div class="auth-brand-icon mb-3">
            <i class="bi bi-{{ $icon }}"></i>
        </div>
        <h1 class="auth-brand-title mb-2">{{ $brand }}</h1>
        <div class="auth-brand-subtitle">{{ $subtitle }}</div>
    </div>

    <div class="card auth-card shadow-lg border-0">
        <div class="card-body auth-card-body">
            <div class="text-center mb-4">
                <h2 class="auth-card-title mb-2">{{ $title }}</h2>
                <p class="auth-card-description mb-0">{{ $description }}</p>
            </div>

            {{ $slot }}
        </div>
    </div>
</div>