@extends('layouts.app')

@section('title', 'Vehicle Registry')
@section('search_placeholder', 'Search by registration number, model or vehicle type...')

@section('content')
<div class="container-fluid px-0" id="vehicle-registry-page" data-vehicle-registry-root>
    <div class="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3 mb-4">
        <div>
            <h1 class="display-5 mb-2">Vehicle Registry</h1>
            <p class="text-app-muted mb-0">Manage fleet assets, registrations and operational availability.</p>
        </div>

        <x-ui.button type="button" icon="plus-lg" class="align-self-start align-self-lg-center" data-vehicle-create-button>
            Register Vehicle
        </x-ui.button>
    </div>

    <x-ui.card class="mb-4">
        <div class="row g-3 align-items-end">
            <div class="col-12 col-xl-5">
                <label class="form-label small text-app-muted text-uppercase fw-semibold letter-spacing-1">Search</label>
                <x-ui.search-input
                    name="vehicle_registry_search"
                    placeholder="Search by registration number, model or vehicle type..."
                    aria-label="Search by registration number, model or vehicle type..."
                    class="w-100" />
            </div>

            <div class="col-12 col-xl-7">
                <div class="d-flex flex-column flex-xxl-row gap-3 justify-content-xxl-end align-items-stretch align-items-xxl-end">
                    <div class="flex-grow-1 flex-xxl-grow-0">
                        <label class="form-label small text-app-muted text-uppercase fw-semibold letter-spacing-1">Vehicle Type</label>
                        <x-ui.dropdown align="start" class="w-100">
                            <x-slot:trigger>
                                <x-ui.button variant="ghost" type="button" class="w-100 d-flex align-items-center justify-content-between" aria-label="Choose vehicle type" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span class="d-inline-flex align-items-center gap-2">
                                        <i class="bi bi-truck-front"></i>
                                        <span data-filter-label="type">All vehicle types</span>
                                    </span>
                                    <i class="bi bi-chevron-down ms-2"></i>
                                </x-ui.button>
                            </x-slot:trigger>

                            <x-slot:menu>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="type" data-filter-value="all"><span>All vehicle types</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="type" data-filter-value="Mini Van"><span>Mini Van</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="type" data-filter-value="Truck"><span>Truck</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="type" data-filter-value="Bus"><span>Bus</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="type" data-filter-value="Pickup"><span>Pickup</span><i class="bi bi-check2 opacity-0"></i></button></li>
                            </x-slot:menu>
                        </x-ui.dropdown>
                    </div>

                    <div class="flex-grow-1 flex-xxl-grow-0">
                        <label class="form-label small text-app-muted text-uppercase fw-semibold letter-spacing-1">Status</label>
                        <x-ui.dropdown align="start" class="w-100">
                            <x-slot:trigger>
                                <x-ui.button variant="ghost" type="button" class="w-100 d-flex align-items-center justify-content-between" aria-label="Choose vehicle status" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span class="d-inline-flex align-items-center gap-2">
                                        <i class="bi bi-badge-4k"></i>
                                        <span data-filter-label="status">All statuses</span>
                                    </span>
                                    <i class="bi bi-chevron-down ms-2"></i>
                                </x-ui.button>
                            </x-slot:trigger>

                            <x-slot:menu>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="status" data-filter-value="all"><span>All statuses</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="status" data-filter-value="Available"><span>Available</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="status" data-filter-value="On Trip"><span>On Trip</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="status" data-filter-value="Maintenance"><span>Maintenance</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="status" data-filter-value="Retired"><span>Retired</span><i class="bi bi-check2 opacity-0"></i></button></li>
                            </x-slot:menu>
                        </x-ui.dropdown>
                    </div>

                    <div class="flex-grow-1 flex-xxl-grow-0">
                        <label class="form-label small text-app-muted text-uppercase fw-semibold letter-spacing-1">Region</label>
                        <x-ui.dropdown align="start" class="w-100">
                            <x-slot:trigger>
                                <x-ui.button variant="ghost" type="button" class="w-100 d-flex align-items-center justify-content-between" aria-label="Choose region" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span class="d-inline-flex align-items-center gap-2">
                                        <i class="bi bi-geo-alt"></i>
                                        <span data-filter-label="region">All regions</span>
                                    </span>
                                    <i class="bi bi-chevron-down ms-2"></i>
                                </x-ui.button>
                            </x-slot:trigger>

                            <x-slot:menu>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="region" data-filter-value="all"><span>All regions</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="region" data-filter-value="North"><span>North</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="region" data-filter-value="South"><span>South</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="region" data-filter-value="East"><span>East</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="region" data-filter-value="West"><span>West</span><i class="bi bi-check2 opacity-0"></i></button></li>
                            </x-slot:menu>
                        </x-ui.dropdown>
                    </div>

                    <div class="d-flex flex-column flex-sm-row gap-2">
                        <x-ui.button variant="ghost" type="button" icon="arrow-counterclockwise" class="w-100 w-sm-auto" data-vehicle-reset-filters>
                            Reset Filters
                        </x-ui.button>
                        <x-ui.button type="button" icon="funnel" class="w-100 w-sm-auto" data-vehicle-apply-filters>
                            Apply
                        </x-ui.button>
                    </div>
                </div>
            </div>
        </div>
    </x-ui.card>

    <div class="row g-4 row-cols-1 row-cols-md-2 row-cols-xl-4 mb-4">
        <div class="col">
            <x-ui.metric-card title="Total Vehicles" icon="truck" class="h-100" data-summary-card="total">
                <div class="app-metric-card-value mt-2" data-summary-value>
                    <div class="placeholder-glow"><span class="placeholder col-4"></span></div>
                </div>
            </x-ui.metric-card>
        </div>

        <div class="col">
            <x-ui.metric-card title="Available" icon="check-circle" class="h-100" data-summary-card="available">
                <div class="app-metric-card-value mt-2" data-summary-value>
                    <div class="placeholder-glow"><span class="placeholder col-4"></span></div>
                </div>
            </x-ui.metric-card>
        </div>

        <div class="col">
            <x-ui.metric-card title="On Trip" icon="signpost-2" class="h-100" data-summary-card="onTrip">
                <div class="app-metric-card-value mt-2" data-summary-value>
                    <div class="placeholder-glow"><span class="placeholder col-4"></span></div>
                </div>
            </x-ui.metric-card>
        </div>

        <div class="col">
            <x-ui.metric-card title="Maintenance" icon="tools" class="h-100" data-summary-card="maintenance">
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
                    <div class="h5 mb-1">Fleet Assets</div>
                    <div class="text-app-muted small">View, filter and manage registered vehicles.</div>
                </div>

                <div class="text-app-muted small text-lg-end">
                    <div class="fw-semibold text-app" data-vehicle-results-count>Loading vehicles...</div>
                    <div aria-live="polite" data-vehicle-page-info>Preparing registry data...</div>
                </div>
            </div>
        </x-slot:header>

        <div class="d-none app-empty-state text-center" data-vehicle-empty>
            <div class="mb-3 text-app-muted fs-1">
                <i class="bi bi-truck"></i>
            </div>
            <div class="h5 mb-2" data-vehicle-empty-title>No vehicles have been registered yet.</div>
            <div class="text-app-muted small mb-3" data-vehicle-empty-message>Use Register Vehicle to add your first fleet asset.</div>
            <x-ui.button type="button" icon="plus-lg" data-vehicle-empty-action>
                Register Vehicle
            </x-ui.button>
        </div>

        <div class="d-none app-empty-state text-center" data-vehicle-filter-empty>
            <div class="mb-3 text-app-muted fs-1">
                <i class="bi bi-search"></i>
            </div>
            <div class="h5 mb-2">No vehicles match the current filters.</div>
            <div class="text-app-muted small mb-3">Adjust the search or filters and try again.</div>
            <x-ui.button variant="ghost" type="button" icon="arrow-counterclockwise" data-vehicle-filter-reset>
                Reset Filters
            </x-ui.button>
        </div>

        <x-ui.data-table striped hover data-vehicle-table>
            <thead>
                <tr>
                    <th scope="col">
                        <button type="button" class="btn btn-link p-0 text-decoration-none text-app-muted fw-semibold d-inline-flex align-items-center gap-2" data-sort-key="registrationNumber" aria-label="Sort by registration number">
                            <span>Registration Number</span>
                            <i class="bi bi-arrow-down-up" data-sort-icon="registrationNumber"></i>
                        </button>
                    </th>
                    <th scope="col">
                        <button type="button" class="btn btn-link p-0 text-decoration-none text-app-muted fw-semibold d-inline-flex align-items-center gap-2" data-sort-key="name" aria-label="Sort by vehicle name">
                            <span>Vehicle</span>
                            <i class="bi bi-arrow-down-up" data-sort-icon="name"></i>
                        </button>
                    </th>
                    <th scope="col">
                        <button type="button" class="btn btn-link p-0 text-decoration-none text-app-muted fw-semibold d-inline-flex align-items-center gap-2" data-sort-key="type" aria-label="Sort by vehicle type">
                            <span>Vehicle Type</span>
                            <i class="bi bi-arrow-down-up" data-sort-icon="type"></i>
                        </button>
                    </th>
                    <th scope="col">
                        <button type="button" class="btn btn-link p-0 text-decoration-none text-app-muted fw-semibold d-inline-flex align-items-center gap-2" data-sort-key="capacityValue" aria-label="Sort by capacity">
                            <span>Capacity</span>
                            <i class="bi bi-arrow-down-up" data-sort-icon="capacityValue"></i>
                        </button>
                    </th>
                    <th scope="col">
                        <button type="button" class="btn btn-link p-0 text-decoration-none text-app-muted fw-semibold d-inline-flex align-items-center gap-2" data-sort-key="odometer" aria-label="Sort by odometer">
                            <span>Odometer</span>
                            <i class="bi bi-arrow-down-up" data-sort-icon="odometer"></i>
                        </button>
                    </th>
                    <th scope="col">
                        <button type="button" class="btn btn-link p-0 text-decoration-none text-app-muted fw-semibold d-inline-flex align-items-center gap-2" data-sort-key="status" aria-label="Sort by status">
                            <span>Status</span>
                            <i class="bi bi-arrow-down-up" data-sort-icon="status"></i>
                        </button>
                    </th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody data-vehicle-table-body>
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
                </tr>
            </tbody>
        </x-ui.data-table>

        <template id="vehicle-row-template">
            <tr>
                <td class="fw-semibold" data-field="registrationNumber"></td>
                <td data-field="name"></td>
                <td data-field="type"></td>
                <td class="text-nowrap" data-field="capacity"></td>
                <td class="text-nowrap" data-field="odometer"></td>
                <td>
                    <x-ui.status-badge tone="success" icon="check-circle" data-status-badge>
                        <span data-field="status"></span>
                    </x-ui.status-badge>
                </td>
                <td>
                    <div class="d-flex flex-wrap gap-2">
                        <button type="button" class="btn btn-sm btn-app-ghost rounded-pill" data-vehicle-action="view" aria-label="View vehicle">
                            <i class="bi bi-eye me-1"></i><span class="d-none d-sm-inline">View</span>
                        </button>
                        <button type="button" class="btn btn-sm btn-app-ghost rounded-pill" data-vehicle-action="edit" aria-label="Edit vehicle">
                            <i class="bi bi-pencil-square me-1"></i><span class="d-none d-sm-inline">Edit</span>
                        </button>
                        <button type="button" class="btn btn-sm btn-app-ghost rounded-pill text-danger" data-vehicle-action="delete" aria-label="Delete vehicle">
                            <i class="bi bi-trash me-1"></i><span class="d-none d-sm-inline">Delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        </template>

        <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mt-4">
            <div class="text-app-muted small" data-vehicle-page-summary>Loading page summary...</div>
            <x-ui.pagination data-vehicle-pagination aria-label="Vehicle registry pagination"></x-ui.pagination>
        </div>
    </x-ui.card>

    <div class="modal fade" id="vehicleFormModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg modal-fullscreen-sm-down">
            <div class="modal-content app-modal-content">
                <div class="modal-header border-0">
                    <div>
                        <h5 class="modal-title" data-vehicle-modal-title>Register Vehicle</h5>
                        <div class="text-app-muted small" data-vehicle-modal-subtitle>Add or update fleet asset details.</div>
                    </div>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body pt-0">
                    <form id="vehicle-form" class="needs-validation" novalidate>
                        <input type="hidden" name="id" id="vehicle-id">
                        <div class="row g-3">
                            <div class="col-12 col-md-6">
                                <label for="vehicle-registration-number" class="form-label small text-app-muted fw-semibold">Registration Number</label>
                                <input type="text" class="form-control" id="vehicle-registration-number" name="registration_number" required maxlength="20" autocomplete="off">
                                <div class="invalid-feedback" data-field-error="registration_number"></div>
                            </div>

                            <div class="col-12 col-md-6">
                                <label for="vehicle-name" class="form-label small text-app-muted fw-semibold">Vehicle Name / Model</label>
                                <input type="text" class="form-control" id="vehicle-name" name="vehicle_name" required maxlength="80" autocomplete="off">
                                <div class="invalid-feedback" data-field-error="vehicle_name"></div>
                            </div>

                            <div class="col-12 col-md-6">
                                <label for="vehicle-type" class="form-label small text-app-muted fw-semibold">Vehicle Type</label>
                                <select class="form-select" id="vehicle-type" name="vehicle_type" required>
                                    <option value="" selected disabled>Select vehicle type</option>
                                    <option value="Mini Van">Mini Van</option>
                                    <option value="Truck">Truck</option>
                                    <option value="Bus">Bus</option>
                                    <option value="Pickup">Pickup</option>
                                    <option value="Sedan">Sedan</option>
                                </select>
                                <div class="invalid-feedback" data-field-error="vehicle_type"></div>
                            </div>

                            <div class="col-12 col-md-6">
                                <label for="vehicle-status" class="form-label small text-app-muted fw-semibold">Status</label>
                                <select class="form-select" id="vehicle-status" name="status" required>
                                    <option value="Available">Available</option>
                                    <option value="On Trip">On Trip</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Retired">Retired</option>
                                </select>
                                <div class="invalid-feedback" data-field-error="status"></div>
                            </div>

                            <div class="col-12 col-md-4">
                                <label for="vehicle-capacity" class="form-label small text-app-muted fw-semibold">Maximum Load Capacity</label>
                                <input type="number" class="form-control" id="vehicle-capacity" name="capacity" min="0.01" step="0.01" required>
                                <div class="invalid-feedback" data-field-error="capacity"></div>
                            </div>

                            <div class="col-12 col-md-4">
                                <label for="vehicle-odometer" class="form-label small text-app-muted fw-semibold">Odometer</label>
                                <input type="number" class="form-control" id="vehicle-odometer" name="odometer" min="0" step="1" required>
                                <div class="invalid-feedback" data-field-error="odometer"></div>
                            </div>

                            <div class="col-12 col-md-4">
                                <label for="vehicle-acquisition-cost" class="form-label small text-app-muted fw-semibold">Acquisition Cost</label>
                                <input type="number" class="form-control" id="vehicle-acquisition-cost" name="acquisition_cost" min="0.01" step="0.01" required>
                                <div class="invalid-feedback" data-field-error="acquisition_cost"></div>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="modal-footer border-0 pt-0">
                    <x-ui.button variant="ghost" type="button" data-bs-dismiss="modal">
                        Cancel
                    </x-ui.button>
                    <x-ui.button type="submit" form="vehicle-form" icon="check2" data-vehicle-save-button>
                        Save Vehicle
                    </x-ui.button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="vehicleDeleteModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content app-modal-content">
                <div class="modal-header border-0">
                    <h5 class="modal-title">Delete Vehicle</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body pt-0">
                    <p class="text-app-muted mb-0">Are you sure you want to remove this vehicle?</p>
                </div>

                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-app-ghost rounded-pill" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger rounded-pill" data-vehicle-confirm-delete>Delete</button>
                </div>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script src="{{ asset('js/vehicle-registry.js') }}"></script>
@endpush
@endsection