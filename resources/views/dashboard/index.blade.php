@extends('layouts.app')

@section('title', 'Operational Dashboard')
@section('search_placeholder', 'Search vehicles, drivers or trips...')

@section('content')
<div class="container-fluid px-0" id="operational-dashboard" data-dashboard-root>
    <div class="d-flex flex-column flex-xl-row align-items-xl-end justify-content-between gap-3 mb-4">
        <div>
            <h1 class="display-5 mb-2">Operational Dashboard</h1>
            <p class="text-app-muted mb-0">Monitor fleet activity, vehicle availability and operational insights in real time.</p>
        </div>

        <x-ui.status-badge tone="success" icon="circle-fill" class="align-self-start align-self-xl-center">
            System Live
        </x-ui.status-badge>
    </div>

    <x-ui.card class="mb-4">
        <div class="row g-3 align-items-end">
            <div class="col-12 col-xxl-4">
                <label for="dashboardSearch" class="form-label small text-app-muted text-uppercase fw-semibold letter-spacing-1">Search</label>
                <x-ui.search-input
                    id="dashboardSearch"
                    name="dashboard_search"
                    placeholder="Search vehicles, drivers or trips..."
                    aria-label="Search vehicles, drivers or trips"
                    class="w-100" />
            </div>

            <div class="col-6 col-md-4 col-xxl-2">
                <label class="form-label small text-app-muted text-uppercase fw-semibold letter-spacing-1">Date Range</label>
                <x-ui.dropdown align="start" class="w-100">
                    <x-slot:trigger>
                        <x-ui.button variant="ghost" type="button" icon="calendar3" class="w-100 d-flex align-items-center justify-content-between" aria-label="Choose date range">
                            <span>Date Range</span>
                            <i class="bi bi-chevron-down ms-2"></i>
                        </x-ui.button>
                    </x-slot:trigger>

                    <x-slot:menu>
                        <li><button type="button" class="dropdown-item">Today</button></li>
                        <li><button type="button" class="dropdown-item">Last 7 days</button></li>
                        <li><button type="button" class="dropdown-item">This month</button></li>
                        <li><button type="button" class="dropdown-item">Custom range</button></li>
                    </x-slot:menu>
                </x-ui.dropdown>
            </div>

            <div class="col-6 col-md-4 col-xxl-2">
                <label class="form-label small text-app-muted text-uppercase fw-semibold letter-spacing-1">Vehicle Type</label>
                <x-ui.dropdown align="start" class="w-100">
                    <x-slot:trigger>
                        <x-ui.button variant="ghost" type="button" icon="truck-front" class="w-100 d-flex align-items-center justify-content-between" aria-label="Choose vehicle type">
                            <span>Vehicle Type</span>
                            <i class="bi bi-chevron-down ms-2"></i>
                        </x-ui.button>
                    </x-slot:trigger>

                    <x-slot:menu>
                        <li><button type="button" class="dropdown-item">All vehicle types</button></li>
                        <li><button type="button" class="dropdown-item">Vans</button></li>
                        <li><button type="button" class="dropdown-item">Trucks</button></li>
                        <li><button type="button" class="dropdown-item">Buses</button></li>
                    </x-slot:menu>
                </x-ui.dropdown>
            </div>

            <div class="col-12 col-md-4 col-xxl-2">
                <label class="form-label small text-app-muted text-uppercase fw-semibold letter-spacing-1">Region</label>
                <x-ui.dropdown align="start" class="w-100">
                    <x-slot:trigger>
                        <x-ui.button variant="ghost" type="button" icon="geo-alt" class="w-100 d-flex align-items-center justify-content-between" aria-label="Choose region">
                            <span>Region</span>
                            <i class="bi bi-chevron-down ms-2"></i>
                        </x-ui.button>
                    </x-slot:trigger>

                    <x-slot:menu>
                        <li><button type="button" class="dropdown-item">All regions</button></li>
                        <li><button type="button" class="dropdown-item">North</button></li>
                        <li><button type="button" class="dropdown-item">South</button></li>
                        <li><button type="button" class="dropdown-item">West</button></li>
                    </x-slot:menu>
                </x-ui.dropdown>
            </div>

            <div class="col-12 col-xl-auto ms-xl-auto d-flex flex-column flex-sm-row gap-2 justify-content-end">
                <x-ui.button type="button" icon="funnel" aria-label="Apply filters">Apply Filter</x-ui.button>
                <x-ui.button variant="ghost" type="button" icon="arrow-counterclockwise" aria-label="Reset filters">Reset</x-ui.button>
            </div>
        </div>
    </x-ui.card>

    <div class="row g-4 row-cols-1 row-cols-md-2 row-cols-xxl-5 mb-4">
        <div class="col">
            <x-ui.metric-card title="Active Vehicles" icon="truck" class="h-100" data-metric-card="activeVehicles">
                <div class="app-metric-card-value mt-2" data-metric-value>
                    <div class="placeholder-glow"><span class="placeholder col-4"></span></div>
                </div>
                <div class="mt-3">
                    <x-ui.status-badge tone="success" icon="circle-fill" data-metric-badge>
                        <span data-metric-footer>Loading</span>
                    </x-ui.status-badge>
                </div>
            </x-ui.metric-card>
        </div>

        <div class="col">
            <x-ui.metric-card title="Available Vehicles" icon="check-circle" class="h-100" data-metric-card="availableVehicles">
                <div class="app-metric-card-value mt-2" data-metric-value>
                    <div class="placeholder-glow"><span class="placeholder col-4"></span></div>
                </div>
                <div class="mt-3">
                    <x-ui.status-badge tone="info" icon="circle-fill" data-metric-badge>
                        <span data-metric-footer>Loading</span>
                    </x-ui.status-badge>
                </div>
            </x-ui.metric-card>
        </div>

        <div class="col">
            <x-ui.metric-card title="In Maintenance" icon="wrench" class="h-100" data-metric-card="maintenanceVehicles">
                <div class="app-metric-card-value mt-2" data-metric-value>
                    <div class="placeholder-glow"><span class="placeholder col-4"></span></div>
                </div>
                <div class="mt-3">
                    <x-ui.status-badge tone="danger" icon="circle-fill" data-metric-badge>
                        <span data-metric-footer>Loading</span>
                    </x-ui.status-badge>
                </div>
            </x-ui.metric-card>
        </div>

        <div class="col">
            <x-ui.metric-card title="Active Trips" icon="signpost-2" class="h-100" data-metric-card="activeTrips">
                <div class="app-metric-card-value mt-2" data-metric-value>
                    <div class="placeholder-glow"><span class="placeholder col-4"></span></div>
                </div>
                <div class="mt-3">
                    <x-ui.status-badge tone="info" icon="circle-fill" data-metric-badge>
                        <span data-metric-footer>Loading</span>
                    </x-ui.status-badge>
                </div>
            </x-ui.metric-card>
        </div>

        <div class="col">
            <x-ui.metric-card title="Pending Trips" icon="clock-history" class="h-100" data-metric-card="pendingTrips">
                <div class="app-metric-card-value mt-2" data-metric-value>
                    <div class="placeholder-glow"><span class="placeholder col-4"></span></div>
                </div>
                <div class="mt-3">
                    <x-ui.status-badge tone="warning" icon="circle-fill" data-metric-badge>
                        <span data-metric-footer>Loading</span>
                    </x-ui.status-badge>
                </div>
            </x-ui.metric-card>
        </div>
    </div>

    <div class="row g-4 mb-4">
        <div class="col-12 col-xl-8">
            <x-ui.card>
                <x-slot:header>
                    <div class="d-flex align-items-start justify-content-between gap-3 w-100">
                        <div>
                            <div class="h5 mb-1">Recent Trips</div>
                            <div class="text-app-muted small">Live dispatch activity across the fleet.</div>
                        </div>

                        <a href="#" class="d-inline-flex align-items-center gap-2 text-app-muted fw-semibold" aria-label="View all recent trips">
                            <span>View All</span>
                            <i class="bi bi-arrow-right"></i>
                        </a>
                    </div>
                </x-slot:header>

                <div class="d-none app-empty-state text-center" data-trip-empty>
                    <div class="mb-3 text-app-muted fs-1">
                        <i class="bi bi-inbox"></i>
                    </div>
                    <div class="h5 mb-2">No recent trips available.</div>
                    <div class="text-app-muted small">Trips will appear here once dispatch activity begins.</div>
                </div>

                <x-ui.data-table striped hover data-trip-table>
                    <thead>
                        <tr>
                            <th>Trip ID</th>
                            <th>Vehicle</th>
                            <th>Driver</th>
                            <th>Destination</th>
                            <th>Status</th>
                            <th>ETA</th>
                        </tr>
                    </thead>
                    <tbody data-trip-table-body>
                        <tr data-loading-row>
                            <td>
                                <div class="placeholder-glow"><span class="placeholder col-8"></span></div>
                            </td>
                            <td>
                                <div class="placeholder-glow"><span class="placeholder col-6"></span></div>
                            </td>
                            <td>
                                <div class="placeholder-glow"><span class="placeholder col-5"></span></div>
                            </td>
                            <td>
                                <div class="placeholder-glow"><span class="placeholder col-7"></span></div>
                            </td>
                            <td>
                                <div class="placeholder-glow"><span class="placeholder col-5"></span></div>
                            </td>
                            <td>
                                <div class="placeholder-glow"><span class="placeholder col-4"></span></div>
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
                                <div class="placeholder-glow"><span class="placeholder col-5"></span></div>
                            </td>
                            <td>
                                <div class="placeholder-glow"><span class="placeholder col-7"></span></div>
                            </td>
                            <td>
                                <div class="placeholder-glow"><span class="placeholder col-5"></span></div>
                            </td>
                            <td>
                                <div class="placeholder-glow"><span class="placeholder col-4"></span></div>
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
                                <div class="placeholder-glow"><span class="placeholder col-5"></span></div>
                            </td>
                            <td>
                                <div class="placeholder-glow"><span class="placeholder col-7"></span></div>
                            </td>
                            <td>
                                <div class="placeholder-glow"><span class="placeholder col-5"></span></div>
                            </td>
                            <td>
                                <div class="placeholder-glow"><span class="placeholder col-4"></span></div>
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
                                <div class="placeholder-glow"><span class="placeholder col-5"></span></div>
                            </td>
                            <td>
                                <div class="placeholder-glow"><span class="placeholder col-7"></span></div>
                            </td>
                            <td>
                                <div class="placeholder-glow"><span class="placeholder col-5"></span></div>
                            </td>
                            <td>
                                <div class="placeholder-glow"><span class="placeholder col-4"></span></div>
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
                                <div class="placeholder-glow"><span class="placeholder col-5"></span></div>
                            </td>
                            <td>
                                <div class="placeholder-glow"><span class="placeholder col-7"></span></div>
                            </td>
                            <td>
                                <div class="placeholder-glow"><span class="placeholder col-5"></span></div>
                            </td>
                            <td>
                                <div class="placeholder-glow"><span class="placeholder col-4"></span></div>
                            </td>
                        </tr>
                    </tbody>
                </x-ui.data-table>

                <template id="trip-row-template">
                    <tr>
                        <td data-field="tripId"></td>
                        <td data-field="vehicle"></td>
                        <td data-field="driver"></td>
                        <td data-field="destination"></td>
                        <td>
                            <x-ui.status-badge tone="info" icon="circle-fill" data-status-badge>
                                <span data-field="status"></span>
                            </x-ui.status-badge>
                        </td>
                        <td data-field="eta"></td>
                    </tr>
                </template>
            </x-ui.card>
        </div>

        <div class="col-12 col-xl-4 d-flex flex-column gap-4">
            <x-ui.card>
                <x-slot:header>
                    <div>
                        <div class="h5 mb-1">Fleet Utilization</div>
                        <div class="text-app-muted small">Current operational split across the active fleet.</div>
                    </div>
                </x-slot:header>

                <div class="d-none app-empty-state text-center" data-utilization-empty>
                    <div class="mb-3 text-app-muted fs-1">
                        <i class="bi bi-inbox"></i>
                    </div>
                    <div class="h5 mb-2">No utilization data available.</div>
                    <div class="text-app-muted small">Fleet utilization metrics will appear here when data is available.</div>
                </div>

                <div data-utilization-content>
                    <div class="d-flex align-items-end justify-content-between gap-3 mb-4">
                        <div>
                            <div class="text-app-muted small text-uppercase fw-semibold letter-spacing-1">Fleet Utilization</div>
                            <div class="display-6 mb-0" data-utilization-percentage>--</div>
                        </div>
                        <div class="text-end text-app-muted small" data-utilization-summary>Loading utilization data...</div>
                    </div>

                    <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="text-app-muted small">Vehicles In Use</span>
                            <span class="small fw-semibold" data-utilization-used-label>--</span>
                        </div>
                        <div class="progress" role="progressbar" aria-label="Vehicles in use" aria-valuemin="0" aria-valuemax="100">
                            <div class="progress-bar bg-success" data-utilization-used-bar></div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="text-app-muted small">Available</span>
                            <span class="small fw-semibold" data-utilization-available-label>--</span>
                        </div>
                        <div class="progress" role="progressbar" aria-label="Available vehicles" aria-valuemin="0" aria-valuemax="100">
                            <div class="progress-bar bg-info" data-utilization-available-bar></div>
                        </div>
                    </div>

                    <div>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="text-app-muted small">Maintenance</span>
                            <span class="small fw-semibold" data-utilization-maintenance-label>--</span>
                        </div>
                        <div class="progress" role="progressbar" aria-label="Maintenance vehicles" aria-valuemin="0" aria-valuemax="100">
                            <div class="progress-bar bg-warning" data-utilization-maintenance-bar></div>
                        </div>
                    </div>
                </div>
            </x-ui.card>

            <x-ui.card>
                <x-slot:header>
                    <div>
                        <div class="h5 mb-1">Quick Statistics</div>
                        <div class="text-app-muted small">Live operational summary for leadership and dispatch.</div>
                    </div>
                </x-slot:header>

                <div class="d-none app-empty-state text-center" data-stats-empty>
                    <div class="mb-3 text-app-muted fs-1">
                        <i class="bi bi-inbox"></i>
                    </div>
                    <div class="h5 mb-2">No statistics available.</div>
                    <div class="text-app-muted small">Summary metrics will appear here once the feed is available.</div>
                </div>

                <div class="d-flex flex-column gap-3" data-stats-content>
                    <div class="d-flex align-items-center justify-content-between gap-3 py-2 border-bottom border-app">
                        <div class="d-flex align-items-center gap-3">
                            <span class="app-metric-card-icon flex-shrink-0"><i class="bi bi-fuel-pump"></i></span>
                            <div>
                                <div class="fw-semibold">Average Fuel Efficiency</div>
                                <div class="text-app-muted small">Across active long-haul and urban vehicles</div>
                            </div>
                        </div>
                        <div class="fw-semibold" data-stat-field="fuelEfficiency">--</div>
                    </div>

                    <div class="d-flex align-items-center justify-content-between gap-3 py-2 border-bottom border-app">
                        <div class="d-flex align-items-center gap-3">
                            <span class="app-metric-card-icon flex-shrink-0"><i class="bi bi-signpost-split"></i></span>
                            <div>
                                <div class="fw-semibold">Average Trip Distance</div>
                                <div class="text-app-muted small">Weighted across completed dispatches</div>
                            </div>
                        </div>
                        <div class="fw-semibold" data-stat-field="tripDistance">--</div>
                    </div>

                    <div class="d-flex align-items-center justify-content-between gap-3 py-2 border-bottom border-app">
                        <div class="d-flex align-items-center gap-3">
                            <span class="app-metric-card-icon flex-shrink-0"><i class="bi bi-currency-rupee"></i></span>
                            <div>
                                <div class="fw-semibold">Total Revenue</div>
                                <div class="text-app-muted small">Closed trips and active contracts</div>
                            </div>
                        </div>
                        <div class="fw-semibold" data-stat-field="revenue">--</div>
                    </div>

                    <div class="d-flex align-items-center justify-content-between gap-3 py-2">
                        <div class="d-flex align-items-center gap-3">
                            <span class="app-metric-card-icon flex-shrink-0"><i class="bi bi-shield-check"></i></span>
                            <div>
                                <div class="fw-semibold">Average Safety Score</div>
                                <div class="text-app-muted small">Driver compliance and inspection score</div>
                            </div>
                        </div>
                        <div class="fw-semibold" data-stat-field="safetyScore">--</div>
                    </div>
                </div>
            </x-ui.card>
        </div>
    </div>

    <div class="row g-4 mb-4">
        <div class="col-12 col-xl-6">
            <x-ui.card>
                <x-slot:header>
                    <div>
                        <div class="h5 mb-1">Fleet Status Distribution</div>
                        <div class="text-app-muted small">Live split of operational vehicle availability.</div>
                    </div>
                </x-slot:header>

                <div class="d-none app-empty-state text-center" data-fleet-chart-empty>
                    <div class="mb-3 text-app-muted fs-1">
                        <i class="bi bi-inbox"></i>
                    </div>
                    <div class="h5 mb-2">No chart data available.</div>
                    <div class="text-app-muted small">Fleet status distribution will render once data is available.</div>
                </div>

                <div class="placeholder-glow d-flex flex-column gap-2" data-fleet-chart-loading>
                    <span class="placeholder col-8"></span>
                    <span class="placeholder col-10"></span>
                    <span class="placeholder col-6"></span>
                </div>

                <div class="ratio ratio-1x1" data-fleet-chart-wrap>
                    <canvas id="fleetStatusChart" aria-label="Fleet status distribution chart" role="img"></canvas>
                </div>
            </x-ui.card>
        </div>

        <div class="col-12 col-xl-6">
            <x-ui.card>
                <x-slot:header>
                    <div>
                        <div class="h5 mb-1">Monthly Trips</div>
                        <div class="text-app-muted small">Dispatch volume trends across the current year.</div>
                    </div>
                </x-slot:header>

                <div class="d-none app-empty-state text-center" data-monthly-chart-empty>
                    <div class="mb-3 text-app-muted fs-1">
                        <i class="bi bi-inbox"></i>
                    </div>
                    <div class="h5 mb-2">No chart data available.</div>
                    <div class="text-app-muted small">Monthly trip volume will render once data is available.</div>
                </div>

                <div class="placeholder-glow d-flex flex-column gap-2" data-monthly-chart-loading>
                    <span class="placeholder col-7"></span>
                    <span class="placeholder col-9"></span>
                    <span class="placeholder col-5"></span>
                </div>

                <div class="ratio ratio-16x9" data-monthly-chart-wrap>
                    <canvas id="monthlyTripsChart" aria-label="Monthly trips chart" role="img"></canvas>
                </div>
            </x-ui.card>
        </div>
    </div>

    <div class="d-flex flex-column flex-sm-row flex-wrap gap-2 justify-content-end">
        <x-ui.button type="button" icon="tools" aria-label="Log maintenance">Log Maintenance</x-ui.button>
        <x-ui.button type="button" icon="plus-circle" aria-label="Create trip">Create Trip</x-ui.button>
        <x-ui.button variant="ghost" type="button" icon="download" aria-label="Export report">Export Report</x-ui.button>
    </div>
</div>

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js"></script>
<script src="{{ asset('js/dashboard.js') }}"></script>
@endpush
@endsection