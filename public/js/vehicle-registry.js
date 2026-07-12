(function () {
    var vehicleRegistryData = {
        loading: true,
        pageSize: 4,
        currentPage: 1,
        searchTerm: '',
        sort: {
            field: 'registrationNumber',
            direction: 'asc'
        },
        filters: {
            type: 'all',
            status: 'all',
            region: 'all'
        },
        draftFilters: {
            type: 'all',
            status: 'all',
            region: 'all'
        },
        summary: {
            total: 53,
            available: 42,
            onTrip: 8,
            maintenance: 3
        },
        options: {
            typeLabels: {
                all: 'All vehicle types',
                'Mini Van': 'Mini Van',
                Truck: 'Truck',
                Bus: 'Bus',
                Pickup: 'Pickup',
                Sedan: 'Sedan'
            },
            statusLabels: {
                all: 'All statuses',
                Available: 'Available',
                'On Trip': 'On Trip',
                Maintenance: 'Maintenance',
                Retired: 'Retired'
            },
            regionLabels: {
                all: 'All regions',
                North: 'North',
                South: 'South',
                East: 'East',
                West: 'West'
            }
        },
        vehicles: [
            {
                id: 'veh-001',
                registrationNumber: 'GJ01AB4589',
                name: 'Van-05',
                type: 'Mini Van',
                capacityValue: 500,
                capacityUnit: 'kg',
                odometer: 42150,
                acquisitionCost: 1850000,
                status: 'Available',
                region: 'North'
            },
            {
                id: 'veh-002',
                registrationNumber: 'GJ03CD1201',
                name: 'Truck-12',
                type: 'Truck',
                capacityValue: 2500,
                capacityUnit: 'kg',
                odometer: 125340,
                acquisitionCost: 3565000,
                status: 'On Trip',
                region: 'West'
            },
            {
                id: 'veh-003',
                registrationNumber: 'GJ18XY9011',
                name: 'Bus-03',
                type: 'Bus',
                capacityValue: 40,
                capacityUnit: 'Seats',
                odometer: 208900,
                acquisitionCost: 7420000,
                status: 'Maintenance',
                region: 'South'
            },
            {
                id: 'veh-004',
                registrationNumber: 'GJ05MN2208',
                name: 'Pickup-09',
                type: 'Pickup',
                capacityValue: 900,
                capacityUnit: 'kg',
                odometer: 89210,
                acquisitionCost: 2190000,
                status: 'Available',
                region: 'East'
            },
            {
                id: 'veh-005',
                registrationNumber: 'GJ12PQ3344',
                name: 'Van-11',
                type: 'Mini Van',
                capacityValue: 650,
                capacityUnit: 'kg',
                odometer: 67880,
                acquisitionCost: 1995000,
                status: 'Available',
                region: 'North'
            },
            {
                id: 'veh-006',
                registrationNumber: 'GJ04JK7718',
                name: 'Truck-18',
                type: 'Truck',
                capacityValue: 3200,
                capacityUnit: 'kg',
                odometer: 141020,
                acquisitionCost: 4120000,
                status: 'Retired',
                region: 'West'
            },
            {
                id: 'veh-007',
                registrationNumber: 'GJ07LM5521',
                name: 'Bus-07',
                type: 'Bus',
                capacityValue: 36,
                capacityUnit: 'Seats',
                odometer: 164500,
                acquisitionCost: 6890000,
                status: 'On Trip',
                region: 'South'
            },
            {
                id: 'veh-008',
                registrationNumber: 'GJ09RS8842',
                name: 'Pickup-14',
                type: 'Pickup',
                capacityValue: 800,
                capacityUnit: 'kg',
                odometer: 95440,
                acquisitionCost: 2080000,
                status: 'Available',
                region: 'East'
            }
        ]
    };

    window.vehicleRegistryData = vehicleRegistryData;

    var state = {
        editingId: null,
        viewOnly: false,
        pendingDeleteId: null
    };

    var dom = {};

    function getVehicleById(id) {
        return vehicleRegistryData.vehicles.find(function (vehicle) {
            return vehicle.id === id;
        }) || null;
    }

    function formatNumber(value) {
        return new Intl.NumberFormat('en-IN').format(value || 0);
    }

    function formatCapacity(vehicle) {
        if (!vehicle) {
            return '--';
        }

        return vehicle.capacityUnit === 'Seats' ? formatNumber(vehicle.capacityValue) + ' Seats' : formatNumber(vehicle.capacityValue) + ' kg';
    }

    function getBadgeTone(status) {
        var tones = {
            Available: 'success',
            'On Trip': 'info',
            Maintenance: 'warning',
            Retired: 'secondary'
        };

        return tones[status] || 'info';
    }

    function getBadgeIcon(status) {
        var icons = {
            Available: 'check-circle',
            'On Trip': 'signpost-2',
            Maintenance: 'tools',
            Retired: 'dash-circle'
        };

        return icons[status] || 'circle-fill';
    }

    function getStatusSortRank(status) {
        var ranks = {
            Available: 1,
            'On Trip': 2,
            Maintenance: 3,
            Retired: 4
        };

        return ranks[status] || 99;
    }

    function getFilterLabel(filterGroup, value) {
        return vehicleRegistryData.options[filterGroup + 'Labels'][value] || value || '';
    }

    function matchesSearch(vehicle, term) {
        if (!term) {
            return true;
        }

        var haystack = [vehicle.registrationNumber, vehicle.name, vehicle.type, vehicle.region, vehicle.status].join(' ').toLowerCase();

        return haystack.indexOf(term) !== -1;
    }

    function getFilteredVehicles() {
        var term = vehicleRegistryData.searchTerm.trim().toLowerCase();

        return vehicleRegistryData.vehicles.filter(function (vehicle) {
            var matchesType = vehicleRegistryData.filters.type === 'all' || vehicle.type === vehicleRegistryData.filters.type;
            var matchesStatus = vehicleRegistryData.filters.status === 'all' || vehicle.status === vehicleRegistryData.filters.status;
            var matchesRegion = vehicleRegistryData.filters.region === 'all' || vehicle.region === vehicleRegistryData.filters.region;

            return matchesType && matchesStatus && matchesRegion && matchesSearch(vehicle, term);
        }).sort(function (left, right) {
            var field = vehicleRegistryData.sort.field;
            var direction = vehicleRegistryData.sort.direction === 'asc' ? 1 : -1;
            var leftValue = left[field];
            var rightValue = right[field];

            if (field === 'status') {
                leftValue = getStatusSortRank(leftValue);
                rightValue = getStatusSortRank(rightValue);
            }

            if (field === 'capacityValue' || field === 'odometer' || field === 'acquisitionCost') {
                leftValue = Number(leftValue || 0);
                rightValue = Number(rightValue || 0);
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
        setMetricValue('total', vehicleRegistryData.summary.total);
        setMetricValue('available', vehicleRegistryData.summary.available);
        setMetricValue('onTrip', vehicleRegistryData.summary.onTrip);
        setMetricValue('maintenance', vehicleRegistryData.summary.maintenance);
    }

    function updateFilterButtonLabels() {
        Object.keys(vehicleRegistryData.draftFilters).forEach(function (filterKey) {
            var labelNode = dom.root.querySelector('[data-filter-label="' + filterKey + '"]');

            if (labelNode) {
                labelNode.textContent = getFilterLabel(filterKey, vehicleRegistryData.draftFilters[filterKey]);
            }
        });

        dom.root.querySelectorAll('[data-filter-option]').forEach(function (button) {
            var group = button.getAttribute('data-filter-group');
            var value = button.getAttribute('data-filter-value');
            var isSelected = vehicleRegistryData.draftFilters[group] === value;
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

            icon.className = 'bi ' + (vehicleRegistryData.sort.field === field ? (vehicleRegistryData.sort.direction === 'asc' ? 'bi-sort-down' : 'bi-sort-up') : 'bi-arrow-down-up');
        });
    }

    function updatePagination(totalItems) {
        var paginationHost = dom.root.querySelector('[data-vehicle-pagination]');
        var paginationList = paginationHost ? paginationHost.querySelector('.pagination') : null;
        var totalPages = totalItems ? Math.ceil(totalItems / vehicleRegistryData.pageSize) : 0;

        if (!paginationList) {
            return;
        }

        if (totalPages <= 1) {
            paginationHost.classList.add('d-none');
            paginationList.innerHTML = '';
            return;
        }

        paginationHost.classList.remove('d-none');

        if (vehicleRegistryData.currentPage > totalPages) {
            vehicleRegistryData.currentPage = totalPages;
        }

        var items = [];
        var previousDisabled = vehicleRegistryData.currentPage === 1;
        var nextDisabled = vehicleRegistryData.currentPage === totalPages;

        items.push('<li class="page-item ' + (previousDisabled ? 'disabled' : '') + '"><button type="button" class="page-link" data-page="' + (vehicleRegistryData.currentPage - 1) + '" ' + (previousDisabled ? 'tabindex="-1" aria-disabled="true"' : '') + '>Prev</button></li>');

        for (var page = 1; page <= totalPages; page += 1) {
            items.push('<li class="page-item ' + (page === vehicleRegistryData.currentPage ? 'active' : '') + '"><button type="button" class="page-link" data-page="' + page + '" aria-current="' + (page === vehicleRegistryData.currentPage ? 'page' : 'false') + '">' + page + '</button></li>');
        }

        items.push('<li class="page-item ' + (nextDisabled ? 'disabled' : '') + '"><button type="button" class="page-link" data-page="' + (vehicleRegistryData.currentPage + 1) + '" ' + (nextDisabled ? 'tabindex="-1" aria-disabled="true"' : '') + '>Next</button></li>');

        paginationList.innerHTML = items.join('');
    }

    function updatePageCopy(filteredVehicles) {
        var resultsCount = dom.root.querySelector('[data-vehicle-results-count]');
        var pageSummary = dom.root.querySelector('[data-vehicle-page-summary]');
        var pageInfo = dom.root.querySelector('[data-vehicle-page-info]');
        var totalFiltered = filteredVehicles.length;
        var start = totalFiltered ? ((vehicleRegistryData.currentPage - 1) * vehicleRegistryData.pageSize) + 1 : 0;
        var end = Math.min(vehicleRegistryData.currentPage * vehicleRegistryData.pageSize, totalFiltered);

        if (resultsCount) {
            resultsCount.textContent = totalFiltered + ' vehicle' + (totalFiltered === 1 ? '' : 's') + ' found';
        }

        if (pageSummary) {
            pageSummary.textContent = totalFiltered ? 'Showing ' + start + '-' + end + ' of ' + totalFiltered + ' vehicle' + (totalFiltered === 1 ? '' : 's') + '.' : 'No vehicles available for the current filters.';
        }

        if (pageInfo) {
            pageInfo.textContent = totalFiltered ? 'Page ' + vehicleRegistryData.currentPage + ' of ' + Math.max(1, Math.ceil(totalFiltered / vehicleRegistryData.pageSize)) : 'No results';
        }
    }

    function setBadgeTone(badge, status) {
        var tone = getBadgeTone(status);

        badge.className = 'app-badge app-badge-' + tone + (status === 'Retired' ? ' bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle' : '');
        badge.innerHTML = '<i class="bi bi-' + getBadgeIcon(status) + '"></i><span>' + status + '</span>';
    }

    function renderVehicleRows(filteredVehicles) {
        var tbody = dom.root.querySelector('[data-vehicle-table-body]');
        var table = dom.root.querySelector('[data-vehicle-table]');
        var emptyState = dom.root.querySelector('[data-vehicle-empty]');
        var filterEmptyState = dom.root.querySelector('[data-vehicle-filter-empty]');
        var rowTemplate = document.getElementById('vehicle-row-template');
        var startIndex = (vehicleRegistryData.currentPage - 1) * vehicleRegistryData.pageSize;
        var pageItems = filteredVehicles.slice(startIndex, startIndex + vehicleRegistryData.pageSize);

        if (!tbody || !rowTemplate) {
            return;
        }

        tbody.innerHTML = '';

        if (!vehicleRegistryData.vehicles.length) {
            table.classList.add('d-none');
            emptyState.classList.remove('d-none');
            filterEmptyState.classList.add('d-none');
            return;
        }

        if (!filteredVehicles.length) {
            table.classList.add('d-none');
            emptyState.classList.add('d-none');
            filterEmptyState.classList.remove('d-none');
            return;
        }

        table.classList.remove('d-none');
        emptyState.classList.add('d-none');
        filterEmptyState.classList.add('d-none');

        pageItems.forEach(function (vehicle) {
            var row = rowTemplate.content.cloneNode(true);
            var registrationCell = row.querySelector('[data-field="registrationNumber"]');
            var nameCell = row.querySelector('[data-field="name"]');
            var typeCell = row.querySelector('[data-field="type"]');
            var capacityCell = row.querySelector('[data-field="capacity"]');
            var odometerCell = row.querySelector('[data-field="odometer"]');
            var statusBadge = row.querySelector('[data-status-badge]');

            registrationCell.textContent = vehicle.registrationNumber;
            nameCell.textContent = vehicle.name;
            typeCell.textContent = vehicle.type;
            capacityCell.textContent = formatCapacity(vehicle);
            odometerCell.textContent = formatNumber(vehicle.odometer) + ' km';
            setBadgeTone(statusBadge, vehicle.status);

            row.querySelectorAll('[data-vehicle-action]').forEach(function (button) {
                button.setAttribute('data-vehicle-id', vehicle.id);
            });

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
        var filteredVehicles = getFilteredVehicles();

        updateSortIndicators();
        updateFilterButtonLabels();
        updatePagination(filteredVehicles.length);
        updatePageCopy(filteredVehicles);
        renderVehicleRows(filteredVehicles);
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

    function openVehicleModal(mode, vehicleId) {
        var modalElement = document.getElementById('vehicleFormModal');
        var modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        var form = document.getElementById('vehicle-form');
        var titleNode = modalElement.querySelector('[data-vehicle-modal-title]');
        var subtitleNode = modalElement.querySelector('[data-vehicle-modal-subtitle]');
        var saveButton = modalElement.querySelector('[data-vehicle-save-button]');
        var vehicle = vehicleId ? getVehicleById(vehicleId) : null;
        var inputs = form.querySelectorAll('input, select, textarea');

        state.editingId = mode === 'edit' ? vehicleId : null;
        state.viewOnly = mode === 'view';

        form.reset();
        form.setAttribute('data-mode', mode);
        form.querySelector('#vehicle-id').value = vehicle ? vehicle.id : '';

        if (titleNode) {
            titleNode.textContent = mode === 'edit' ? 'Edit Vehicle' : mode === 'view' ? 'Vehicle Details' : 'Register Vehicle';
        }

        if (subtitleNode) {
            subtitleNode.textContent = mode === 'edit' ? 'Update fleet asset details and operational status.' : mode === 'view' ? 'Review vehicle details before making changes.' : 'Add a new vehicle to the registry.';
        }

        if (vehicle) {
            form.querySelector('#vehicle-registration-number').value = vehicle.registrationNumber;
            form.querySelector('#vehicle-name').value = vehicle.name;
            form.querySelector('#vehicle-type').value = vehicle.type;
            form.querySelector('#vehicle-status').value = vehicle.status;
            form.querySelector('#vehicle-capacity').value = vehicle.capacityValue;
            form.querySelector('#vehicle-odometer').value = vehicle.odometer;
            form.querySelector('#vehicle-acquisition-cost').value = vehicle.acquisitionCost;
        }

        inputs.forEach(function (input) {
            input.disabled = state.viewOnly;
            input.classList.remove('is-invalid');
        });

        form.querySelectorAll('[data-field-error]').forEach(function (message) {
            message.textContent = '';
        });

        if (saveButton) {
            saveButton.classList.toggle('d-none', state.viewOnly);
        }

        modal.show();

        window.setTimeout(function () {
            var focusTarget = state.viewOnly ? modalElement.querySelector('[data-bs-dismiss="modal"]') : form.querySelector('#vehicle-registration-number');

            if (focusTarget) {
                focusTarget.focus();
            }
        }, 150);
    }

    function validateVehicleForm(form) {
        var registrationNumber = form.querySelector('#vehicle-registration-number');
        var vehicleName = form.querySelector('#vehicle-name');
        var vehicleType = form.querySelector('#vehicle-type');
        var capacity = form.querySelector('#vehicle-capacity');
        var odometer = form.querySelector('#vehicle-odometer');
        var acquisitionCost = form.querySelector('#vehicle-acquisition-cost');
        var errors = {};
        var currentId = form.querySelector('#vehicle-id').value || null;
        var normalisedRegistration = registrationNumber.value.trim().toUpperCase();

        if (!normalisedRegistration) {
            errors.registration_number = 'Registration number is required.';
        } else if (vehicleRegistryData.vehicles.some(function (vehicle) {
            return vehicle.registrationNumber.toUpperCase() === normalisedRegistration && vehicle.id !== currentId;
        })) {
            errors.registration_number = 'Registration number must be unique.';
        }

        if (!vehicleName.value.trim()) {
            errors.vehicle_name = 'Vehicle name is required.';
        }

        if (!vehicleType.value) {
            errors.vehicle_type = 'Vehicle type is required.';
        }

        if (!capacity.value || Number(capacity.value) <= 0) {
            errors.capacity = 'Maximum load capacity must be a positive number.';
        }

        if (!odometer.value || Number(odometer.value) < 0) {
            errors.odometer = 'Odometer cannot be negative.';
        }

        if (!acquisitionCost.value || Number(acquisitionCost.value) <= 0) {
            errors.acquisition_cost = 'Acquisition cost must be a positive currency value.';
        }

        return errors;
    }

    function showValidationErrors(form, errors) {
        form.querySelectorAll('.is-invalid').forEach(function (field) {
            field.classList.remove('is-invalid');
        });

        form.querySelectorAll('[data-field-error]').forEach(function (message) {
            message.textContent = '';
        });

        Object.keys(errors).forEach(function (fieldName) {
            var field = form.querySelector('[name="' + fieldName + '"]');
            var message = form.querySelector('[data-field-error="' + fieldName + '"]');

            if (field) {
                field.classList.add('is-invalid');
            }

            if (message) {
                message.textContent = errors[fieldName];
            }
        });
    }

    function saveVehicle(form) {
        var errors = validateVehicleForm(form);

        if (Object.keys(errors).length) {
            showValidationErrors(form, errors);
            return false;
        }

        var vehicleId = form.querySelector('#vehicle-id').value;
        var capacityValue = Number(form.querySelector('#vehicle-capacity').value);
        var vehicleType = form.querySelector('#vehicle-type').value;
        var vehiclePayload = {
            id: vehicleId || ('veh-' + Math.random().toString(36).slice(2, 9)),
            registrationNumber: form.querySelector('#vehicle-registration-number').value.trim().toUpperCase(),
            name: form.querySelector('#vehicle-name').value.trim(),
            type: vehicleType,
            capacityValue: capacityValue,
            capacityUnit: vehicleType === 'Bus' ? 'Seats' : 'kg',
            odometer: Number(form.querySelector('#vehicle-odometer').value),
            acquisitionCost: Number(form.querySelector('#vehicle-acquisition-cost').value),
            status: form.querySelector('#vehicle-status').value,
            region: vehicleId ? ((function () {
                var existingVehicle = getVehicleById(vehicleId);
                return existingVehicle ? existingVehicle.region : 'North';
            }()) : 'North')
        };

        if (vehicleId) {
            vehicleRegistryData.vehicles = vehicleRegistryData.vehicles.map(function (vehicle) {
                if (vehicle.id !== vehicleId) {
                    return vehicle;
                }

                return Object.assign({}, vehicle, vehiclePayload);
            });
        } else {
            vehicleRegistryData.vehicles.unshift(vehiclePayload);
        }

        vehicleRegistryData.currentPage = 1;
        renderTable();
        bootstrap.Modal.getInstance(document.getElementById('vehicleFormModal')).hide();

        return true;
    }

    function openDeleteModal(vehicleId) {
        state.pendingDeleteId = vehicleId;
        bootstrap.Modal.getOrCreateInstance(document.getElementById('vehicleDeleteModal')).show();
    }

    function confirmDelete() {
        if (!state.pendingDeleteId) {
            return;
        }

        vehicleRegistryData.vehicles = vehicleRegistryData.vehicles.filter(function (vehicle) {
            return vehicle.id !== state.pendingDeleteId;
        });
        state.pendingDeleteId = null;
        vehicleRegistryData.currentPage = 1;
        renderTable();
        bootstrap.Modal.getInstance(document.getElementById('vehicleDeleteModal')).hide();
    }

    function resetDraftFilters() {
        vehicleRegistryData.draftFilters = {
            type: 'all',
            status: 'all',
            region: 'all'
        };
        updateFilterButtonLabels();
    }

    function applyFilters() {
        vehicleRegistryData.filters = Object.assign({}, vehicleRegistryData.draftFilters);
        vehicleRegistryData.currentPage = 1;
        renderTable();
    }

    function handleSortClick(event) {
        var button = event.target.closest('[data-sort-key]');

        if (!button) {
            return;
        }

        var key = button.getAttribute('data-sort-key');

        if (vehicleRegistryData.sort.field === key) {
            vehicleRegistryData.sort.direction = vehicleRegistryData.sort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            vehicleRegistryData.sort.field = key;
            vehicleRegistryData.sort.direction = 'asc';
        }

        renderTable();
    }

    function handleActionClick(event) {
        var actionButton = event.target.closest('[data-vehicle-action]');

        if (actionButton) {
            var vehicleId = actionButton.getAttribute('data-vehicle-id');
            var action = actionButton.getAttribute('data-vehicle-action');

            if (action === 'view') {
                openVehicleModal('view', vehicleId);
            }

            if (action === 'edit') {
                openVehicleModal('edit', vehicleId);
            }

            if (action === 'delete') {
                openDeleteModal(vehicleId);
            }
        }

        if (event.target.closest('[data-vehicle-create-button], [data-vehicle-empty-action]')) {
            openVehicleModal('create');
        }

        if (event.target.closest('[data-vehicle-filter-reset], [data-vehicle-reset-filters]')) {
            resetDraftFilters();
            applyFilters();
        }

        if (event.target.closest('[data-vehicle-apply-filters]')) {
            applyFilters();
        }

        var filterOption = event.target.closest('[data-filter-option]');

        if (filterOption) {
            var group = filterOption.getAttribute('data-filter-group');
            var value = filterOption.getAttribute('data-filter-value');

            vehicleRegistryData.draftFilters[group] = value;
            updateFilterButtonLabels();
            closeDropdownMenus();
        }

        var pageButton = event.target.closest('[data-page]');

        if (pageButton && !pageButton.closest('.disabled')) {
            vehicleRegistryData.currentPage = Number(pageButton.getAttribute('data-page'));
            renderTable();
        }
    }

    function bindEvents() {
        dom.searchInput.addEventListener('input', function (event) {
            vehicleRegistryData.searchTerm = event.target.value || '';
            vehicleRegistryData.currentPage = 1;
            renderTable();
        });

        dom.root.addEventListener('click', handleActionClick);

        document.getElementById('vehicle-form').addEventListener('submit', function (event) {
            event.preventDefault();
            if (state.viewOnly) {
                return;
            }

            saveVehicle(event.currentTarget);
        });

        document.querySelector('[data-vehicle-confirm-delete]').addEventListener('click', confirmDelete);

        document.getElementById('vehicleFormModal').addEventListener('hidden.bs.modal', function () {
            state.editingId = null;
            state.viewOnly = false;

            var form = document.getElementById('vehicle-form');
            form.reset();
            form.querySelectorAll('.is-invalid').forEach(function (field) {
                field.classList.remove('is-invalid');
            });
            form.querySelectorAll('[data-field-error]').forEach(function (message) {
                message.textContent = '';
            });
            form.querySelectorAll('input, select, textarea').forEach(function (input) {
                input.disabled = false;
            });

            var saveButton = document.querySelector('[data-vehicle-save-button]');
            if (saveButton) {
                saveButton.classList.remove('d-none');
            }
        });

        document.getElementById('vehicleDeleteModal').addEventListener('hidden.bs.modal', function () {
            state.pendingDeleteId = null;
        });

        dom.root.querySelectorAll('[data-sort-key]').forEach(function (button) {
            button.addEventListener('click', handleSortClick);
        });
    }

    function init() {
        dom.root = document.querySelector('[data-vehicle-registry-root]');
        dom.searchInput = document.querySelector('[name="vehicle_registry_search"]');

        if (!dom.root || !dom.searchInput) {
            return;
        }

        renderSummaryCards();
        updateFilterButtonLabels();
        updateSortIndicators();
        bindEvents();
        renderLoadingState();

        window.setTimeout(function () {
            vehicleRegistryData.loading = false;
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