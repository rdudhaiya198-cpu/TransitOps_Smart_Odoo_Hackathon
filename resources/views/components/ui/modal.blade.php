@props([
'id' => null,
'title' => null,
'size' => 'modal-lg',
])

<div class="modal fade" id="{{ $id }}" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog {{ $size }} modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content app-modal-content">
            <div class="modal-header border-0">
                <h5 class="modal-title">{{ $title }}</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body pt-0">
                {{ $slot }}
            </div>

            @isset($footer)
            <div class="modal-footer border-0 pt-0">
                {{ $footer }}
            </div>
            @endisset
        </div>
    </div>
</div>