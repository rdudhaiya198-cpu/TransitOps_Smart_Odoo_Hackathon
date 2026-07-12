(function () {
    const api = window.TransitOpsAPI;

    let dashboardData = {
        metrics: {},
        trips: [],
        charts: {},
        overall: {}
    };

    let fleetStatusChartInstance = null;
    let monthlyTripsChartInstance = null;

    // Help function to map status to Bootstrap classes
    const statusToneMap = {
        'available': 'success',
        'on trip': 'info',
        'completed': 'success',
        'dispatched': 'info',
        'cancelled': 'danger',
        'draft': 'warning',
        'maintenance': 'danger',
        'in shop': 'danger',
        'suspended': 'warning',
        'off duty': 'warning',
        'expired': 'danger'
    };

    function getToneForStatus(status) {
        return statusToneMap[String(status || '').toLowerCase()] || 'info';
    }

    function setTextContent(element, value) {
        if (element) {
            element.textContent = value;
        }
    }

    // Renders the top KPIs
    function renderMetrics(root) {
        root.querySelectorAll('[data-metric-card]').forEach(function (card) {
            const key = card.getAttribute('data-metric-card');
            const metric = dashboardData.metrics[key];

            if (!metric) return;

            const valueNode = card.querySelector('[data-metric-value]');
            const footerNode = card.querySelector('[data-metric-footer]');
            const badgeNode = card.querySelector('[data-metric-badge]');

            if (valueNode) valueNode.innerHTML = String(metric.value);
            if (footerNode) setTextContent(footerNode, metric.footer);

            if (badgeNode) {
                badgeNode.textContent = key === 'activeVehicles' ? 'Active' :
                                        key === 'availableVehicles' ? 'Ready' :
                                        key === 'maintenanceVehicles' ? 'In Shop' :
                                        key === 'activeTrips' ? 'Running' : 'Draft';
                badgeNode.className = 'badge bg-' + (metric.tone === 'danger' ? 'danger' : metric.tone === 'success' ? 'success' : metric.tone === 'warning' ? 'warning text-dark' : 'info');
            }
        });
    }

    // Renders the trips log table
    function renderTrips(root) {
        const tbody = root.querySelector('[data-trip-table-body]');
        const emptyState = root.querySelector('[data-trip-empty]');
        const template = document.getElementById('trip-row-template');

        if (!tbody || !template) return;

        tbody.innerHTML = '';

        if (!dashboardData.trips || !dashboardData.trips.length) {
            tbody.classList.add('d-none');
            if (emptyState) emptyState.classList.remove('d-none');
            return;
        }

        if (emptyState) emptyState.classList.add('d-none');
        tbody.classList.remove('d-none');

        dashboardData.trips.forEach(function (trip) {
            const row = template.content.cloneNode(true);
            const tripId = row.querySelector('[data-field="tripId"]');
            const vehicle = row.querySelector('[data-field="vehicle"]');
            const driver = row.querySelector('[data-field="driver"]');
            const destination = row.querySelector('[data-field="destination"]');
            const status = row.querySelector('[data-field="status"]');
            const eta = row.querySelector('[data-field="eta"]');
            const badge = row.querySelector('[data-status-badge]');
            const actionsCell = row.querySelector('[data-row-actions]');

            setTextContent(tripId, trip.trip_id);
            // Since vehicle_id/driver_id are links, we can display them or resolve names if loaded. 
            // For simplicity we show registration & driver name if populated or format IDs
            setTextContent(vehicle, trip.vehicle_registration || trip.vehicle_id || '--');
            setTextContent(driver, trip.driver_name || trip.driver_id || '--');
            setTextContent(destination, trip.destination);
            setTextContent(status, trip.status);
            setTextContent(eta, trip.eta || '--');

            if (badge) {
                badge.className = 'badge bg-' + getToneForStatus(trip.status);
            }

            // Render action buttons depending on trip state
            if (actionsCell) {
                actionsCell.innerHTML = '';
                if (trip.status === 'Draft') {
                    const dispBtn = document.createElement('button');
                    dispBtn.className = 'btn btn-sm btn-app-primary me-2';
                    dispBtn.innerHTML = '<i class="bi bi-send me-1"></i>Dispatch';
                    dispBtn.onclick = () => handleDispatch(trip.id);
                    
                    const cancBtn = document.createElement('button');
                    cancBtn.className = 'btn btn-sm btn-outline-danger';
                    cancBtn.innerHTML = '<i class="bi bi-trash me-1"></i>Cancel';
                    cancBtn.onclick = () => handleCancel(trip.id);

                    actionsCell.appendChild(dispBtn);
                    actionsCell.appendChild(cancBtn);
                } else if (trip.status === 'Dispatched') {
                    const compBtn = document.createElement('button');
                    compBtn.className = 'btn btn-sm btn-success me-2';
                    compBtn.innerHTML = '<i class="bi bi-check-circle me-1"></i>Complete';
                    compBtn.onclick = () => promptComplete(trip);

                    const cancBtn = document.createElement('button');
                    cancBtn.className = 'btn btn-sm btn-outline-danger';
                    cancBtn.innerHTML = '<i class="bi bi-x-circle me-1"></i>Cancel';
                    cancBtn.onclick = () => handleCancel(trip.id);

                    actionsCell.appendChild(compBtn);
                    actionsCell.appendChild(cancBtn);
                } else {
                    actionsCell.innerHTML = '<span class="text-app-muted small">No actions</span>';
                }
            }

            tbody.appendChild(row);
        });
    }

    // Handles Utilization stats
    function renderUtilization(root) {
        const uMetrics = dashboardData.metrics.utilization;
        if (!uMetrics) return;

        const percentageNode = root.querySelector('[data-utilization-percentage]');
        const summaryNode = root.querySelector('[data-utilization-summary]');
        const usedLabel = root.querySelector('[data-utilization-used-label]');
        const availableLabel = root.querySelector('[data-utilization-available-label]');
        const maintenanceLabel = root.querySelector('[data-utilization-maintenance-label]');
        const usedBar = root.querySelector('[data-utilization-used-bar]');
        const availableBar = root.querySelector('[data-utilization-available-bar]');
        const maintenanceBar = root.querySelector('[data-utilization-maintenance-bar]');

        if (percentageNode) setTextContent(percentageNode, uMetrics.percentage + '%');
        if (summaryNode) setTextContent(summaryNode, uMetrics.summary);

        const activeVal = dashboardData.metrics.activeVehicles ? dashboardData.metrics.activeVehicles.value : 0;
        const availVal = dashboardData.metrics.availableVehicles ? dashboardData.metrics.availableVehicles.value : 0;
        const maintVal = dashboardData.metrics.maintenanceVehicles ? dashboardData.metrics.maintenanceVehicles.value : 0;
        const total = activeVal + availVal + maintVal || 1;

        const activePct = Math.round((activeVal / total) * 100);
        const availPct = Math.round((availVal / total) * 100);
        const maintPct = total - activePct - availPct > 0 ? 100 - activePct - availPct : 0;

        if (usedLabel) usedLabel.textContent = activePct + '%';
        if (usedBar) usedBar.style.width = activePct + '%';

        if (availableLabel) availableLabel.textContent = availPct + '%';
        if (availableBar) availableBar.style.width = availPct + '%';

        if (maintenanceLabel) maintenanceLabel.textContent = maintPct + '%';
        if (maintenanceBar) maintenanceBar.style.width = maintPct + '%';
    }

    // Renders quick operational analytics
    function renderQuickStats(root) {
        const overall = dashboardData.overall;
        if (!overall) return;

        setTextContent(root.querySelector('[data-stat-field="fuelEfficiency"]'), overall.fuelEfficiency || '0.0 km/L');
        setTextContent(root.querySelector('[data-stat-field="tripDistance"]'), overall.tripDistance || '0 km');
        setTextContent(root.querySelector('[data-stat-field="revenue"]'), overall.revenue || '₹0.0M');
        setTextContent(root.querySelector('[data-stat-field="safetyScore"]'), overall.safetyScore || '100%');
    }

    // Configures doughnut chart for Fleet status distribution
    function createFleetStatusChart(root, data) {
        const canvas = root.querySelector('#fleetStatusChart');
        const wrap = root.querySelector('[data-fleet-chart-wrap]');
        const loading = root.querySelector('[data-fleet-chart-loading]');
        const empty = root.querySelector('[data-fleet-chart-empty]');

        if (!canvas || !window.Chart) return;

        if (loading) loading.classList.add('d-none');

        if (!data || !data.values || !data.values.some(v => v > 0)) {
            if (wrap) wrap.classList.add('d-none');
            if (empty) empty.classList.remove('d-none');
            return;
        }

        if (empty) empty.classList.add('d-none');
        if (wrap) wrap.classList.remove('d-none');

        if (fleetStatusChartInstance) {
            fleetStatusChartInstance.destroy();
        }

        fleetStatusChartInstance = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: data.colors,
                    borderColor: '#222428',
                    borderWidth: 2,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '62%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#f5f5f5',
                            boxWidth: 12,
                            boxHeight: 12,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    }
                }
            }
        });
    }

    // Configures bar chart for monthly trips
    function createMonthlyTripsChart(root, data) {
        const canvas = root.querySelector('#monthlyTripsChart');
        const wrap = root.querySelector('[data-monthly-chart-wrap]');
        const loading = root.querySelector('[data-monthly-chart-loading]');
        const empty = root.querySelector('[data-monthly-chart-empty]');

        if (!canvas || !window.Chart) return;

        if (loading) loading.classList.add('d-none');

        if (!data || !data.values || !data.values.some(v => v > 0)) {
            if (wrap) wrap.classList.add('d-none');
            if (empty) empty.classList.remove('d-none');
            return;
        }

        if (empty) empty.classList.add('d-none');
        if (wrap) wrap.classList.remove('d-none');

        if (monthlyTripsChartInstance) {
            monthlyTripsChartInstance.destroy();
        }

        monthlyTripsChartInstance = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Trips Dispatched',
                    data: data.values,
                    backgroundColor: data.color,
                    borderRadius: 10,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.06)' },
                        ticks: { color: '#a7a7a7' }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.06)' },
                        ticks: { color: '#a7a7a7', stepSize: 1 }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    async function loadDashboardData(filters = {}) {
        const root = document.querySelector('[data-dashboard-root]');
        if (!root) return;

        try {
            // 1. Fetch dashboard KPIs
            const dashRes = await api.analytics.getDashboard(filters);
            dashboardData.metrics = dashRes.metrics;
            dashboardData.charts = dashRes.charts;

            // 2. Fetch reports ROI / operational stats
            const repRes = await api.analytics.getReports();
            dashboardData.overall = repRes.overall;

            // 3. Fetch all trips
            const allTrips = await api.trips.list();
            
            // Resolve vehicle/driver names for trips to make the table look complete
            const vehicles = await api.vehicles.list();
            const drivers = await api.drivers.list();

            const vehMap = {};
            vehicles.forEach(v => { vehMap[v.id] = `${v.name_model} (${v.registration_number})`; });

            const drvMap = {};
            drivers.forEach(d => { drvMap[d.id] = d.name; });

            dashboardData.trips = allTrips.map(t => ({
                ...t,
                vehicle_registration: vehMap[t.vehicle_id] || t.vehicle_id,
                driver_name: drvMap[t.driver_id] || t.driver_id
            }));

            // Render elements
            renderMetrics(root);
            renderTrips(root);
            renderUtilization(root);
            renderQuickStats(root);
            
            // Render charts
            createFleetStatusChart(root, dashboardData.charts.fleetStatusDistribution);
            createMonthlyTripsChart(root, dashboardData.charts.monthlyTrips);

        } catch (err) {
            console.error('Error loading dashboard data:', err);
        }
    }

    // Modal populate helpers
    async function populateModals() {
        try {
            const vehicles = await api.vehicles.list();
            const drivers = await api.drivers.list();

            // Populate vehicle options for Create Trip (Available only)
            const tripVehicleSelect = document.getElementById('modal_vehicle_select');
            if (tripVehicleSelect) {
                tripVehicleSelect.innerHTML = '<option value="" disabled selected>Select available vehicle</option>';
                vehicles.filter(v => v.status === 'Available').forEach(v => {
                    tripVehicleSelect.innerHTML += `<option value="${v.id}">${v.name_model} - ${v.registration_number} (Max: ${v.max_load_capacity} kg)</option>`;
                });
            }

            // Populate driver options for Create Trip (Available only)
            const tripDriverSelect = document.getElementById('modal_driver_select');
            if (tripDriverSelect) {
                tripDriverSelect.innerHTML = '<option value="" disabled selected>Select available driver</option>';
                
                // Filter out drivers with expired licenses
                const activeDrivers = drivers.filter(d => {
                    if (d.status !== 'Available') return false;
                    try {
                        const expiry = new Date(d.license_expiry_date);
                        return expiry >= new Date();
                    } catch(e) {
                        return false;
                    }
                });

                activeDrivers.forEach(d => {
                    tripDriverSelect.innerHTML += `<option value="${d.id}">${d.name} (${d.license_category})</option>`;
                });
            }

            // Populate vehicle options for Maintenance (Available or In Shop/In Maintenance only, i.e., not On Trip or Retired)
            const maintVehicleSelect = document.getElementById('maint_vehicle_select');
            if (maintVehicleSelect) {
                maintVehicleSelect.innerHTML = '<option value="" disabled selected>Select vehicle</option>';
                vehicles.filter(v => v.status !== 'Retired' && v.status !== 'On Trip').forEach(v => {
                    maintVehicleSelect.innerHTML += `<option value="${v.id}">${v.name_model} - ${v.registration_number} [${v.status}]</option>`;
                });
            }

        } catch (err) {
            console.error('Error populating modals:', err);
        }
    }

    // API Actions
    async function handleDispatch(tripId) {
        if (!confirm('Are you sure you want to dispatch this trip?')) return;
        try {
            await api.trips.dispatch(tripId);
            loadDashboardData();
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleCancel(tripId) {
        if (!confirm('Are you sure you want to cancel this trip?')) return;
        try {
            await api.trips.cancel(tripId);
            loadDashboardData();
        } catch (err) {
            alert(err.message);
        }
    }

    function promptComplete(trip) {
        const finalOdometer = prompt("Enter the final odometer reading (km) for the vehicle:", "");
        if (finalOdometer === null) return;
        const fuel = prompt("Enter the fuel consumed (liters) for this trip:", "0");
        if (fuel === null) return;
        const cost = prompt("Enter the fuel cost (₹) for this trip:", "0");
        if (cost === null) return;

        const odoNum = parseFloat(finalOdometer);
        const fuelNum = parseFloat(fuel);
        const costNum = parseFloat(cost);

        if (isNaN(odoNum)) {
            alert("Please enter a valid odometer number.");
            return;
        }

        api.trips.complete(trip.id, odoNum, fuelNum, costNum)
            .then(() => {
                alert("Trip completed successfully!");
                loadDashboardData();
            })
            .catch(err => alert(err.message));
    }

    // Init listeners
    function init() {
        const root = document.querySelector('[data-dashboard-root]');
        if (!root) return;

        loadDashboardData();

        // Populate modals when opened
        const tripModal = document.getElementById('createTripModal');
        if (tripModal) {
            tripModal.addEventListener('show.bs.modal', populateModals);
        }
        const maintModal = document.getElementById('logMaintenanceModal');
        if (maintModal) {
            maintModal.addEventListener('show.bs.modal', populateModals);
        }

        // Handle Create Trip Submit
        const tripForm = document.getElementById('create-trip-form');
        if (tripForm) {
            tripForm.addEventListener('submit', async function (e) {
                e.preventDefault();
                const errDiv = document.getElementById('trip-modal-error');
                errDiv.classList.add('d-none');

                const payload = {
                    trip_id: document.getElementById('modal_trip_id').value,
                    cargo_weight: parseFloat(document.getElementById('modal_cargo_weight').value),
                    source: document.getElementById('modal_source').value,
                    destination: document.getElementById('modal_destination').value,
                    vehicle_id: document.getElementById('modal_vehicle_select').value,
                    driver_id: document.getElementById('modal_driver_select').value,
                    planned_distance: parseFloat(document.getElementById('modal_distance').value),
                    eta: document.getElementById('modal_eta').value,
                    status: 'Draft'
                };

                try {
                    // Create the draft trip
                    const newTrip = await api.trips.create(payload);
                    
                    // Dispatch the trip
                    await api.trips.dispatch(newTrip.id);
                    
                    // Close Modal
                    const bsModal = bootstrap.Modal.getInstance(tripModal);
                    bsModal.hide();
                    tripForm.reset();

                    // Reload
                    loadDashboardData();
                } catch (err) {
                    errDiv.textContent = err.message;
                    errDiv.classList.remove('d-none');
                }
            });
        }

        // Handle Log Maintenance Submit
        const maintForm = document.getElementById('log-maintenance-form');
        if (maintForm) {
            maintForm.addEventListener('submit', async function (e) {
                e.preventDefault();
                const errDiv = document.getElementById('maint-modal-error');
                errDiv.classList.add('d-none');

                const payload = {
                    vehicle_id: document.getElementById('maint_vehicle_select').value,
                    type: document.getElementById('maint_type').value,
                    cost: parseFloat(document.getElementById('maint_cost').value) || 0,
                    start_date: document.getElementById('maint_date').value,
                    notes: document.getElementById('maint_notes').value,
                    status: 'Active'
                };

                try {
                    await api.maintenance.create(payload);

                    // Close Modal
                    const bsModal = bootstrap.Modal.getInstance(maintModal);
                    bsModal.hide();
                    maintForm.reset();

                    // Reload
                    loadDashboardData();
                } catch (err) {
                    errDiv.textContent = err.message;
                    errDiv.classList.remove('d-none');
                }
            });
        }

        // Filter Actions
        const applyBtn = document.getElementById('applyFiltersBtn');
        if (applyBtn) {
            applyBtn.addEventListener('click', function () {
                const filters = {
                    type: document.getElementById('vehicleTypeFilter').value,
                    status: document.getElementById('statusFilter').value,
                    search: document.getElementById('dashboardSearch').value
                };
                loadDashboardData(filters);
            });
        }

        const resetBtn = document.getElementById('resetFiltersBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                document.getElementById('vehicleTypeFilter').value = 'all';
                document.getElementById('statusFilter').value = 'all';
                document.getElementById('dashboardSearch').value = '';
                loadDashboardData();
            });
        }

        // Export CSV report
        const exportBtn = document.getElementById('exportReportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', function () {
                if (!dashboardData.trips.length) {
                    alert("No data available to export.");
                    return;
                }

                let csvContent = "data:text/csv;charset=utf-8,";
                csvContent += "Trip ID,Vehicle,Driver,Source,Destination,Cargo Weight (kg),Distance (km),Status,ETA,Date Created\n";

                dashboardData.trips.forEach(function (row) {
                    const rowData = [
                        row.trip_id,
                        row.vehicle_registration || row.vehicle_id,
                        row.driver_name || row.driver_id,
                        row.source,
                        row.destination,
                        row.cargo_weight,
                        row.planned_distance,
                        row.status,
                        row.eta,
                        row.created_at
                    ].map(val => `"${String(val || '').replace(/"/g, '""')}"`).join(",");
                    
                    csvContent += rowData + "\n";
                });

                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `transitops_dispatches_${new Date().toISOString().slice(0,10)}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();