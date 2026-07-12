@props([
'id' => null,
'title' => 'Confirm Action',
'message' => 'Are you sure you want to continue?',
'confirmLabel' => 'Confirm',
'cancelLabel' => 'Cancel',
'variant' => 'danger',
])

<div class="modal fade app-confirmation-dialog" id="{{ $id }}" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content app-modal-content">
            <div class="modal-header border-0">
                <h5 class="modal-title">{{ $title }}</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body pt-0">
                <p class="text-app-muted mb-0">{{ $message }}</p>
                {{ $slot }}
            </div>

            <div class="modal-footer border-0 pt-0">
                <button type="button" class="btn btn-app-ghost rounded-pill" data-bs-dismiss="modal">{{ $cancelLabel }}</button>
                <button type="button" class="btn rounded-pill btn-{{ $variant }}">{{ $confirmLabel }}</button>
            </div>
        </div>
    </div>
</div>