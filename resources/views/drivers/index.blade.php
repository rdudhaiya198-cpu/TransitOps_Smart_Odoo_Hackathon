@extends('layouts.app')

@section('title', 'Driver Management')
@section('search_placeholder', 'Search by driver name, license number or contact...')

@section('content')
<div class="container-fluid px-0" id="driver-management-page" data-driver-management-root>
    <div class="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3 mb-4">
        <div>
            <h1 class="display-5 mb-2">Driver Management</h1>
            <p class="text-app-muted mb-0">Manage driver profiles, licenses and operational availability.</p>
        </div>

        <x-ui.button type="button" icon="person-plus" class="align-self-start align-self-lg-center" data-driver-create-button>
            Register Driver
        </x-ui.button>
    </div>

    <x-ui.card class="mb-4">
        <div class="row g-3 align-items-end">
            <div class="col-12 col-xl-5">
                <label class="form-label small text-app-muted text-uppercase fw-semibold letter-spacing-1">Search</label>
                <x-ui.search-input
                    name="driver_management_search"
                    placeholder="Search by driver name, license number or contact..."
                    aria-label="Search by driver name, license number or contact..."
                    class="w-100" />
            </div>

            <div class="col-12 col-xl-7">
                <div class="d-flex flex-column flex-xxl-row gap-3 justify-content-xxl-end align-items-stretch align-items-xxl-end">
                    <div class="flex-grow-1 flex-xxl-grow-0">
                        <label class="form-label small text-app-muted text-uppercase fw-semibold letter-spacing-1">License Category</label>
                        <x-ui.dropdown align="start" class="w-100">
                            <x-slot:trigger>
                                <x-ui.button variant="ghost" type="button" class="w-100 d-flex align-items-center justify-content-between" aria-label="Choose license category" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span class="d-inline-flex align-items-center gap-2">
                                        <i class="bi bi-card-heading"></i>
                                        <span data-filter-label="licenseCategory">All categories</span>
                                    </span>
                                    <i class="bi bi-chevron-down ms-2"></i>
                                </x-ui.button>
                            </x-slot:trigger>

                            <x-slot:menu>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="licenseCategory" data-filter-value="all"><span>All categories</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="licenseCategory" data-filter-value="LMV"><span>LMV</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="licenseCategory" data-filter-value="HMV"><span>HMV</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="licenseCategory" data-filter-value="PSV"><span>PSV</span><i class="bi bi-check2 opacity-0"></i></button></li>
                            </x-slot:menu>
                        </x-ui.dropdown>
                    </div>

                    <div class="flex-grow-1 flex-xxl-grow-0">
                        <label class="form-label small text-app-muted text-uppercase fw-semibold letter-spacing-1">Driver Status</label>
                        <x-ui.dropdown align="start" class="w-100">
                            <x-slot:trigger>
                                <x-ui.button variant="ghost" type="button" class="w-100 d-flex align-items-center justify-content-between" aria-label="Choose driver status" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span class="d-inline-flex align-items-center gap-2">
                                        <i class="bi bi-person-badge"></i>
                                        <span data-filter-label="status">All statuses</span>
                                    </span>
                                    <i class="bi bi-chevron-down ms-2"></i>
                                </x-ui.button>
                            </x-slot:trigger>

                            <x-slot:menu>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="status" data-filter-value="all"><span>All statuses</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="status" data-filter-value="Available"><span>Available</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="status" data-filter-value="On Trip"><span>On Trip</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="status" data-filter-value="Off Duty"><span>Off Duty</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="status" data-filter-value="Suspended"><span>Suspended</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="status" data-filter-value="Expired"><span>Expired</span><i class="bi bi-check2 opacity-0"></i></button></li>
                            </x-slot:menu>
                        </x-ui.dropdown>
                    </div>

                    <div class="flex-grow-1 flex-xxl-grow-0">
                        <label class="form-label small text-app-muted text-uppercase fw-semibold letter-spacing-1">Safety Score</label>
                        <x-ui.dropdown align="start" class="w-100">
                            <x-slot:trigger>
                                <x-ui.button variant="ghost" type="button" class="w-100 d-flex align-items-center justify-content-between" aria-label="Choose safety score" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span class="d-inline-flex align-items-center gap-2">
                                        <i class="bi bi-shield-check"></i>
                                        <span data-filter-label="safetyScore">All scores</span>
                                    </span>
                                    <i class="bi bi-chevron-down ms-2"></i>
                                </x-ui.button>
                            </x-slot:trigger>

                            <x-slot:menu>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="safetyScore" data-filter-value="all"><span>All scores</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="safetyScore" data-filter-value="excellent"><span>Excellent (95-100)</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="safetyScore" data-filter-value="good"><span>Good (80-94)</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="safetyScore" data-filter-value="average"><span>Average (60-79)</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="safetyScore" data-filter-value="poor"><span>Poor (Below 60)</span><i class="bi bi-check2 opacity-0"></i></button></li>
                            </x-slot:menu>
                        </x-ui.dropdown>
                    </div>

                    <div class="d-flex flex-column flex-sm-row gap-2">
                        <x-ui.button variant="ghost" type="button" icon="arrow-counterclockwise" class="w-100 w-sm-auto" data-driver-reset-filters>
                            Reset
                        </x-ui.button>
                        <x-ui.button type="button" icon="funnel" class="w-100 w-sm-auto" data-driver-apply-filters>
                            Apply
                        </x-ui.button>
                    </div>
                </div>
            </div>
        </div>
    </x-ui.card>

    <div class="row g-4 row-cols-1 row-cols-md-2 row-cols-xl-4 mb-4">
        <div class="col">
            <x-ui.metric-card title="Total Drivers" icon="people" class="h-100" data-summary-card="total">
                <div class="app-metric-card-value mt-2" data-summary-value>
                    <div class="placeholder-glow"><span class="placeholder col-4"></span></div>
                </div>
            </x-ui.metric-card>
        </div>

        <div class="col">
            <x-ui.metric-card title="Available" icon="person-check" class="h-100" data-summary-card="available">
                <div class="app-metric-card-value mt-2" data-summary-value>
                    <div class="placeholder-glow"><span class="placeholder col-4"></span></div>
                </div>
            </x-ui.metric-card>
        </div>

        <div class="col">
            <x-ui.metric-card title="On Trip" icon="truck" class="h-100" data-summary-card="onTrip">
                <div class="app-metric-card-value mt-2" data-summary-value>
                    <div class="placeholder-glow"><span class="placeholder col-4"></span></div>
                </div>
            </x-ui.metric-card>
        </div>

        <div class="col">
            <x-ui.metric-card title="Suspended" icon="person-x" class="h-100" data-summary-card="suspended">
                <div class="app-metric-card-value mt-2" data-summary-value>
                    <div class="placeholder-glow"><span class="placeholder col-4"></span></div>
                </div>
            </x-ui.metric-card>
        </div>
    </div>

    <x-ui.card>
        <x-slot:header>
            <div class="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3 w-100">
                <div>
                    <div class="h5 mb-1">Driver Records</div>
                    <div class="text-app-muted small">View, filter and manage registered drivers.</div>
                </div>

                <div class="text-app-muted small text-lg-end">
                    <div class="fw-semibold text-app" data-driver-results-count>Loading drivers...</div>
                    <div aria-live="polite" data-driver-page-info>Preparing driver data...</div>
                </div>
            </div>
        </x-slot:header>

        <div class="d-none app-empty-state text-center" data-driver-empty>
            <div class="mb-3 text-app-muted fs-1">
                <i class="bi bi-people"></i>
            </div>
            <div class="h5 mb-2" data-driver-empty-title>No drivers found.</div>
            <div class="text-app-muted small mb-3" data-driver-empty-message>Use Register Driver to add your first driver.</div>
            <x-ui.button type="button" icon="person-plus" data-driver-empty-action>
                Register Driver
            </x-ui.button>
        </div>

        <div class="d-none app-empty-state text-center" data-driver-filter-empty>
            <div class="mb-3 text-app-muted fs-1">
                <i class="bi bi-people"></i>
            </div>
            <div class="h5 mb-2">No drivers found.</div>
            <div class="text-app-muted small mb-3">Adjust the search or filters and try again.</div>
            <x-ui.button variant="ghost" type="button" icon="arrow-counterclockwise" data-driver-filter-reset>
                Reset Filters
            </x-ui.button>
        </div>

        <x-ui.data-table striped hover data-driver-table>
            <thead>
                <tr>
                    <th scope="col">
                        <button type="button" class="btn btn-link p-0 text-decoration-none text-app-muted fw-semibold d-inline-flex align-items-center gap-2" data-sort-key="name" aria-label="Sort by driver name">
                            <span>Driver Name</span>
                            <i class="bi bi-arrow-down-up" data-sort-icon="name"></i>
                        </button>
                    </th>
                    <th scope="col">License Number</th>
                    <th scope="col">Category</th>
                    <th scope="col">
                        <button type="button" class="btn btn-link p-0 text-decoration-none text-app-muted fw-semibold d-inline-flex align-items-center gap-2" data-sort-key="licenseExpiryDate" aria-label="Sort by expiry date">
                            <span>Expiry Date</span>
                            <i class="bi bi-arrow-down-up" data-sort-icon="licenseExpiryDate"></i>
                        </button>
                    </th>
                    <th scope="col">
                        <button type="button" class="btn btn-link p-0 text-decoration-none text-app-muted fw-semibold d-inline-flex align-items-center gap-2" data-sort-key="safetyScore" aria-label="Sort by safety score">
                            <span>Safety Score</span>
                            <i class="bi bi-arrow-down-up" data-sort-icon="safetyScore"></i>
                        </button>
                    </th>
                    <th scope="col">Contact Number</th>
                    <th scope="col">
                        <button type="button" class="btn btn-link p-0 text-decoration-none text-app-muted fw-semibold d-inline-flex align-items-center gap-2" data-sort-key="status" aria-label="Sort by status">
                            <span>Status</span>
                            <i class="bi bi-arrow-down-up" data-sort-icon="status"></i>
                        </button>
                    </th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody data-driver-table-body>
                <tr data-loading-row>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-8"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-6"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-7"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-5"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-6"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-5"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-8"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-7"></span></div>
                    </td>
                </tr>
                <tr data-loading-row>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-8"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-6"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-7"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-5"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-6"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-5"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-8"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-7"></span></div>
                    </td>
                </tr>
                <tr data-loading-row>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-8"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-6"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-7"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-5"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-6"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-5"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-8"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-7"></span></div>
                    </td>
                </tr>
                <tr data-loading-row>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-8"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-6"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-7"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-5"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-6"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-5"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-8"></span></div>
                    </td>
                    <td>
                        <div class="placeholder-glow"><span class="placeholder col-7"></span></div>
                    </td>
                </tr>
            </tbody>
        </x-ui.data-table>

        <template id="driver-row-template">
            <tr>
                <td class="fw-semibold" data-field="name"></td>
                <td class="text-nowrap" data-field="licenseNumber"></td>
                <td data-field="licenseCategory"></td>
                <td class="text-nowrap" data-field="licenseExpiryDate"></td>
                <td data-field="safetyScore"></td>
                <td class="text-nowrap" data-field="contactNumber"></td>
                <td>
                    <x-ui.status-badge tone="info" icon="person-badge" data-status-badge>
                        <span data-field="status"></span>
                    </x-ui.status-badge>
                </td>
                <td>
                    <div class="d-flex flex-wrap gap-2">
                        <button type="button" class="btn btn-sm btn-app-ghost rounded-pill" data-driver-action="view" aria-label="View driver">
                            <i class="bi bi-eye me-1"></i><span class="d-none d-sm-inline">View</span>
                        </button>
                        <button type="button" class="btn btn-sm btn-app-ghost rounded-pill" data-driver-action="edit" aria-label="Edit driver">
                            <i class="bi bi-pencil-square me-1"></i><span class="d-none d-sm-inline">Edit</span>
                        </button>
                        <button type="button" class="btn btn-sm btn-app-ghost rounded-pill text-danger" data-driver-action="delete" aria-label="Delete driver">
                            <i class="bi bi-trash me-1"></i><span class="d-none d-sm-inline">Delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        </template>

        <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mt-4">
            <div class="text-app-muted small" data-driver-page-summary>Loading page summary...</div>
            <x-ui.pagination data-driver-pagination aria-label="Driver management pagination"></x-ui.pagination>
        </div>
    </x-ui.card>

    <x-ui.modal id="driverFormModal" title="Register Driver" size="modal-lg modal-fullscreen-sm-down">
        <div class="d-flex flex-column gap-1 mb-3">
            <div class="text-app-muted small" data-driver-modal-subtitle>Add a new driver profile.</div>
        </div>

        <form id="driver-form" class="needs-validation" novalidate>
            <input type="hidden" name="id" id="driver-id">
            <div class="row g-3">
                <div class="col-12 col-md-6">
                    <label for="driver-name" class="form-label small text-app-muted fw-semibold">Driver Name</label>
                    <input type="text" class="form-control" id="driver-name" name="driver_name" required maxlength="80" autocomplete="off">
                    <div class="invalid-feedback" data-field-error="driver_name"></div>
                </div>

                <div class="col-12 col-md-6">
                    <label for="driver-license-number" class="form-label small text-app-muted fw-semibold">License Number</label>
                    <input type="text" class="form-control" id="driver-license-number" name="license_number" required maxlength="24" autocomplete="off">
                    <div class="invalid-feedback" data-field-error="license_number"></div>
                </div>

                <div class="col-12 col-md-6">
                    <label for="driver-license-category" class="form-label small text-app-muted fw-semibold">License Category</label>
                    <select class="form-select" id="driver-license-category" name="license_category" required>
                        <option value="" selected disabled>Select category</option>
                        <option value="LMV">LMV</option>
                        <option value="HMV">HMV</option>
                        <option value="PSV">PSV</option>
                    </select>
                    <div class="invalid-feedback" data-field-error="license_category"></div>
                </div>

                <div class="col-12 col-md-6">
                    <label for="driver-status" class="form-label small text-app-muted fw-semibold">Status</label>
                    <select class="form-select" id="driver-status" name="status" required>
                        <option value="Available">Available</option>
                        <option value="On Trip">On Trip</option>
                        <option value="Off Duty">Off Duty</option>
                        <option value="Suspended">Suspended</option>
                    </select>
                    <div class="invalid-feedback" data-field-error="status"></div>
                </div>

                <div class="col-12 col-md-6">
                    <label for="driver-license-expiry-date" class="form-label small text-app-muted fw-semibold">License Expiry Date</label>
                    <input type="date" class="form-control" id="driver-license-expiry-date" name="license_expiry_date" required>
                    <div class="invalid-feedback" data-field-error="license_expiry_date"></div>
                </div>

                <div class="col-12 col-md-6">
                    <label for="driver-contact-number" class="form-label small text-app-muted fw-semibold">Contact Number</label>
                    <input type="text" class="form-control" id="driver-contact-number" name="contact_number" required inputmode="numeric" autocomplete="off">
                    <div class="invalid-feedback" data-field-error="contact_number"></div>
                </div>

                <div class="col-12 col-md-6">
                    <label for="driver-safety-score" class="form-label small text-app-muted fw-semibold">Safety Score</label>
                    <input type="number" class="form-control" id="driver-safety-score" name="safety_score" min="0" max="100" step="1" required>
                    <div class="invalid-feedback" data-field-error="safety_score"></div>
                </div>
            </div>
        </form>

        <x-slot:footer>
            <x-ui.button variant="ghost" type="button" data-bs-dismiss="modal">
                Cancel
            </x-ui.button>
            <x-ui.button type="submit" form="driver-form" icon="check2" data-driver-save-button>
                Save Driver
            </x-ui.button>
        </x-slot:footer>
    </x-ui.modal>

    <x-ui.confirmation-dialog
        id="driverDeleteModal"
        title="Delete Driver"
        message="Are you sure you want to remove this driver?"
        confirmLabel="Delete"
        variant="danger">
    </x-ui.confirmation-dialog>
</div>

@push('scripts')
<script src="{{ asset('js/driver-management.js') }}"></script>
@endpush
@endsection