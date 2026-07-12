(function () {
    var tripDispatcherData = {
        loading: true,
        pageSize: 4,
        currentPage: 1,
        searchTerm: '',
        sort: {
            field: 'tripId',
            direction: 'asc'
        },
        filters: {
            status: 'all',
            vehicleType: 'all',
            region: 'all',
            dateRange: 'all'
        },
        draftFilters: {
            status: 'all',
            vehicleType: 'all',
            region: 'all',
            dateRange: 'all'
        },
        options: {
            statusLabels: {
                all: 'All statuses',
                Draft: 'Draft',
                Dispatched: 'Dispatched',
                'On Trip': 'On Trip',
                Completed: 'Completed',
                Cancelled: 'Cancelled'
            },
            vehicleTypeLabels: {
                all: 'All vehicle types',
                Van: 'Van',
                Truck: 'Truck',
                Bus: 'Bus',
                Pickup: 'Pickup'
            },
            regionLabels: {
                all: 'All regions',
                North: 'North',
                South: 'South',
                East: 'East',
                West: 'West'
            },
            dateRangeLabels: {
                all: 'All dates',
                today: 'Today',
                last7: 'Last 7 days',
                thisMonth: 'This month'
            }
        },
        vehicles: [
            {
                id: 'veh-001',
                name: 'Van-05',
                type: 'Van',
                region: 'North',
                status: 'Available',
                capacityValue: 500,
                capacityUnit: 'kg'
            },
            {
                id: 'veh-002',
                name: 'Truck-12',
                type: 'Truck',
                region: 'West',
                status: 'Available',
                capacityValue: 2500,
                capacityUnit: 'kg'
            },
            {
                id: 'veh-003',
                name: 'Bus-03',
                type: 'Bus',
                region: 'South',
                status: 'Available',
                capacityValue: 48,
                capacityUnit: 'Passengers'
            },
            {
                id: 'veh-004',
                name: 'Pickup-09',
                type: 'Pickup',
                region: 'East',
                status: 'Available',
                capacityValue: 900,
                capacityUnit: 'kg'
            },
            {
                id: 'veh-005',
                name: 'Van-11',
                type: 'Van',
                region: 'North',
                status: 'Maintenance',
                capacityValue: 650,
                capacityUnit: 'kg'
            },
            {
                id: 'veh-006',
                name: 'Truck-18',
                type: 'Truck',
                region: 'West',
                status: 'Retired',
                capacityValue: 3200,
                capacityUnit: 'kg'
            },
            {
                id: 'veh-007',
                name: 'Bus-07',
                type: 'Bus',
                region: 'South',
                status: 'On Trip',
                capacityValue: 36,
                capacityUnit: 'Passengers'
            },
            {
                id: 'veh-008',
                name: 'Pickup-14',
                type: 'Pickup',
                region: 'East',
                status: 'Available',
                capacityValue: 800,
                capacityUnit: 'kg'
            }
        ],
        drivers: [
            {
                id: 'drv-001',
                name: 'Alex Johnson',
                licenseNumber: 'DL-GJ-872312',
                licenseCategory: 'LMV',
                licenseExpiryDate: '2028-08-12',
                status: 'Available'
            },
            {
                id: 'drv-002',
                name: 'Sarah Connor',
                licenseNumber: 'DL-GJ-201887',
                licenseCategory: 'HMV',
                licenseExpiryDate: '2027-01-18',
                status: 'Available'
            },
            {
                id: 'drv-003',
                name: 'Marcus Lee',
                licenseNumber: 'DL-GJ-001221',
                licenseCategory: 'LMV',
                licenseExpiryDate: '2025-05-02',
                status: 'Suspended'
            },
            {
                id: 'drv-004',
                name: 'Emily Davis',
                licenseNumber: 'DL-GJ-876552',
                licenseCategory: 'HMV',
                licenseExpiryDate: '2029-11-30',
                status: 'Available'
            },
            {
                id: 'drv-005',
                name: 'Aisha Khan',
                licenseNumber: 'DL-GJ-445190',
                licenseCategory: 'PSV',
                licenseExpiryDate: '2026-09-15',
                status: 'On Trip'
            },
            {
                id: 'drv-006',
                name: 'Raj Patel',
                licenseNumber: 'DL-GJ-552178',
                licenseCategory: 'LMV',
                licenseExpiryDate: '2028-03-27',
                status: 'Available'
            },
            {
                id: 'drv-007',
                name: 'Nina Gomez',
                licenseNumber: 'DL-GJ-332901',
                licenseCategory: 'HMV',
                licenseExpiryDate: '2026-12-05',
                status: 'Available'
            },
            {
                id: 'drv-008',
                name: 'Omar Hussain',
                licenseNumber: 'DL-GJ-110244',
                licenseCategory: 'LMV',
                licenseExpiryDate: '2027-04-09',
                status: 'Expired'
            }
        ],
        trips: [
            {
                id: 'trip-001',
                tripId: 'TRP-1001',
                source: 'Rajkot',
                destination: 'Ahmedabad',
                vehicleId: 'veh-001',
                driverId: 'drv-001',
                cargoWeightValue: 450,
                cargoWeightUnit: 'kg',
                distanceValue: 220,
                status: 'Dispatched',
                region: 'North',
                tripDate: '2026-07-12'
            },
            {
                id: 'trip-002',
                tripId: 'TRP-1002',
                source: 'Surat',
                destination: 'Mumbai',
                vehicleId: 'veh-002',
                driverId: 'drv-002',
                cargoWeightValue: 1800,
                cargoWeightUnit: 'kg',
                distanceValue: 310,
                status: 'On Trip',
                region: 'West',
                tripDate: '2026-07-11'
            },
            {
                id: 'trip-003',
                tripId: 'TRP-1003',
                source: 'Rajkot',
                destination: 'Jamnagar',
                vehicleId: 'veh-003',
                driverId: 'drv-004',
                cargoWeightValue: 42,
                cargoWeightUnit: 'Passengers',
                distanceValue: 90,
                status: 'Completed',
                region: 'South',
                tripDate: '2026-07-09'
            },
            {
                id: 'trip-004',
                tripId: 'TRP-1004',
                source: 'Rajkot',
                destination: 'Bhavnagar',
                vehicleId: 'veh-004',
                driverId: 'drv-006',
                cargoWeightValue: 650,
                cargoWeightUnit: 'kg',
                distanceValue: 175,
                status: 'Draft',
                region: 'East',
                tripDate: '2026-07-12'
            },
            {
                id: 'trip-005',
                tripId: 'TRP-1005',
                source: 'Vadodara',
                destination: 'Surat',
                vehicleId: 'veh-008',
                driverId: 'drv-007',
                cargoWeightValue: 300,
                cargoWeightUnit: 'kg',
                distanceValue: 160,
                status: 'Cancelled',
                region: 'West',
                tripDate: '2026-07-08'
            },
            {
                id: 'trip-006',
                tripId: 'TRP-1006',
                source: 'Ahmedabad',
                destination: 'Junagadh',
                vehicleId: 'veh-001',
                driverId: 'drv-001',
                cargoWeightValue: 380,
                cargoWeightUnit: 'kg',
                distanceValue: 245,
                status: 'Dispatched',
                region: 'North',
                tripDate: '2026-07-10'
            },
            {
                id: 'trip-007',
                tripId: 'TRP-1007',
                source: 'Surat',
                destination: 'Rajkot',
                vehicleId: 'veh-002',
                driverId: 'drv-004',
                cargoWeightValue: 1450,
                cargoWeightUnit: 'kg',
                distanceValue: 290,
                status: 'On Trip',
                region: 'West',
                tripDate: '2026-07-11'
            },
            {
                id: 'trip-008',
                tripId: 'TRP-1008',
                source: 'Bhuj',
                destination: 'Ahmedabad',
                vehicleId: 'veh-004',
                driverId: 'drv-006',
                cargoWeightValue: 700,
                cargoWeightUnit: 'kg',
                distanceValue: 365,
                status: 'Draft',
                region: 'East',
                tripDate: '2026-07-12'
            }
        ]
    };

    window.tripDispatcherData = tripDispatcherData;

    var state = {
        editingId: null,
        viewId: null,
        pendingDeleteId: null
    };

    var dom = {};

    function getTripById(id) {
        return tripDispatcherData.trips.find(function (trip) {
            return trip.id === id;
        }) || null;
    }

    function getVehicleById(id) {
        return tripDispatcherData.vehicles.find(function (vehicle) {
            return vehicle.id === id;
        }) || null;
    }

    function getDriverById(id) {
        return tripDispatcherData.drivers.find(function (driver) {
            return driver.id === id;
        }) || null;
    }

    function getVehicleName(vehicleId) {
        var vehicle = getVehicleById(vehicleId);

        return vehicle ? vehicle.name : '--';
    }

    function getDriverName(driverId) {
        var driver = getDriverById(driverId);

        return driver ? driver.name : '--';
    }

    function formatNumber(value) {
        return new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: 2
        }).format(Number(value || 0));
    }

    function formatDistance(value) {
        return formatNumber(value) + ' km';
    }

    function formatCargoWeight(trip) {
        if (!trip) {
            return '--';
        }

        return formatNumber(trip.cargoWeightValue) + ' ' + trip.cargoWeightUnit.toLowerCase();
    }

    function formatDate(value) {
        if (!value) {
            return '--';
        }

        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(new Date(value + 'T00:00:00'));
    }

    function formatDateKey(value) {
        if (!value) {
            return '';
        }

        var date = new Date(value + 'T00:00:00');
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var day = String(date.getDate()).padStart(2, '0');

        return year + '-' + month + '-' + day;
    }

    function getTodayKey() {
        var today = new Date();
        var year = today.getFullYear();
        var month = String(today.getMonth() + 1).padStart(2, '0');
        var day = String(today.getDate()).padStart(2, '0');

        return year + '-' + month + '-' + day;
    }

    function isExpired(driver) {
        var expiryDate = new Date(driver.licenseExpiryDate + 'T00:00:00');
        var today = new Date();

        today.setHours(0, 0, 0, 0);

        return expiryDate < today;
    }

    function isSelectableVehicle(vehicle) {
        return vehicle && vehicle.status === 'Available';
    }

    function isSelectableDriver(driver) {
        return driver && driver.status === 'Available' && !isExpired(driver);
    }

    function getStatusRank(status) {
        var ranks = {
            Draft: 1,
            Dispatched: 2,
            'On Trip': 3,
            Completed: 4,
            Cancelled: 5
        };

        return ranks[status] || 99;
    }

    function getStatusTone(status) {
        var tones = {
            Draft: 'warning',
            Dispatched: 'info',
            'On Trip': 'primary',
            Completed: 'success',
            Cancelled: 'danger'
        };

        return tones[status] || 'info';
    }

    function getStatusIcon(status) {
        var icons = {
            Draft: 'file-earmark',
            Dispatched: 'send',
            'On Trip': 'signpost-2',
            Completed: 'check-circle',
            Cancelled: 'x-circle'
        };

        return icons[status] || 'circle-fill';
    }

    function getFilterLabel(filterGroup, value) {
        return tripDispatcherData.options[filterGroup + 'Labels'][value] || value || '';
    }

    function matchesSearch(trip, term) {
        if (!term) {
            return true;
        }

        var vehicle = getVehicleById(trip.vehicleId);
        var driver = getDriverById(trip.driverId);
        var haystack = [trip.tripId, trip.source, trip.destination, vehicle ? vehicle.name : '', driver ? driver.name : '', trip.status].join(' ').toLowerCase();

        return haystack.indexOf(term) !== -1;
    }

    function matchesDateRange(trip, range) {
        if (range === 'all') {
            return true;
        }

        var tripDateKey = formatDateKey(trip.tripDate);
        var today = new Date();
        var startDate;

        if (range === 'today') {
            return tripDateKey === getTodayKey();
        }

        if (range === 'last7') {
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 6);
            startDate.setHours(0, 0, 0, 0);

            return new Date(trip.tripDate + 'T00:00:00') >= startDate;
        }

        if (range === 'thisMonth') {
            return today.getFullYear() === new Date(trip.tripDate + 'T00:00:00').getFullYear() && today.getMonth() === new Date(trip.tripDate + 'T00:00:00').getMonth();
        }

        return true;
    }

    function getFilteredTrips() {
        var term = tripDispatcherData.searchTerm.trim().toLowerCase();

        return tripDispatcherData.trips.filter(function (trip) {
            var vehicle = getVehicleById(trip.vehicleId);
            var matchesStatus = tripDispatcherData.filters.status === 'all' || trip.status === tripDispatcherData.filters.status;
            var matchesVehicleType = tripDispatcherData.filters.vehicleType === 'all' || (vehicle && vehicle.type === tripDispatcherData.filters.vehicleType);
            var matchesRegion = tripDispatcherData.filters.region === 'all' || trip.region === tripDispatcherData.filters.region;
            var matchesDate = matchesDateRange(trip, tripDispatcherData.filters.dateRange);

            return matchesStatus && matchesVehicleType && matchesRegion && matchesDate && matchesSearch(trip, term);
        }).sort(function (left, right) {
            var field = tripDispatcherData.sort.field;
            var direction = tripDispatcherData.sort.direction === 'asc' ? 1 : -1;
            var leftValue;
            var rightValue;
            var leftVehicle = getVehicleById(left.vehicleId);
            var rightVehicle = getVehicleById(right.vehicleId);
            var leftDriver = getDriverById(left.driverId);
            var rightDriver = getDriverById(right.driverId);

            if (field === 'tripId') {
                leftValue = Number(String(left.tripId).replace(/\D/g, ''));
                rightValue = Number(String(right.tripId).replace(/\D/g, ''));
            } else if (field === 'status') {
                leftValue = getStatusRank(left.status);
                rightValue = getStatusRank(right.status);
            } else if (field === 'driver') {
                leftValue = leftDriver ? leftDriver.name : '';
                rightValue = rightDriver ? rightDriver.name : '';
            } else if (field === 'vehicle') {
                leftValue = leftVehicle ? leftVehicle.name : '';
                rightValue = rightVehicle ? rightVehicle.name : '';
            } else if (field === 'distanceValue') {
                leftValue = Number(left.distanceValue || 0);
                rightValue = Number(right.distanceValue || 0);
            } else {
                leftValue = left[field];
                rightValue = right[field];
            }

            if (typeof leftValue === 'string' && typeof rightValue === 'string') {
                return leftValue.localeCompare(rightValue) * direction;
            }

            if (leftValue > rightValue) {
                return direction;
            }

            if (leftValue < rightValue) {
                return -direction;
            }

            return 0;
        });
    }

    function setMetricValue(cardKey, value) {
        var card = dom.root.querySelector('[data-summary-card="' + cardKey + '"]');

        if (!card) {
            return;
        }

        var valueNode = card.querySelector('[data-summary-value]');

        if (valueNode) {
            valueNode.textContent = value;
        }
    }

    function renderSummaryCards() {
        var totalTrips = tripDispatcherData.trips.length;
        var activeTrips = tripDispatcherData.trips.filter(function (trip) {
            return trip.status === 'Dispatched' || trip.status === 'On Trip';
        }).length;
        var completedTrips = tripDispatcherData.trips.filter(function (trip) {
            return trip.status === 'Completed';
        }).length;
        var cancelledTrips = tripDispatcherData.trips.filter(function (trip) {
            return trip.status === 'Cancelled';
        }).length;

        setMetricValue('total', totalTrips);
        setMetricValue('active', activeTrips);
        setMetricValue('completed', completedTrips);
        setMetricValue('cancelled', cancelledTrips);
    }

    function updateFilterButtonLabels() {
        Object.keys(tripDispatcherData.draftFilters).forEach(function (filterKey) {
            var labelNode = dom.root.querySelector('[data-filter-label="' + filterKey + '"]');

            if (labelNode) {
                labelNode.textContent = getFilterLabel(filterKey, tripDispatcherData.draftFilters[filterKey]);
            }
        });

        dom.root.querySelectorAll('[data-filter-option]').forEach(function (button) {
            var group = button.getAttribute('data-filter-group');
            var value = button.getAttribute('data-filter-value');
            var isSelected = tripDispatcherData.draftFilters[group] === value;
            var icon = button.querySelector('.bi-check2');

            button.classList.toggle('active', isSelected);

            if (icon) {
                icon.classList.toggle('opacity-0', !isSelected);
            }
        });
    }

    function updateSortIndicators() {
        dom.root.querySelectorAll('[data-sort-icon]').forEach(function (icon) {
            var field = icon.getAttribute('data-sort-icon');

            icon.className = 'bi ' + (tripDispatcherData.sort.field === field ? (tripDispatcherData.sort.direction === 'asc' ? 'bi-sort-down' : 'bi-sort-up') : 'bi-arrow-down-up');
        });
    }

    function updatePagination(totalItems) {
        var paginationHost = dom.root.querySelector('[data-trip-pagination]');
        var paginationList = paginationHost ? paginationHost.querySelector('.pagination') : null;
        var totalPages = totalItems ? Math.ceil(totalItems / tripDispatcherData.pageSize) : 0;

        if (!paginationList) {
            return;
        }

        if (totalPages <= 1) {
            paginationHost.classList.add('d-none');
            paginationList.innerHTML = '';
            return;
        }

        paginationHost.classList.remove('d-none');

        if (tripDispatcherData.currentPage > totalPages) {
            tripDispatcherData.currentPage = totalPages;
        }

        var items = [];
        var previousDisabled = tripDispatcherData.currentPage === 1;
        var nextDisabled = tripDispatcherData.currentPage === totalPages;

        items.push('<li class="page-item ' + (previousDisabled ? 'disabled' : '') + '"><button type="button" class="page-link" data-page="' + (tripDispatcherData.currentPage - 1) + '" ' + (previousDisabled ? 'tabindex="-1" aria-disabled="true"' : '') + '>Prev</button></li>');

        for (var page = 1; page <= totalPages; page += 1) {
            items.push('<li class="page-item ' + (page === tripDispatcherData.currentPage ? 'active' : '') + '"><button type="button" class="page-link" data-page="' + page + '" aria-current="' + (page === tripDispatcherData.currentPage ? 'page' : 'false') + '">' + page + '</button></li>');
        }

        items.push('<li class="page-item ' + (nextDisabled ? 'disabled' : '') + '"><button type="button" class="page-link" data-page="' + (tripDispatcherData.currentPage + 1) + '" ' + (nextDisabled ? 'tabindex="-1" aria-disabled="true"' : '') + '>Next</button></li>');

        paginationList.innerHTML = items.join('');
    }

    function updatePageCopy(filteredTrips) {
        var resultsCount = dom.root.querySelector('[data-trip-results-count]');
        var pageSummary = dom.root.querySelector('[data-trip-page-summary]');
        var pageInfo = dom.root.querySelector('[data-trip-page-info]');
        var totalFiltered = filteredTrips.length;
        var start = totalFiltered ? ((tripDispatcherData.currentPage - 1) * tripDispatcherData.pageSize) + 1 : 0;
        var end = Math.min(tripDispatcherData.currentPage * tripDispatcherData.pageSize, totalFiltered);

        if (resultsCount) {
            resultsCount.textContent = totalFiltered + ' trip' + (totalFiltered === 1 ? '' : 's') + ' found';
        }

        if (pageSummary) {
            pageSummary.textContent = totalFiltered ? 'Showing ' + start + '-' + end + ' of ' + totalFiltered + ' trip' + (totalFiltered === 1 ? '' : 's') + '.' : 'No trips available for the current filters.';
        }

        if (pageInfo) {
            pageInfo.textContent = totalFiltered ? 'Page ' + tripDispatcherData.currentPage + ' of ' + Math.max(1, Math.ceil(totalFiltered / tripDispatcherData.pageSize)) : 'No results';
        }
    }

    function setStatusBadge(badge, status) {
        var tone = getStatusTone(status);

        badge.className = 'app-badge app-badge-' + tone;
        badge.innerHTML = '<i class="bi bi-' + getStatusIcon(status) + '"></i><span>' + status + '</span>';
    }

    function renderActionButtons(row, trip) {
        var editButton = row.querySelector('[data-trip-action="edit"]');
        var dispatchButton = row.querySelector('[data-trip-action="dispatch"]');
        var startButton = row.querySelector('[data-trip-action="start"]');
        var completeButton = row.querySelector('[data-trip-action="complete"]');
        var cancelButton = row.querySelector('[data-trip-action="cancel"]');

        editButton.classList.toggle('d-none', trip.status !== 'Draft' && trip.status !== 'Dispatched');
        dispatchButton.classList.toggle('d-none', trip.status !== 'Draft');
        startButton.classList.toggle('d-none', trip.status !== 'Dispatched');
        completeButton.classList.toggle('d-none', trip.status !== 'On Trip');
        cancelButton.classList.toggle('d-none', trip.status !== 'Draft' && trip.status !== 'Dispatched');
    }

    function renderTripRows(filteredTrips) {
        var tbody = dom.root.querySelector('[data-trip-table-body]');
        var table = dom.root.querySelector('[data-trip-table]');
        var emptyState = dom.root.querySelector('[data-trip-empty]');
        var filterEmptyState = dom.root.querySelector('[data-trip-filter-empty]');
        var rowTemplate = document.getElementById('trip-row-template');
        var startIndex = (tripDispatcherData.currentPage - 1) * tripDispatcherData.pageSize;
        var pageItems = filteredTrips.slice(startIndex, startIndex + tripDispatcherData.pageSize);

        if (!tbody || !rowTemplate) {
            return;
        }

        tbody.innerHTML = '';

        if (!tripDispatcherData.trips.length) {
            table.classList.add('d-none');
            emptyState.classList.remove('d-none');
            filterEmptyState.classList.add('d-none');
            return;
        }

        if (!filteredTrips.length) {
            table.classList.add('d-none');
            emptyState.classList.add('d-none');
            filterEmptyState.classList.remove('d-none');
            return;
        }

        table.classList.remove('d-none');
        emptyState.classList.add('d-none');
        filterEmptyState.classList.add('d-none');

        pageItems.forEach(function (trip) {
            var row = rowTemplate.content.cloneNode(true);
            var tripIdCell = row.querySelector('[data-field="tripId"]');
            var vehicleCell = row.querySelector('[data-field="vehicle"]');
            var driverCell = row.querySelector('[data-field="driver"]');
            var sourceCell = row.querySelector('[data-field="source"]');
            var destinationCell = row.querySelector('[data-field="destination"]');
            var cargoCell = row.querySelector('[data-field="cargoWeight"]');
            var distanceCell = row.querySelector('[data-field="distance"]');
            var statusBadge = row.querySelector('[data-status-badge]');
            var vehicle = getVehicleById(trip.vehicleId);
            var driver = getDriverById(trip.driverId);

            tripIdCell.textContent = trip.tripId;
            vehicleCell.textContent = vehicle ? vehicle.name : '--';
            driverCell.textContent = driver ? driver.name : '--';
            sourceCell.textContent = trip.source;
            destinationCell.textContent = trip.destination;
            cargoCell.textContent = formatCargoWeight(trip);
            distanceCell.textContent = formatDistance(trip.distanceValue);
            setStatusBadge(statusBadge, trip.status);

            row.querySelectorAll('[data-trip-action]').forEach(function (button) {
                button.setAttribute('data-trip-id', trip.id);
            });

            renderActionButtons(row, trip);
            tbody.appendChild(row);
        });
    }

    function closeDropdownMenus() {
        dom.root.querySelectorAll('.dropdown-menu.show').forEach(function (menu) {
            var dropdown = menu.closest('.dropdown');
            var toggle = dropdown ? dropdown.querySelector('[data-bs-toggle="dropdown"]') : null;

            if (toggle && window.bootstrap && bootstrap.Dropdown) {
                bootstrap.Dropdown.getOrCreateInstance(toggle).hide();
            }
        });
    }

    function renderTable() {
        var filteredTrips = getFilteredTrips();

        updateSortIndicators();
        updateFilterButtonLabels();
        updatePagination(filteredTrips.length);
        updatePageCopy(filteredTrips);
        renderTripRows(filteredTrips);
        renderSummaryCards();
    }

    function renderLoadingState() {
        dom.root.querySelectorAll('[data-loading-row]').forEach(function (row) {
            row.classList.remove('d-none');
        });
    }

    function clearLoadingState() {
        dom.root.querySelectorAll('[data-loading-row]').forEach(function (row) {
            row.remove();
        });
    }

    function getAllowedStatusesForTrip(trip, mode) {
        if (mode === 'create') {
            return ['Draft', 'Dispatched'];
        }

        if (!trip) {
            return ['Draft'];
        }

        if (trip.status === 'Draft') {
            return ['Draft', 'Dispatched', 'Cancelled'];
        }

        if (trip.status === 'Dispatched') {
            return ['Dispatched', 'On Trip', 'Cancelled'];
        }

        if (trip.status === 'On Trip') {
            return ['On Trip', 'Completed'];
        }

        return [trip.status];
    }

    function renderStatusOptions(form, trip, mode) {
        var statusSelect = form.querySelector('#trip-status');
        var allowedStatuses = getAllowedStatusesForTrip(trip, mode);
        var currentStatus = trip ? trip.status : 'Draft';
        var items = allowedStatuses.map(function (status) {
            return '<option value="' + status + '" ' + (status === currentStatus ? 'selected' : '') + '>' + status + '</option>';
        });

        statusSelect.innerHTML = items.join('');

        if (!statusSelect.value) {
            statusSelect.value = allowedStatuses[0];
        }
    }

    function renderVehicleMenu(form, selectedVehicleId) {
        var menuHost = form.querySelector('[data-trip-vehicle-dropdown]');
        var menu = menuHost ? menuHost.querySelector('.dropdown-menu') : null;
        var selectedVehicle = selectedVehicleId ? getVehicleById(selectedVehicleId) : null;
        var availableVehicles = tripDispatcherData.vehicles.filter(isSelectableVehicle);

        if (!menu) {
            return;
        }

        if (!availableVehicles.length) {
            menu.innerHTML = '<li><span class="dropdown-item text-app-muted">No available vehicles</span></li>';
            return;
        }

        menu.innerHTML = availableVehicles.map(function (vehicle) {
            return '<li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-trip-vehicle-option data-vehicle-id="' + vehicle.id + '"><span>' + vehicle.name + ' <span class="text-app-muted small">• ' + vehicle.type + ' • ' + vehicle.region + ' • ' + formatNumber(vehicle.capacityValue) + ' ' + vehicle.capacityUnit.toLowerCase() + '</span></span><i class="bi bi-check2 opacity-0"></i></button></li>';
        }).join('');

        updateVehicleSelection(form, selectedVehicle || availableVehicles[0] || null, false);
    }

    function renderDriverMenu(form, selectedDriverId) {
        var menuHost = form.querySelector('[data-trip-driver-dropdown]');
        var menu = menuHost ? menuHost.querySelector('.dropdown-menu') : null;
        var selectedDriver = selectedDriverId ? getDriverById(selectedDriverId) : null;
        var availableDrivers = tripDispatcherData.drivers.filter(isSelectableDriver);

        if (!menu) {
            return;
        }

        if (!availableDrivers.length) {
            menu.innerHTML = '<li><span class="dropdown-item text-app-muted">No available drivers</span></li>';
            return;
        }

        menu.innerHTML = availableDrivers.map(function (driver) {
            return '<li><button type="button" class="dropdown-item d-flex align-items-center justify-content-between" data-trip-driver-option data-driver-id="' + driver.id + '"><span>' + driver.name + ' <span class="text-app-muted small">• ' + driver.licenseCategory + ' • License valid</span></span><i class="bi bi-check2 opacity-0"></i></button></li>';
        }).join('');

        updateDriverSelection(form, selectedDriver || availableDrivers[0] || null, false);
    }

    function updateVehicleSelection(form, vehicle, clearErrors) {
        var hiddenInput = form.querySelector('#trip-vehicle-id');
        var labelNode = form.querySelector('[data-trip-vehicle-label]');
        var hintNode = form.querySelector('[data-trip-capacity-hint]');
        var trigger = form.querySelector('[data-dropdown-trigger="vehicle_id"]');
        var menuButtons = form.querySelectorAll('[data-trip-vehicle-option]');

        hiddenInput.value = vehicle ? vehicle.id : '';
        labelNode.textContent = vehicle ? vehicle.name : 'Select vehicle';
        hintNode.textContent = vehicle ? 'Maximum load capacity: ' + formatNumber(vehicle.capacityValue) + ' ' + vehicle.capacityUnit.toLowerCase() + '.' : 'Select an available vehicle to view capacity details.';

        menuButtons.forEach(function (button) {
            var isSelected = vehicle && button.getAttribute('data-vehicle-id') === vehicle.id;
            var icon = button.querySelector('.bi-check2');

            button.classList.toggle('active', isSelected);

            if (icon) {
                icon.classList.toggle('opacity-0', !isSelected);
            }
        });

        if (trigger) {
            trigger.classList.remove('is-invalid');
        }

        if (clearErrors) {
            form.querySelector('[data-field-error="vehicle_id"]').textContent = '';
        }
    }

    function updateDriverSelection(form, driver, clearErrors) {
        var hiddenInput = form.querySelector('#trip-driver-id');
        var labelNode = form.querySelector('[data-trip-driver-label]');
        var hintNode = form.querySelector('[data-trip-driver-hint]');
        var trigger = form.querySelector('[data-dropdown-trigger="driver_id"]');
        var menuButtons = form.querySelectorAll('[data-trip-driver-option]');

        hiddenInput.value = driver ? driver.id : '';
        labelNode.textContent = driver ? driver.name : 'Select driver';
        hintNode.textContent = driver ? 'Selected driver: ' + driver.licenseCategory + ' license.' : 'Select an available driver with a valid license.';

        menuButtons.forEach(function (button) {
            var isSelected = driver && button.getAttribute('data-driver-id') === driver.id;
            var icon = button.querySelector('.bi-check2');

            button.classList.toggle('active', isSelected);

            if (icon) {
                icon.classList.toggle('opacity-0', !isSelected);
            }
        });

        if (trigger) {
            trigger.classList.remove('is-invalid');
        }

        if (clearErrors) {
            form.querySelector('[data-field-error="driver_id"]').textContent = '';
        }
    }

    function updateFormPrimaryAction(form, trip, mode) {
        var saveButton = document.querySelector('[data-trip-save-button]');
        var status = form.querySelector('#trip-status').value;
        var label = 'Save Trip';

        if (mode === 'create') {
            label = status === 'Dispatched' ? 'Dispatch Trip' : 'Create Trip';
        } else if (status === 'Dispatched') {
            label = 'Dispatch Trip';
        } else if (status === 'On Trip') {
            label = 'Start Trip';
        } else if (status === 'Completed') {
            label = 'Complete Trip';
        } else if (status === 'Cancelled') {
            label = 'Cancel Trip';
        }

        if (saveButton) {
            saveButton.textContent = label;
        }
    }

    function clearFormValidation(form) {
        form.querySelectorAll('.is-invalid').forEach(function (field) {
            field.classList.remove('is-invalid');
        });

        form.querySelectorAll('[data-field-error]').forEach(function (message) {
            message.textContent = '';
        });

        var vehicleTrigger = form.querySelector('[data-dropdown-trigger="vehicle_id"]');
        var driverTrigger = form.querySelector('[data-dropdown-trigger="driver_id"]');

        if (vehicleTrigger) {
            vehicleTrigger.classList.remove('is-invalid');
        }

        if (driverTrigger) {
            driverTrigger.classList.remove('is-invalid');
        }
    }

    function showValidationErrors(form, errors) {
        clearFormValidation(form);

        Object.keys(errors).forEach(function (fieldName) {
            var field = form.querySelector('[name="' + fieldName + '"]');
            var message = form.querySelector('[data-field-error="' + fieldName + '"]');

            if (field && field.type !== 'hidden') {
                field.classList.add('is-invalid');
            }

            if (field && field.type === 'hidden') {
                var trigger = form.querySelector('[data-dropdown-trigger="' + fieldName + '"]');

                if (trigger) {
                    trigger.classList.add('is-invalid');
                }
            }

            if (message) {
                message.textContent = errors[fieldName];
            }
        });
    }

    function getNextTripId() {
        var highestNumber = tripDispatcherData.trips.reduce(function (max, trip) {
            var number = Number(String(trip.tripId).replace(/\D/g, ''));

            return number > max ? number : max;
        }, 1000);

        return 'TRP-' + String(highestNumber + 1);
    }

    function getVehicleCapacityLimit(vehicle) {
        if (!vehicle) {
            return 0;
        }

        return Number(vehicle.capacityValue || 0);
    }

    function getAllowedTransitions(currentStatus) {
        var transitions = {
            null: ['Draft', 'Dispatched'],
            Draft: ['Draft', 'Dispatched', 'Cancelled'],
            Dispatched: ['Dispatched', 'On Trip', 'Cancelled'],
            'On Trip': ['On Trip', 'Completed'],
            Completed: ['Completed'],
            Cancelled: ['Cancelled']
        };

        return transitions[currentStatus] || ['Draft', 'Dispatched'];
    }

    function validateTripForm(form) {
        var errors = {};
        var tripId = form.querySelector('#trip-id').value || null;
        var source = form.querySelector('#trip-source');
        var destination = form.querySelector('#trip-destination');
        var vehicleId = form.querySelector('#trip-vehicle-id');
        var driverId = form.querySelector('#trip-driver-id');
        var cargoWeight = form.querySelector('#trip-cargo-weight');
        var plannedDistance = form.querySelector('#trip-distance');
        var status = form.querySelector('#trip-status');
        var existingTrip = tripId ? getTripById(tripId) : null;
        var currentStatus = existingTrip ? existingTrip.status : null;
        var selectedVehicle = getVehicleById(vehicleId.value);
        var selectedDriver = getDriverById(driverId.value);
        var cargoValue = Number(cargoWeight.value);
        var distanceValue = Number(plannedDistance.value);
        var allowedStatuses = getAllowedTransitions(currentStatus);

        if (!source.value.trim()) {
            errors.source = 'Source is required.';
        }

        if (!destination.value.trim()) {
            errors.destination = 'Destination is required.';
        }

        if (source.value.trim() && destination.value.trim() && source.value.trim().toLowerCase() === destination.value.trim().toLowerCase()) {
            errors.destination = 'Destination must be different from source.';
        }

        if (!vehicleId.value) {
            errors.vehicle_id = 'Vehicle is required.';
        } else if (!selectedVehicle || !isSelectableVehicle(selectedVehicle)) {
            errors.vehicle_id = 'Selected vehicle is not available.';
        }

        if (!driverId.value) {
            errors.driver_id = 'Driver is required.';
        } else if (!selectedDriver) {
            errors.driver_id = 'Selected driver is not available.';
        } else if (selectedDriver.status === 'Suspended') {
            errors.driver_id = 'Suspended drivers cannot be selected.';
        } else if (selectedDriver.status === 'On Trip') {
            errors.driver_id = 'Drivers already on trip cannot be selected.';
        } else if (isExpired(selectedDriver)) {
            errors.driver_id = 'Expired drivers cannot be selected.';
        }

        if (!cargoWeight.value || Number.isNaN(cargoValue) || cargoValue <= 0) {
            errors.cargo_weight = 'Cargo weight must be a positive number.';
        } else if (selectedVehicle && cargoValue > getVehicleCapacityLimit(selectedVehicle)) {
            errors.cargo_weight = 'Cargo weight cannot exceed maximum load capacity.';
        }

        if (!plannedDistance.value || Number.isNaN(distanceValue) || distanceValue <= 0) {
            errors.planned_distance = 'Planned distance must be a positive number.';
        }

        if (!status.value) {
            errors.status = 'Trip status is required.';
        } else if (allowedStatuses.indexOf(status.value) === -1) {
            errors.status = 'This trip status transition is not allowed.';
        }

        return errors;
    }

    function saveTrip(form) {
        var errors = validateTripForm(form);

        if (Object.keys(errors).length) {
            showValidationErrors(form, errors);
            return false;
        }

        var tripId = form.querySelector('#trip-id').value;
        var selectedVehicle = getVehicleById(form.querySelector('#trip-vehicle-id').value);
        var selectedDriver = getDriverById(form.querySelector('#trip-driver-id').value);
        var currentTrip = tripId ? getTripById(tripId) : null;
        var nextStatus = form.querySelector('#trip-status').value;
        var tripPayload = {
            id: tripId || ('trip-' + Math.random().toString(36).slice(2, 9)),
            tripId: tripId ? currentTrip.tripId : getNextTripId(),
            source: form.querySelector('#trip-source').value.trim(),
            destination: form.querySelector('#trip-destination').value.trim(),
            vehicleId: selectedVehicle.id,
            driverId: selectedDriver.id,
            cargoWeightValue: Number(form.querySelector('#trip-cargo-weight').value),
            cargoWeightUnit: selectedVehicle.capacityUnit,
            distanceValue: Number(form.querySelector('#trip-distance').value),
            status: nextStatus,
            region: selectedVehicle.region,
            tripDate: currentTrip ? currentTrip.tripDate : getTodayKey()
        };

        if (tripId) {
            tripDispatcherData.trips = tripDispatcherData.trips.map(function (trip) {
                if (trip.id !== tripId) {
                    return trip;
                }

                return Object.assign({}, trip, tripPayload);
            });
        } else {
            tripDispatcherData.trips.unshift(tripPayload);
        }

        syncResourceStatusesForTrip(tripPayload, currentTrip ? currentTrip.status : null, currentTrip ? currentTrip.vehicleId : null, currentTrip ? currentTrip.driverId : null);
        tripDispatcherData.currentPage = 1;
        renderTable();
        bootstrap.Modal.getInstance(document.getElementById('tripFormModal')).hide();

        return true;
    }

    function syncResourceStatusesForTrip(nextTrip, previousStatus, previousVehicleId, previousDriverId) {
        if (previousStatus === 'On Trip' && nextTrip.status !== 'On Trip') {
            var previousVehicle = getVehicleById(previousVehicleId);
            var previousDriver = getDriverById(previousDriverId);

            if (previousVehicle) {
                previousVehicle.status = 'Available';
            }

            if (previousDriver && previousDriver.status !== 'Suspended' && !isExpired(previousDriver)) {
                previousDriver.status = 'Available';
            }
        }

        if (nextTrip.status === 'On Trip') {
            var nextVehicle = getVehicleById(nextTrip.vehicleId);
            var nextDriver = getDriverById(nextTrip.driverId);

            if (nextVehicle) {
                nextVehicle.status = 'On Trip';
            }

            if (nextDriver) {
                nextDriver.status = 'On Trip';
            }
        }

        if (nextTrip.status === 'Completed' || nextTrip.status === 'Cancelled') {
            var completedVehicle = getVehicleById(nextTrip.vehicleId);
            var completedDriver = getDriverById(nextTrip.driverId);

            if (completedVehicle) {
                completedVehicle.status = 'Available';
            }

            if (completedDriver && !isExpired(completedDriver) && completedDriver.status !== 'Suspended') {
                completedDriver.status = 'Available';
            }
        }
    }

    function updateTripStatus(trip, nextStatus) {
        var previousStatus = trip.status;
        var previousVehicleId = trip.vehicleId;
        var previousDriverId = trip.driverId;
        var allowedStatuses = getAllowedTransitions(previousStatus);

        if (allowedStatuses.indexOf(nextStatus) === -1) {
            return false;
        }

        if (previousStatus === nextStatus) {
            return true;
        }

        trip.status = nextStatus;
        syncResourceStatusesForTrip(trip, previousStatus, previousVehicleId, previousDriverId);
        renderTable();

        if (state.viewId === trip.id) {
            renderViewModal(trip);
        }

        return true;
    }

    function openDeleteModal(tripId) {
        state.pendingDeleteId = tripId;
        bootstrap.Modal.getOrCreateInstance(document.getElementById('tripDeleteModal')).show();
    }

    function confirmDelete() {
        if (!state.pendingDeleteId) {
            return;
        }

        tripDispatcherData.trips = tripDispatcherData.trips.filter(function (trip) {
            return trip.id !== state.pendingDeleteId;
        });
        state.pendingDeleteId = null;
        tripDispatcherData.currentPage = 1;
        renderTable();
        bootstrap.Modal.getInstance(document.getElementById('tripDeleteModal')).hide();
    }

    function resetDraftFilters() {
        tripDispatcherData.draftFilters = {
            status: 'all',
            vehicleType: 'all',
            region: 'all',
            dateRange: 'all'
        };
        updateFilterButtonLabels();
    }

    function applyFilters() {
        tripDispatcherData.filters = Object.assign({}, tripDispatcherData.draftFilters);
        tripDispatcherData.currentPage = 1;
        renderTable();
    }

    function openTripForm(mode, tripId) {
        var modalElement = document.getElementById('tripFormModal');
        var modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        var form = document.getElementById('trip-form');
        var trip = tripId ? getTripById(tripId) : null;
        var titleNode = modalElement.querySelector('.modal-title');
        var subtitleNode = modalElement.querySelector('[data-trip-modal-subtitle]');
        var saveButton = modalElement.querySelector('[data-trip-save-button]');
        var editableTrip = trip && (trip.status === 'Draft' || trip.status === 'Dispatched');

        if (mode === 'edit' && trip && !editableTrip) {
            openTripView(tripId);
            return;
        }

        state.editingId = mode === 'edit' ? tripId : null;
        form.setAttribute('data-mode', mode);

        form.reset();
        clearFormValidation(form);
        form.querySelector('#trip-id').value = trip ? trip.id : '';

        if (titleNode) {
            titleNode.textContent = mode === 'edit' ? 'Edit Trip' : 'Create Trip';
        }

        if (subtitleNode) {
            subtitleNode.textContent = mode === 'edit' ? 'Update the trip details and dispatch status.' : 'Plan a new trip and dispatch it into the queue.';
        }

        form.querySelector('#trip-source').value = trip ? trip.source : '';
        form.querySelector('#trip-destination').value = trip ? trip.destination : '';
        form.querySelector('#trip-cargo-weight').value = trip ? trip.cargoWeightValue : '';
        form.querySelector('#trip-distance').value = trip ? trip.distanceValue : '';

        renderStatusOptions(form, trip, mode);
        renderVehicleMenu(form, trip ? trip.vehicleId : null);
        renderDriverMenu(form, trip ? trip.driverId : null);
        updateVehicleSelection(form, trip ? getVehicleById(trip.vehicleId) : null, false);
        updateDriverSelection(form, trip ? getDriverById(trip.driverId) : null, false);
        updateFormPrimaryAction(form, trip, mode);

        modal.show();

        window.setTimeout(function () {
            var focusTarget = form.querySelector('#trip-source');

            if (focusTarget) {
                focusTarget.focus();
            }
        }, 150);
    }

    function renderTimeline(trip) {
        var timelineHost = document.querySelector('[data-trip-timeline]');
        var statusBadge = document.querySelector('[data-trip-view-status-badge]');
        var statusNode = document.querySelector('[data-trip-view-status]');
        var noteNode = document.querySelector('[data-trip-view-note]');
        var timelineNote = document.querySelector('[data-trip-view-timeline-note]');
        var stages = [
            'Draft',
            'Dispatched',
            'On Trip',
            'Completed'
        ];
        var currentStatus = trip.status;

        if (currentStatus === 'Cancelled') {
            stages.push('Cancelled');
        }

        if (statusNode) {
            statusNode.textContent = currentStatus;
        }

        if (statusBadge) {
            setStatusBadge(statusBadge, currentStatus);
        }

        if (noteNode) {
            noteNode.textContent = currentStatus === 'Cancelled' ? 'This trip was cancelled before completion.' : 'Current operational stage highlighted below.';
        }

        if (timelineNote) {
            timelineNote.textContent = currentStatus === 'Cancelled' ? 'Cancellation recorded' : 'Live status';
        }

        if (!timelineHost) {
            return;
        }

        timelineHost.innerHTML = stages.map(function (stage) {
            var isCurrent = stage === currentStatus || (currentStatus === 'Cancelled' && stage === 'Cancelled');
            var stateClass = isCurrent ? 'bg-success-subtle text-success-emphasis border border-success-subtle' : 'bg-body-tertiary text-app border border-app';
            var iconClass = isCurrent ? 'bi-check-circle' : 'bi-circle';

            if (stage === 'Cancelled') {
                stateClass = isCurrent ? 'bg-danger-subtle text-danger-emphasis border border-danger-subtle' : 'bg-body-tertiary text-app border border-app';
                iconClass = isCurrent ? 'bi-x-circle' : 'bi-circle';
            }

            return '<div class="d-flex align-items-center justify-content-between gap-3 rounded-4 px-3 py-2 ' + stateClass + '">' +
                '<div class="d-flex align-items-center gap-2 fw-semibold"><i class="bi ' + iconClass + '"></i><span>' + stage + '</span></div>' +
                '<span class="small ' + (isCurrent ? 'fw-semibold' : 'text-app-muted') + '">' + (isCurrent ? 'Current stage' : 'Pending') + '</span>' +
                '</div>';
        }).join('');
    }

    function renderViewModal(trip) {
        var modalElement = document.getElementById('tripViewModal');
        var modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        var titleNode = modalElement.querySelector('.modal-title');
        var subtitleNode = modalElement.querySelector('[data-trip-view-subtitle]');
        var idNode = modalElement.querySelector('[data-trip-view-id]');
        var vehicleNode = modalElement.querySelector('[data-trip-view-vehicle]');
        var driverNode = modalElement.querySelector('[data-trip-view-driver]');
        var routeNode = modalElement.querySelector('[data-trip-view-route]');
        var cargoNode = modalElement.querySelector('[data-trip-view-cargo]');
        var distanceNode = modalElement.querySelector('[data-trip-view-distance]');
        var regionNode = modalElement.querySelector('[data-trip-view-region]');
        var dateNode = modalElement.querySelector('[data-trip-view-date]');
        var currentStageNode = modalElement.querySelector('[data-trip-view-current-stage]');
        var formButtons = modalElement.querySelectorAll('[data-trip-action]');
        var editable = trip.status === 'Draft' || trip.status === 'Dispatched';

        state.viewId = trip.id;

        if (titleNode) {
            titleNode.textContent = 'Trip Details';
        }

        if (subtitleNode) {
            subtitleNode.textContent = 'Review the current trip milestone and operational details.';
        }

        if (idNode) {
            idNode.textContent = trip.tripId;
        }

        if (vehicleNode) {
            vehicleNode.textContent = getVehicleName(trip.vehicleId);
        }

        if (driverNode) {
            driverNode.textContent = getDriverName(trip.driverId);
        }

        if (routeNode) {
            routeNode.textContent = trip.source + ' → ' + trip.destination;
        }

        if (cargoNode) {
            cargoNode.textContent = formatCargoWeight(trip);
        }

        if (distanceNode) {
            distanceNode.textContent = formatDistance(trip.distanceValue);
        }

        if (regionNode) {
            regionNode.textContent = trip.region;
        }

        if (dateNode) {
            dateNode.textContent = formatDate(trip.tripDate);
        }

        if (currentStageNode) {
            currentStageNode.textContent = trip.status;
        }

        renderTimeline(trip);

        formButtons.forEach(function (button) {
            var action = button.getAttribute('data-trip-action');
            var visible = false;

            if (action === 'edit') {
                visible = editable;
            }

            if (action === 'dispatch') {
                visible = trip.status === 'Draft';
            }

            if (action === 'start') {
                visible = trip.status === 'Dispatched';
            }

            if (action === 'complete') {
                visible = trip.status === 'On Trip';
            }

            if (action === 'cancel') {
                visible = trip.status === 'Draft' || trip.status === 'Dispatched';
            }

            button.classList.toggle('d-none', !visible);
            button.setAttribute('data-trip-id', trip.id);
        });

        modal.show();

        window.setTimeout(function () {
            var closeButton = modalElement.querySelector('[data-bs-dismiss="modal"]');

            if (closeButton) {
                closeButton.focus();
            }
        }, 150);
    }

    function openTripView(tripId) {
        var trip = getTripById(tripId);

        if (!trip) {
            return;
        }

        renderViewModal(trip);
    }

    function handleSortClick(event) {
        var button = event.target.closest('[data-sort-key]');

        if (!button) {
            return;
        }

        var key = button.getAttribute('data-sort-key');

        if (tripDispatcherData.sort.field === key) {
            tripDispatcherData.sort.direction = tripDispatcherData.sort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            tripDispatcherData.sort.field = key;
            tripDispatcherData.sort.direction = 'asc';
        }

        renderTable();
    }

    function handleActionClick(event) {
        var actionButton = event.target.closest('[data-trip-action]');
        var tripId;
        var trip;
        var action;
        var transitionMap = {
            dispatch: 'Dispatched',
            start: 'On Trip',
            complete: 'Completed',
            cancel: 'Cancelled'
        };

        if (actionButton) {
            tripId = actionButton.getAttribute('data-trip-id');
            action = actionButton.getAttribute('data-trip-action');
            trip = tripId ? getTripById(tripId) : null;

            if (action === 'view' && trip) {
                openTripView(tripId);
            }

            if (action === 'edit' && trip) {
                openTripForm('edit', tripId);
            }

            if (action === 'delete' && trip) {
                openDeleteModal(tripId);
            }

            if (transitionMap[action] && trip) {
                updateTripStatus(trip, transitionMap[action]);
            }
        }

        if (event.target.closest('[data-trip-create-button], [data-trip-empty-action]')) {
            openTripForm('create');
        }

        if (event.target.closest('[data-trip-filter-reset], [data-trip-reset-filters]')) {
            resetDraftFilters();
            applyFilters();
        }

        if (event.target.closest('[data-trip-apply-filters]')) {
            applyFilters();
        }

        var filterOption = event.target.closest('[data-filter-option]');

        if (filterOption) {
            var group = filterOption.getAttribute('data-filter-group');
            var value = filterOption.getAttribute('data-filter-value');

            tripDispatcherData.draftFilters[group] = value;
            updateFilterButtonLabels();
            closeDropdownMenus();
        }

        var pageButton = event.target.closest('[data-page]');

        if (pageButton && !pageButton.closest('.disabled')) {
            tripDispatcherData.currentPage = Number(pageButton.getAttribute('data-page'));
            renderTable();
        }

        var vehicleOption = event.target.closest('[data-trip-vehicle-option]');

        if (vehicleOption) {
            var tripForm = document.getElementById('trip-form');
            var selectedVehicle = getVehicleById(vehicleOption.getAttribute('data-vehicle-id'));

            if (tripForm && selectedVehicle) {
                updateVehicleSelection(tripForm, selectedVehicle, true);
                updateFormPrimaryAction(tripForm, null, tripForm.getAttribute('data-mode') || 'create');
            }
        }

        var driverOption = event.target.closest('[data-trip-driver-option]');

        if (driverOption) {
            var driverForm = document.getElementById('trip-form');
            var selectedDriver = getDriverById(driverOption.getAttribute('data-driver-id'));

            if (driverForm && selectedDriver) {
                updateDriverSelection(driverForm, selectedDriver, true);
                updateFormPrimaryAction(driverForm, null, driverForm.getAttribute('data-mode') || 'create');
            }
        }
    }

    function updateViewModalActionButtons() {
        if (!state.viewId) {
            return;
        }

        var trip = getTripById(state.viewId);

        if (trip) {
            renderViewModal(trip);
        }
    }

    function bindEvents() {
        dom.searchInput.addEventListener('input', function (event) {
            tripDispatcherData.searchTerm = event.target.value || '';
            tripDispatcherData.currentPage = 1;
            renderTable();
        });

        dom.root.addEventListener('click', handleActionClick);

        dom.tripForm.addEventListener('submit', function (event) {
            event.preventDefault();
            saveTrip(event.currentTarget);
        });

        dom.tripForm.querySelector('#trip-status').addEventListener('change', function () {
            updateFormPrimaryAction(dom.tripForm, null, dom.tripForm.getAttribute('data-mode') || 'create');
        });

        dom.tripForm.querySelector('#trip-source').addEventListener('input', function () {
            dom.tripForm.querySelector('#trip-source').classList.remove('is-invalid');
        });

        dom.tripForm.querySelector('#trip-destination').addEventListener('input', function () {
            dom.tripForm.querySelector('#trip-destination').classList.remove('is-invalid');
        });

        dom.tripForm.querySelector('#trip-cargo-weight').addEventListener('input', function () {
            dom.tripForm.querySelector('#trip-cargo-weight').classList.remove('is-invalid');
        });

        dom.tripForm.querySelector('#trip-distance').addEventListener('input', function () {
            dom.tripForm.querySelector('#trip-distance').classList.remove('is-invalid');
        });

        document.getElementById('tripFormModal').addEventListener('hidden.bs.modal', function () {
            state.editingId = null;

            dom.tripForm.reset();
            clearFormValidation(dom.tripForm);
            dom.tripForm.removeAttribute('data-mode');

            var saveButton = document.querySelector('[data-trip-save-button]');

            if (saveButton) {
                saveButton.textContent = 'Create Trip';
            }
        });

        document.getElementById('tripViewModal').addEventListener('hidden.bs.modal', function () {
            state.viewId = null;
        });

        document.getElementById('tripDeleteModal').querySelector('.modal-footer .btn-danger').addEventListener('click', confirmDelete);

        dom.root.querySelectorAll('[data-sort-key]').forEach(function (button) {
            button.addEventListener('click', handleSortClick);
        });
    }

    function init() {
        dom.root = document.querySelector('[data-trip-dispatcher-root]');
        dom.searchInput = document.querySelector('[name="trip_dispatcher_search"]');
        dom.tripForm = document.getElementById('trip-form');

        if (!dom.root || !dom.searchInput || !dom.tripForm) {
            return;
        }

        renderSummaryCards();
        updateFilterButtonLabels();
        updateSortIndicators();
        bindEvents();
        renderLoadingState();

        window.setTimeout(function () {
            tripDispatcherData.loading = false;
            clearLoadingState();
            renderTable();
        }, 450);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}());