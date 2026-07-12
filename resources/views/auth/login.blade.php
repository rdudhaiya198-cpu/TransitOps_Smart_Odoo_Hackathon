@extends('layouts.guest')

@section('title', 'TransitOps | Secure Login')

@section('content')
<main class="auth-page d-flex align-items-center justify-content-center min-vh-100">
    <div class="auth-page-bg" aria-hidden="true"></div>

    <div class="container auth-page-container py-4 py-md-5">
        <x-auth-card>
            @if ($errors->any())
            <div class="alert alert-danger alert-dismissible fade show auth-alert" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                Please verify your credentials and try again.
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            @endif

            <form method="POST" action="{{ url('/login') }}" class="auth-form" novalidate>
                @csrf

                <x-auth-field
                    type="select"
                    label="Access Role"
                    name="role"
                    id="role"
                    icon="person-badge"
                    placeholder="Select access role"
                    :options="[
                            ['value' => 'fleet-manager', 'label' => 'Fleet Manager'],
                            ['value' => 'dispatcher', 'label' => 'Dispatcher'],
                            ['value' => 'safety-officer', 'label' => 'Safety Officer'],
                            ['value' => 'financial-analyst', 'label' => 'Financial Analyst'],
                            ['value' => 'driver', 'label' => 'Driver'],
                        ]"
                    :required="true" />

                <x-auth-field
                    type="email"
                    label="Work Email"
                    name="email"
                    id="email"
                    icon="envelope"
                    placeholder="name@transitops.com"
                    autocomplete="email"
                    :required="true" />

                <x-auth-field
                    type="password"
                    label="Password"
                    name="password"
                    id="password"
                    icon="lock"
                    placeholder="Password"
                    autocomplete="current-password"
                    :required="true"
                    :toggleable="true" />

                <div class="d-flex justify-content-between align-items-center gap-3 mb-4">
                    <div class="form-check auth-remember-check mb-0">
                        <input class="form-check-input" type="checkbox" value="1" id="remember_device" name="remember_device" {{ old('remember_device') ? 'checked' : '' }}>
                        <label class="form-check-label" for="remember_device">Remember this device for 30 days</label>
                    </div>

                    <a href="#" class="auth-forgot-link small text-decoration-none">Forgot password?</a>
                </div>

                <button type="submit" class="btn auth-submit-btn w-100 d-inline-flex align-items-center justify-content-center gap-2">
                    <span>Establish Connection</span>
                    <i class="bi bi-arrow-right"></i>
                </button>
            </form>

            <div class="auth-divider my-4"></div>

            <div class="auth-system-status d-flex align-items-center justify-content-between gap-3">
                <div class="d-flex align-items-center gap-2">
                    <span class="auth-status-dot"></span>
                    <span>Systems Operational</span>
                </div>
                <div class="auth-status-links text-end">
                    <a href="#">Privacy</a>
                    <a href="#">Legal</a>
                </div>
            </div>

            <div class="auth-footer text-center mt-4 pt-2">
                <div>Secure Encrypted Terminal Access</div>
                <div>TransitOps v4.2</div>
            </div>
        </x-auth-card>
    </div>
</main>
@endsection