(function () {
    var dashboardData = {
        metrics: {
            activeVehicles: {
                value: 53,
                footer: '+3 this week',
                tone: 'success'
            },
            availableVehicles: {
                value: 42,
                footer: 'Ready for dispatch',
                tone: 'info'
            },
            maintenanceVehicles: {
                value: 5,
                footer: 'Scheduled service',
                tone: 'danger'
            },
            activeTrips: {
                value: 18,
                footer: 'Currently on route',
                tone: 'info'
            },
            pendingTrips: {
                value: 9,
                footer: 'Awaiting dispatch',
                tone: 'warning'
            }
        },
        trips: [
            {
                tripId: 'TRP-1001',
                vehicle: 'Van-05',
                driver: 'Alex',
                destination: 'Ahmedabad',
                status: 'On Trip',
                eta: '13:40'
            },
            {
                tripId: 'TRP-1002',
                vehicle: 'Truck-12',
                driver: 'Marcus',
                destination: 'Surat',
                status: 'Completed',
                eta: '--'
            },
            {
                tripId: 'TRP-1003',
                vehicle: 'Bus-03',
                driver: 'Sarah',
                destination: 'Rajkot',
                status: 'Dispatched',
                eta: '15:20'
            },
            {
                tripId: 'TRP-1004',
                vehicle: 'Mini Van',
                driver: 'John',
                destination: 'Vadodara',
                status: 'Draft',
                eta: '--'
            },
            {
                tripId: 'TRP-1005',
                vehicle: 'Truck-22',
                driver: 'Emily',
                destination: 'Mumbai',
                status: 'Cancelled',
                eta: '--'
            }
        ],
        utilization: {
            percentage: 81,
            summary: '53% vehicles in use, 42% available, 5% in maintenance.',
            segments: [
                {
                    label: 'Vehicles In Use',
                    value: 53,
                    tone: 'success'
                },
                {
                    label: 'Available',
                    value: 42,
                    tone: 'info'
                },
                {
                    label: 'Maintenance',
                    value: 5,
                    tone: 'warning'
                }
            ]
        },
        quickStats: {
            fuelEfficiency: '12.8 km/L',
            tripDistance: '143 km',
            revenue: '₹2.4M',
            safetyScore: '94%'
        },
        charts: {
            fleetStatusDistribution: {
                labels: ['Available', 'On Trip', 'Maintenance', 'Retired'],
                values: [42, 53, 5, 4],
                colors: ['#2ecc71', '#4aa3ff', '#f39c12', '#8f8f8f']
            },
            monthlyTrips: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                values: [84, 96, 108, 123, 135, 128, 141, 150, 146, 139, 154, 161],
                color: '#f4a259'
            }
        }
    };

    var statusToneMap = {
        available: 'success',
        'on trip': 'info',
        completed: 'success',
        dispatched: 'info',
        cancelled: 'danger',
        draft: 'warning',
        maintenance: 'danger',
        suspended: 'warning',
        'off duty': 'warning',
        expired: 'danger'
    };

    function setTextContent(element, value) {
        if (!element) {
            return;
        }

        element.textContent = value;
    }

    function getToneForStatus(status) {
        return statusToneMap[String(status || '').toLowerCase()] || 'info';
    }

    function renderMetrics(root) {
        root.querySelectorAll('[data-metric-card]').forEach(function (card) {
            var key = card.getAttribute('data-metric-card');
            var metric = dashboardData.metrics[key];

            if (!metric) {
                return;
            }

            var valueNode = card.querySelector('[data-metric-value]');
            var footerNode = card.querySelector('[data-metric-footer]');
            var badgeNode = card.querySelector('[data-metric-badge]');

            if (valueNode) {
                valueNode.innerHTML = String(metric.value);
            }

            setTextContent(footerNode, metric.footer);

            if (badgeNode) {
                badgeNode.classList.remove('app-badge-success', 'app-badge-info', 'app-badge-warning', 'app-badge-danger');
                badgeNode.classList.add('app-badge-' + metric.tone);
            }
        });
    }

    function renderTrips(root) {
        var loadingRows = root.querySelectorAll('[data-loading-row]');
        var tbody = root.querySelector('[data-trip-table-body]');
        var emptyState = root.querySelector('[data-trip-empty]');
        var template = document.getElementById('trip-row-template');

        if (!tbody || !template) {
            return;
        }

        loadingRows.forEach(function (row) {
            row.remove();
        });

        if (!dashboardData.trips.length) {
            tbody.classList.add('d-none');
            if (emptyState) {
                emptyState.classList.remove('d-none');
            }
            return;
        }

        if (emptyState) {
            emptyState.classList.add('d-none');
        }

        tbody.classList.remove('d-none');

        dashboardData.trips.forEach(function (trip) {
            var row = template.content.cloneNode(true);
            var tripId = row.querySelector('[data-field="tripId"]');
            var vehicle = row.querySelector('[data-field="vehicle"]');
            var driver = row.querySelector('[data-field="driver"]');
            var destination = row.querySelector('[data-field="destination"]');
            var status = row.querySelector('[data-field="status"]');
            var eta = row.querySelector('[data-field="eta"]');
            var badge = row.querySelector('[data-status-badge]');
            var tone = getToneForStatus(trip.status);

            setTextContent(tripId, trip.tripId);
            setTextContent(vehicle, trip.vehicle);
            setTextContent(driver, trip.driver);
            setTextContent(destination, trip.destination);
            setTextContent(status, trip.status);
            setTextContent(eta, trip.eta);

            if (badge) {
                badge.classList.remove('app-badge-success', 'app-badge-info', 'app-badge-warning', 'app-badge-danger');
                badge.classList.add('app-badge-' + tone);
            }

            tbody.appendChild(row);
        });
    }

    function renderUtilization(root) {
        var content = root.querySelector('[data-utilization-content]');
        var emptyState = root.querySelector('[data-utilization-empty]');

        if (!dashboardData.utilization) {
            if (content) {
                content.classList.add('d-none');
            }

            if (emptyState) {
                emptyState.classList.remove('d-none');
            }

            return;
        }

        var percentageNode = root.querySelector('[data-utilization-percentage]');
        var summaryNode = root.querySelector('[data-utilization-summary]');
        var usedLabel = root.querySelector('[data-utilization-used-label]');
        var availableLabel = root.querySelector('[data-utilization-available-label]');
        var maintenanceLabel = root.querySelector('[data-utilization-maintenance-label]');
        var usedBar = root.querySelector('[data-utilization-used-bar]');
        var availableBar = root.querySelector('[data-utilization-available-bar]');
        var maintenanceBar = root.querySelector('[data-utilization-maintenance-bar]');

        setTextContent(percentageNode, dashboardData.utilization.percentage + '%');
        setTextContent(summaryNode, dashboardData.utilization.summary);

        if (dashboardData.utilization.segments[0]) {
            setTextContent(usedLabel, dashboardData.utilization.segments[0].value + '%');
            usedBar.style.width = dashboardData.utilization.segments[0].value + '%';
        }

        if (dashboardData.utilization.segments[1]) {
            setTextContent(availableLabel, dashboardData.utilization.segments[1].value + '%');
            availableBar.style.width = dashboardData.utilization.segments[1].value + '%';
        }

        if (dashboardData.utilization.segments[2]) {
            setTextContent(maintenanceLabel, dashboardData.utilization.segments[2].value + '%');
            maintenanceBar.style.width = dashboardData.utilization.segments[2].value + '%';
        }
    }

    function renderQuickStats(root) {
        var statsContent = root.querySelector('[data-stats-content]');
        var statsEmpty = root.querySelector('[data-stats-empty]');

        if (!dashboardData.quickStats) {
            if (statsContent) {
                statsContent.classList.add('d-none');
            }

            if (statsEmpty) {
                statsEmpty.classList.remove('d-none');
            }

            return;
        }

        setTextContent(root.querySelector('[data-stat-field="fuelEfficiency"]'), dashboardData.quickStats.fuelEfficiency);
        setTextContent(root.querySelector('[data-stat-field="tripDistance"]'), dashboardData.quickStats.tripDistance);
        setTextContent(root.querySelector('[data-stat-field="revenue"]'), dashboardData.quickStats.revenue);
        setTextContent(root.querySelector('[data-stat-field="safetyScore"]'), dashboardData.quickStats.safetyScore);
    }

    function createFleetStatusChart(canvas) {
        if (!canvas || !window.Chart) {
            return;
        }

        var data = dashboardData.charts.fleetStatusDistribution;

        if (!data || !data.values.length) {
            return;
        }

        return new Chart(canvas, {
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
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return ' ' + context.label + ': ' + context.parsed;
                            }
                        }
                    }
                }
            }
        });
    }

    function createMonthlyTripsChart(canvas) {
        if (!canvas || !window.Chart) {
            return;
        }

        var data = dashboardData.charts.monthlyTrips;

        if (!data || !data.values.length) {
            return;
        }

        return new Chart(canvas, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Trips',
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
                        grid: {
                            color: 'rgba(255, 255, 255, 0.06)'
                        },
                        ticks: {
                            color: '#a7a7a7'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.06)'
                        },
                        ticks: {
                            color: '#a7a7a7'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return ' ' + context.parsed.y + ' trips';
                            }
                        }
                    }
                }
            }
        });
    }

    function renderCharts(root) {
        var fleetEmpty = root.querySelector('[data-fleet-chart-empty]');
        var monthlyEmpty = root.querySelector('[data-monthly-chart-empty]');
        var fleetLoading = root.querySelector('[data-fleet-chart-loading]');
        var monthlyLoading = root.querySelector('[data-monthly-chart-loading]');
        var fleetWrap = root.querySelector('[data-fleet-chart-wrap]');
        var monthlyWrap = root.querySelector('[data-monthly-chart-wrap]');
        var fleetCanvas = root.querySelector('#fleetStatusChart');
        var monthlyCanvas = root.querySelector('#monthlyTripsChart');

        if (!dashboardData.charts.fleetStatusDistribution.values.length) {
            if (fleetLoading) {
                fleetLoading.classList.add('d-none');
            }

            if (fleetWrap) {
                fleetWrap.classList.add('d-none');
            }

            if (fleetEmpty) {
                fleetEmpty.classList.remove('d-none');
            }
        } else {
            if (fleetLoading) {
                fleetLoading.classList.add('d-none');
            }

            createFleetStatusChart(fleetCanvas);
        }

        if (!dashboardData.charts.monthlyTrips.values.length) {
            if (monthlyLoading) {
                monthlyLoading.classList.add('d-none');
            }

            if (monthlyWrap) {
                monthlyWrap.classList.add('d-none');
            }

            if (monthlyEmpty) {
                monthlyEmpty.classList.remove('d-none');
            }
        } else {
            if (monthlyLoading) {
                monthlyLoading.classList.add('d-none');
            }

            createMonthlyTripsChart(monthlyCanvas);
        }
    }

    function init() {
        var root = document.querySelector('[data-dashboard-root]');

        if (!root) {
            return;
        }

        renderMetrics(root);
        renderTrips(root);
        renderUtilization(root);
        renderQuickStats(root);
        renderCharts(root);
    }

    document.addEventListener('DOMContentLoaded', init);

    window.TransitOpsDashboard = dashboardData;
})();