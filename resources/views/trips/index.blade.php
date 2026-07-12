@extends('layouts.app')

@section('title', 'Trip Dispatcher')
@section('search_placeholder', 'Search trip ID, vehicle, driver or destination...')

@section('content')
<div class="container-fluid px-0" id="trip-dispatcher-page" data-trip-dispatcher-root>
    <div class="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3 mb-4">
        <div>
            <h1 class="display-5 mb-2">Trip Dispatcher</h1>
            <p class="text-app-muted mb-0">Plan, dispatch and monitor active transport operations.</p>
        </div>

        <x-ui.button type="button" icon="plus-circle" class="align-self-start align-self-lg-center" data-trip-create-button>
            Create Trip
        </x-ui.button>
    </div>

    <x-ui.card class="mb-4">
        <div class="row g-3 align-items-end">
            <div class="col-12 col-xl-5">
                <label class="form-label small text-app-muted text-uppercase fw-semibold letter-spacing-1">Search</label>
                <x-ui.search-input
                    name="trip_dispatcher_search"
                    placeholder="Search trip ID, vehicle, driver or destination..."
                    aria-label="Search trip ID, vehicle, driver or destination..."
                    class="w-100" />
            </div>

            <div class="col-12 col-xl-7">
                <div class="d-flex flex-column flex-xxl-row gap-3 justify-content-xxl-end align-items-stretch align-items-xxl-end">
                    <div class="flex-grow-1 flex-xxl-grow-0">
                        <label class="form-label small text-app-muted text-uppercase fw-semibold letter-spacing-1">Trip Status</label>
                        <x-ui.dropdown align="start" class="w-100">
                            <x-slot:trigger>
                                <x-ui.button variant="ghost" type="button" class="w-100 d-flex align-items-center justify-content-between" aria-label="Choose trip status" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span class="d-inline-flex align-items-center gap-2">
                                        <i class="bi bi-signpost-2"></i>
                                        <span data-filter-label="status">All statuses</span>
                                    </span>
                                    <i class="bi bi-chevron-down ms-2"></i>
                                </x-ui.button>
                            </x-slot:trigger>

                            <x-slot:menu>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="status" data-filter-value="all"><span>All statuses</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="status" data-filter-value="Draft"><span>Draft</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="status" data-filter-value="Dispatched"><span>Dispatched</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="status" data-filter-value="On Trip"><span>On Trip</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="status" data-filter-value="Completed"><span>Completed</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="status" data-filter-value="Cancelled"><span>Cancelled</span><i class="bi bi-check2 opacity-0"></i></button></li>
                            </x-slot:menu>
                        </x-ui.dropdown>
                    </div>

                    <div class="flex-grow-1 flex-xxl-grow-0">
                        <label class="form-label small text-app-muted text-uppercase fw-semibold letter-spacing-1">Vehicle Type</label>
                        <x-ui.dropdown align="start" class="w-100">
                            <x-slot:trigger>
                                <x-ui.button variant="ghost" type="button" class="w-100 d-flex align-items-center justify-content-between" aria-label="Choose vehicle type" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span class="d-inline-flex align-items-center gap-2">
                                        <i class="bi bi-truck-front"></i>
                                        <span data-filter-label="vehicleType">All vehicle types</span>
                                    </span>
                                    <i class="bi bi-chevron-down ms-2"></i>
                                </x-ui.button>
                            </x-slot:trigger>

                            <x-slot:menu>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="vehicleType" data-filter-value="all"><span>All vehicle types</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="vehicleType" data-filter-value="Van"><span>Van</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="vehicleType" data-filter-value="Truck"><span>Truck</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="vehicleType" data-filter-value="Bus"><span>Bus</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="vehicleType" data-filter-value="Pickup"><span>Pickup</span><i class="bi bi-check2 opacity-0"></i></button></li>
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

                    <div class="flex-grow-1 flex-xxl-grow-0">
                        <label class="form-label small text-app-muted text-uppercase fw-semibold letter-spacing-1">Date Range</label>
                        <x-ui.dropdown align="start" class="w-100">
                            <x-slot:trigger>
                                <x-ui.button variant="ghost" type="button" class="w-100 d-flex align-items-center justify-content-between" aria-label="Choose date range" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span class="d-inline-flex align-items-center gap-2">
                                        <i class="bi bi-calendar3"></i>
                                        <span data-filter-label="dateRange">All dates</span>
                                    </span>
                                    <i class="bi bi-chevron-down ms-2"></i>
                                </x-ui.button>
                            </x-slot:trigger>

                            <x-slot:menu>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="dateRange" data-filter-value="all"><span>All dates</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="dateRange" data-filter-value="today"><span>Today</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="dateRange" data-filter-value="last7"><span>Last 7 days</span><i class="bi bi-check2 opacity-0"></i></button></li>
                                <li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-filter-option data-filter-group="dateRange" data-filter-value="thisMonth"><span>This month</span><i class="bi bi-check2 opacity-0"></i></button></li>
                            </x-slot:menu>
                        </x-ui.dropdown>
                    </div>

                    <div class="d-flex flex-column flex-sm-row gap-2">
                        <x-ui.button variant="ghost" type="button" icon="arrow-counterclockwise" class="w-100 w-sm-auto" data-trip-reset-filters>
                            Reset
                        </x-ui.button>
                        <x-ui.button type="button" icon="funnel" class="w-100 w-sm-auto" data-trip-apply-filters>
                            Apply
                        </x-ui.button>
                    </div>
                </div>
            </div>
        </div>
    </x-ui.card>

    <div class="row g-4 row-cols-1 row-cols-md-2 row-cols-xl-4 mb-4">
        <div class="col">
            <x-ui.metric-card title="Total Trips" icon="signpost-2" class="h-100" data-summary-card="total">
                <div class="app-metric-card-value mt-2" data-summary-value>
                    <div class="placeholder-glow"><span class="placeholder col-4"></span></div>
                </div>
            </x-ui.metric-card>
        </div>

        <div class="col">
            <x-ui.metric-card title="Active Trips" icon="truck" class="h-100" data-summary-card="active">
                <div class="app-metric-card-value mt-2" data-summary-value>
                    <div class="placeholder-glow"><span class="placeholder col-4"></span></div>
                </div>
            </x-ui.metric-card>
        </div>

        <div class="col">
            <x-ui.metric-card title="Completed Trips" icon="check-circle" class="h-100" data-summary-card="completed">
                <div class="app-metric-card-value mt-2" data-summary-value>
                    <div class="placeholder-glow"><span class="placeholder col-4"></span></div>
                </div>
            </x-ui.metric-card>
        </div>

        <div class="col">
            <x-ui.metric-card title="Cancelled Trips" icon="x-circle" class="h-100" data-summary-card="cancelled">
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
                    <div class="h5 mb-1">Trip Records</div>
                    <div class="text-app-muted small">View, filter and manage transport trip activity.</div>
                </div>

                <div class="text-app-muted small text-lg-end">
                    <div class="fw-semibold text-app" data-trip-results-count>Loading trips...</div>
                    <div aria-live="polite" data-trip-page-info>Preparing trip data...</div>
                </div>
            </div>
        </x-slot:header>

        <div class="d-none app-empty-state text-center" data-trip-empty>
            <div class="mb-3 text-app-muted fs-1">
                <i class="bi bi-signpost-2"></i>
            </div>
            <div class="h5 mb-2" data-trip-empty-title>No trips available.</div>
            <div class="text-app-muted small mb-3" data-trip-empty-message>Use Create Trip to add the first dispatch record.</div>
            <x-ui.button type="button" icon="plus-circle" data-trip-empty-action>
                Create Trip
            </x-ui.button>
        </div>

        <div class="d-none app-empty-state text-center" data-trip-filter-empty>
            <div class="mb-3 text-app-muted fs-1">
                <i class="bi bi-search"></i>
            </div>
            <div class="h5 mb-2">No trips match the current filters.</div>
            <div class="text-app-muted small mb-3">Adjust the search or filters and try again.</div>
            <x-ui.button variant="ghost" type="button" icon="arrow-counterclockwise" data-trip-filter-reset>
                Reset Filters
            </x-ui.button>
        </div>

        <x-ui.data-table striped hover data-trip-table>
            <thead>
                <tr>
                    <th scope="col">
                        <button type="button" class="btn btn-link p-0 text-decoration-none text-app-muted fw-semibold d-inline-flex align-items-center gap-2" data-sort-key="tripId" aria-label="Sort by trip ID">
                            <span>Trip ID</span>
                            <i class="bi bi-arrow-down-up" data-sort-icon="tripId"></i>
                        </button>
                    </th>
                    <th scope="col">
                        <button type="button" class="btn btn-link p-0 text-decoration-none text-app-muted fw-semibold d-inline-flex align-items-center gap-2" data-sort-key="vehicle" aria-label="Sort by vehicle">
                            <span>Vehicle</span>
                            <i class="bi bi-arrow-down-up" data-sort-icon="vehicle"></i>
                        </button>
                    </th>
                    <th scope="col">
                        <button type="button" class="btn btn-link p-0 text-decoration-none text-app-muted fw-semibold d-inline-flex align-items-center gap-2" data-sort-key="driver" aria-label="Sort by driver">
                            <span>Driver</span>
                            <i class="bi bi-arrow-down-up" data-sort-icon="driver"></i>
                        </button>
                    </th>
                    <th scope="col">Source</th>
                    <th scope="col">Destination</th>
                    <th scope="col">Cargo Weight</th>
                    <th scope="col">
                        <button type="button" class="btn btn-link p-0 text-decoration-none text-app-muted fw-semibold d-inline-flex align-items-center gap-2" data-sort-key="distanceValue" aria-label="Sort by distance">
                            <span>Distance</span>
                            <i class="bi bi-arrow-down-up" data-sort-icon="distanceValue"></i>
                        </button>
                    </th>
                    <th scope="col">
                        <button type="button" class="btn btn-link p-0 text-decoration-none text-app-muted fw-semibold d-inline-flex align-items-center gap-2" data-sort-key="status" aria-label="Sort by status">
                            <span>Trip Status</span>
                            <i class="bi bi-arrow-down-up" data-sort-icon="status"></i>
                        </button>
                    </th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody data-trip-table-body>
                <tr data-loading-row>
                    <td><div class="placeholder-glow"><span class="placeholder col-8"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-6"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-6"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-5"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-5"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-5"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-5"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-5"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-8"></span></div></td>
                </tr>
                <tr data-loading-row>
                    <td><div class="placeholder-glow"><span class="placeholder col-8"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-6"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-6"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-5"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-5"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-5"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-5"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-5"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-8"></span></div></td>
                </tr>
                <tr data-loading-row>
                    <td><div class="placeholder-glow"><span class="placeholder col-8"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-6"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-6"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-5"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-5"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-5"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-5"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-5"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-8"></span></div></td>
                </tr>
                <tr data-loading-row>
                    <td><div class="placeholder-glow"><span class="placeholder col-8"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-6"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-6"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-5"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-5"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-5"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-5"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-5"></span></div></td>
                    <td><div class="placeholder-glow"><span class="placeholder col-8"></span></div></td>
                </tr>
            </tbody>
        </x-ui.data-table>

        <template id="trip-row-template">
            <tr>
                <td class="fw-semibold text-nowrap" data-field="tripId"></td>
                <td data-field="vehicle"></td>
                <td data-field="driver"></td>
                <td data-field="source"></td>
                <td data-field="destination"></td>
                <td class="text-nowrap" data-field="cargoWeight"></td>
                <td class="text-nowrap" data-field="distance"></td>
                <td>
                    <x-ui.status-badge tone="info" icon="signpost-2" data-status-badge>
                        <span data-field="status"></span>
                    </x-ui.status-badge>
                </td>
                <td>
                    <div class="d-flex flex-wrap gap-2">
                        <button type="button" class="btn btn-sm btn-app-ghost rounded-pill" data-trip-action="view" aria-label="View trip">
                            <i class="bi bi-eye me-1"></i><span class="d-none d-sm-inline">View</span>
                        </button>
                        <button type="button" class="btn btn-sm btn-app-ghost rounded-pill" data-trip-action="edit" aria-label="Edit trip">
                            <i class="bi bi-pencil-square me-1"></i><span class="d-none d-sm-inline">Edit</span>
                        </button>
                        <button type="button" class="btn btn-sm btn-app-ghost rounded-pill text-warning" data-trip-action="dispatch" aria-label="Dispatch trip">
                            <i class="bi bi-send me-1"></i><span class="d-none d-sm-inline">Dispatch</span>
                        </button>
                        <button type="button" class="btn btn-sm btn-app-ghost rounded-pill text-info" data-trip-action="start" aria-label="Start trip">
                            <i class="bi bi-play-circle me-1"></i><span class="d-none d-sm-inline">Start Trip</span>
                        </button>
                        <button type="button" class="btn btn-sm btn-app-ghost rounded-pill text-success" data-trip-action="complete" aria-label="Complete trip">
                            <i class="bi bi-check-circle me-1"></i><span class="d-none d-sm-inline">Complete Trip</span>
                        </button>
                        <button type="button" class="btn btn-sm btn-app-ghost rounded-pill text-danger" data-trip-action="cancel" aria-label="Cancel trip">
                            <i class="bi bi-x-circle me-1"></i><span class="d-none d-sm-inline">Cancel Trip</span>
                        </button>
                        <button type="button" class="btn btn-sm btn-app-ghost rounded-pill text-danger" data-trip-action="delete" aria-label="Delete trip">
                            <i class="bi bi-trash me-1"></i><span class="d-none d-sm-inline">Delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        </template>

        <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mt-4">
            <div class="text-app-muted small" data-trip-page-summary>Loading page summary...</div>
            <x-ui.pagination data-trip-pagination aria-label="Trip dispatcher pagination"></x-ui.pagination>
        </div>
    </x-ui.card>

    <x-ui.modal id="tripFormModal" title="Create Trip" size="modal-xl modal-fullscreen-sm-down">
        <div class="d-flex flex-column gap-1 mb-3">
            <div class="text-app-muted small" data-trip-modal-subtitle>Plan a new trip and dispatch it into the queue.</div>
        </div>

        <form id="trip-form" class="needs-validation" novalidate>
            <input type="hidden" name="id" id="trip-id">
            <input type="hidden" name="vehicle_id" id="trip-vehicle-id">
            <input type="hidden" name="driver_id" id="trip-driver-id">

            <div class="row g-3">
                <div class="col-12 col-md-6">
                    <label for="trip-source" class="form-label small text-app-muted fw-semibold">Source</label>
                    <input type="text" class="form-control" id="trip-source" name="source" required maxlength="80" autocomplete="off">
                    <div class="invalid-feedback" data-field-error="source"></div>
                </div>

                <div class="col-12 col-md-6">
                    <label for="trip-destination" class="form-label small text-app-muted fw-semibold">Destination</label>
                    <input type="text" class="form-control" id="trip-destination" name="destination" required maxlength="80" autocomplete="off">
                    <div class="invalid-feedback" data-field-error="destination"></div>
                </div>

                <div class="col-12 col-md-6">
                    <label class="form-label small text-app-muted fw-semibold">Vehicle</label>
                    <x-ui.dropdown align="start" class="w-100" data-trip-vehicle-dropdown>
                        <x-slot:trigger>
                            <x-ui.button variant="ghost" type="button" class="w-100 d-flex align-items-center justify-content-between" aria-label="Choose vehicle" data-bs-toggle="dropdown" data-dropdown-trigger="vehicle_id" aria-expanded="false">
                                <span class="d-inline-flex align-items-center gap-2">
                                    <i class="bi bi-truck-front"></i>
                                    <span data-trip-vehicle-label>Select vehicle</span>
                                </span>
                                <i class="bi bi-chevron-down ms-2"></i>
                            </x-ui.button>
                        </x-slot:trigger>

                        <x-slot:menu>
                            <li><span class="dropdown-item text-app-muted">Loading available vehicles...</span></li>
                        </x-slot:menu>
                    </x-ui.dropdown>
                    <div class="form-text text-app-muted" data-trip-vehicle-hint>Select an available vehicle to view capacity details.</div>
                    <div class="invalid-feedback d-block" data-field-error="vehicle_id"></div>
                </div>

                <div class="col-12 col-md-6">
                    <label class="form-label small text-app-muted fw-semibold">Driver</label>
                    <x-ui.dropdown align="start" class="w-100" data-trip-driver-dropdown>
                        <x-slot:trigger>
                            <x-ui.button variant="ghost" type="button" class="w-100 d-flex align-items-center justify-content-between" aria-label="Choose driver" data-bs-toggle="dropdown" data-dropdown-trigger="driver_id" aria-expanded="false">
                                <span class="d-inline-flex align-items-center gap-2">
                                    <i class="bi bi-person-badge"></i>
                                    <span data-trip-driver-label>Select driver</span>
                                </span>
                                <i class="bi bi-chevron-down ms-2"></i>
                            </x-ui.button>
                        </x-slot:trigger>

                        <x-slot:menu>
                            <li><span class="dropdown-item text-app-muted">Loading available drivers...</span></li>
                        </x-slot:menu>
                    </x-ui.dropdown>
                    <div class="form-text text-app-muted" data-trip-driver-hint>Select an available driver with a valid license.</div>
                    <div class="invalid-feedback d-block" data-field-error="driver_id"></div>
                </div>

                <div class="col-12 col-md-4">
                    <label for="trip-cargo-weight" class="form-label small text-app-muted fw-semibold">Cargo Weight</label>
                    <input type="number" class="form-control" id="trip-cargo-weight" name="cargo_weight" min="0.01" step="0.01" required>
                    <div class="form-text text-app-muted" data-trip-capacity-hint>Maximum load capacity will appear after selecting a vehicle.</div>
                    <div class="invalid-feedback" data-field-error="cargo_weight"></div>
                </div>

                <div class="col-12 col-md-4">
                    <label for="trip-distance" class="form-label small text-app-muted fw-semibold">Planned Distance</label>
                    <input type="number" class="form-control" id="trip-distance" name="planned_distance" min="0.1" step="0.1" required>
                    <div class="invalid-feedback" data-field-error="planned_distance"></div>
                </div>

                <div class="col-12 col-md-4">
                    <label for="trip-status" class="form-label small text-app-muted fw-semibold">Trip Status</label>
                    <select class="form-select" id="trip-status" name="status" required>
                        <option value="Draft">Draft</option>
                        <option value="Dispatched">Dispatched</option>
                    </select>
                    <div class="invalid-feedback" data-field-error="status"></div>
                </div>
            </div>
        </form>

        <x-slot:footer>
            <x-ui.button variant="ghost" type="button" data-bs-dismiss="modal">
                Cancel
            </x-ui.button>
            <x-ui.button type="submit" form="trip-form" icon="check2" data-trip-save-button>
                Create Trip
            </x-ui.button>
        </x-slot:footer>
    </x-ui.modal>

    <x-ui.modal id="tripViewModal" title="Trip Details" size="modal-xl modal-fullscreen-sm-down">
        <div class="d-flex flex-column gap-1 mb-4">
            <div class="text-app-muted small" data-trip-view-subtitle>Review the current trip milestone and operational details.</div>
            <div class="d-flex flex-wrap align-items-center gap-2 mt-2">
                <x-ui.status-badge tone="info" icon="signpost-2" data-trip-view-status-badge>
                    <span data-trip-view-status>Draft</span>
                </x-ui.status-badge>
                <span class="text-app-muted small" data-trip-view-note></span>
            </div>
        </div>

        <div class="row g-3 mb-4">
            <div class="col-12 col-md-6 col-lg-4">
                <div class="border border-app rounded-4 p-3 h-100">
                    <div class="text-app-muted small text-uppercase fw-semibold letter-spacing-1 mb-1">Trip ID</div>
                    <div class="fw-semibold" data-trip-view-id>--</div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
                <div class="border border-app rounded-4 p-3 h-100">
                    <div class="text-app-muted small text-uppercase fw-semibold letter-spacing-1 mb-1">Vehicle</div>
                    <div class="fw-semibold" data-trip-view-vehicle>--</div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
                <div class="border border-app rounded-4 p-3 h-100">
                    <div class="text-app-muted small text-uppercase fw-semibold letter-spacing-1 mb-1">Driver</div>
                    <div class="fw-semibold" data-trip-view-driver>--</div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
                <div class="border border-app rounded-4 p-3 h-100">
                    <div class="text-app-muted small text-uppercase fw-semibold letter-spacing-1 mb-1">Route</div>
                    <div class="fw-semibold" data-trip-view-route>--</div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
                <div class="border border-app rounded-4 p-3 h-100">
                    <div class="text-app-muted small text-uppercase fw-semibold letter-spacing-1 mb-1">Cargo</div>
                    <div class="fw-semibold" data-trip-view-cargo>--</div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
                <div class="border border-app rounded-4 p-3 h-100">
                    <div class="text-app-muted small text-uppercase fw-semibold letter-spacing-1 mb-1">Distance</div>
                    <div class="fw-semibold" data-trip-view-distance>--</div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
                <div class="border border-app rounded-4 p-3 h-100">
                    <div class="text-app-muted small text-uppercase fw-semibold letter-spacing-1 mb-1">Region</div>
                    <div class="fw-semibold" data-trip-view-region>--</div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
                <div class="border border-app rounded-4 p-3 h-100">
                    <div class="text-app-muted small text-uppercase fw-semibold letter-spacing-1 mb-1">Trip Date</div>
                    <div class="fw-semibold" data-trip-view-date>--</div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
                <div class="border border-app rounded-4 p-3 h-100">
                    <div class="text-app-muted small text-uppercase fw-semibold letter-spacing-1 mb-1">Status</div>
                    <div class="fw-semibold" data-trip-view-current-stage>--</div>
                </div>
            </div>
        </div>

        <div class="border border-app rounded-4 p-3">
            <div class="d-flex align-items-center justify-content-between gap-3 mb-3">
                <div>
                    <div class="h6 mb-1">Timeline</div>
                    <div class="text-app-muted small">Draft → Dispatched → On Trip → Completed</div>
                </div>
                <div class="text-app-muted small" data-trip-view-timeline-note></div>
            </div>
            <div class="vstack gap-2" data-trip-timeline></div>
        </div>

        <x-slot:footer>
            <x-ui.button variant="ghost" type="button" data-bs-dismiss="modal">
                Close
            </x-ui.button>
            <x-ui.button variant="ghost" type="button" icon="pencil-square" data-trip-action="edit">
                Edit Trip
            </x-ui.button>
            <x-ui.button variant="ghost" type="button" icon="send" class="text-warning" data-trip-action="dispatch">
                Dispatch Trip
            </x-ui.button>
            <x-ui.button variant="ghost" type="button" icon="play-circle" class="text-info" data-trip-action="start">
                Start Trip
            </x-ui.button>
            <x-ui.button variant="ghost" type="button" icon="check-circle" class="text-success" data-trip-action="complete">
                Complete Trip
            </x-ui.button>
            <x-ui.button variant="ghost" type="button" icon="x-circle" class="text-danger" data-trip-action="cancel">
                Cancel Trip
            </x-ui.button>
        </x-slot:footer>
    </x-ui.modal>

    <x-ui.confirmation-dialog
        id="tripDeleteModal"
        title="Delete Trip"
        message="Are you sure you want to remove this trip?"
        confirmLabel="Delete"
        variant="danger">
    </x-ui.confirmation-dialog>
</div>

@push('scripts')
<script src="{{ asset('js/trip-dispatcher.js') }}"></script>
@endpush
@endsection