(function () {
    var driverManagementData = {
        loading: true,
        pageSize: 4,
        currentPage: 1,
        searchTerm: '',
        sort: {
            field: 'name',
            direction: 'asc'
        },
        filters: {
            licenseCategory: 'all',
            status: 'all',
            safetyScore: 'all'
        },
        draftFilters: {
            licenseCategory: 'all',
            status: 'all',
            safetyScore: 'all'
        },
        summary: {
            total: 32,
            available: 24,
            onTrip: 6,
            suspended: 2
        },
        options: {
            licenseCategoryLabels: {
                all: 'All categories',
                LMV: 'LMV',
                HMV: 'HMV',
                PSV: 'PSV'
            },
            statusLabels: {
                all: 'All statuses',
                Available: 'Available',
                'On Trip': 'On Trip',
                'Off Duty': 'Off Duty',
                Suspended: 'Suspended',
                Expired: 'Expired'
            },
            safetyScoreLabels: {
                all: 'All scores',
                excellent: 'Excellent',
                good: 'Good',
                average: 'Average',
                poor: 'Poor'
            }
        },
        drivers: [
            {
                id: 'drv-001',
                name: 'Alex Johnson',
                licenseNumber: 'DL-GJ-872312',
                licenseCategory: 'LMV',
                licenseExpiryDate: '2028-08-12',
                contactNumber: '919876543210',
                safetyScore: 96,
                status: 'Available'
            },
            {
                id: 'drv-002',
                name: 'Sarah Connor',
                licenseNumber: 'DL-GJ-201887',
                licenseCategory: 'HMV',
                licenseExpiryDate: '2027-01-18',
                contactNumber: '919988776655',
                safetyScore: 91,
                status: 'On Trip'
            },
            {
                id: 'drv-003',
                name: 'Marcus Lee',
                licenseNumber: 'DL-GJ-001221',
                licenseCategory: 'LMV',
                licenseExpiryDate: '2025-05-02',
                contactNumber: '919876500011',
                safetyScore: 88,
                status: 'Suspended'
            },
            {
                id: 'drv-004',
                name: 'Emily Davis',
                licenseNumber: 'DL-GJ-876552',
                licenseCategory: 'HMV',
                licenseExpiryDate: '2029-11-30',
                contactNumber: '919123456789',
                safetyScore: 99,
                status: 'Available'
            },
            {
                id: 'drv-005',
                name: 'Aisha Khan',
                licenseNumber: 'DL-GJ-445190',
                licenseCategory: 'PSV',
                licenseExpiryDate: '2026-09-15',
                contactNumber: '919812345678',
                safetyScore: 84,
                status: 'Off Duty'
            },
            {
                id: 'drv-006',
                name: 'Raj Patel',
                licenseNumber: 'DL-GJ-552178',
                licenseCategory: 'LMV',
                licenseExpiryDate: '2028-03-27',
                contactNumber: '919765432109',
                safetyScore: 73,
                status: 'Available'
            },
            {
                id: 'drv-007',
                name: 'Nina Gomez',
                licenseNumber: 'DL-GJ-332901',
                licenseCategory: 'HMV',
                licenseExpiryDate: '2026-12-05',
                contactNumber: '919902345678',
                safetyScore: 66,
                status: 'On Trip'
            },
            {
                id: 'drv-008',
                name: 'Omar Hussain',
                licenseNumber: 'DL-GJ-110244',
                licenseCategory: 'LMV',
                licenseExpiryDate: '2027-04-09',
                contactNumber: '919884401122',
                safetyScore: 58,
                status: 'Suspended'
            }
        ]
    };

    window.driverManagementData = driverManagementData;

    var state = {
        editingId: null,
        viewOnly: false,
        pendingDeleteId: null
    };

    var dom = {};

    function getDriverById(id) {
        return driverManagementData.drivers.find(function (driver) {
            return driver.id === id;
        }) || null;
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

    function formatContactNumber(value) {
        var digits = String(value || '').replace(/\D/g, '');
        var nationalNumber = digits.length > 10 ? digits.slice(-10) : digits;

        if (!nationalNumber) {
            return '--';
        }

        return '+91 ' + nationalNumber;
    }

    function normalizeDigits(value) {
        return String(value || '').replace(/\D/g, '');
    }

    function isExpired(driver) {
        var expiryDate = new Date(driver.licenseExpiryDate + 'T00:00:00');
        var today = new Date();

        today.setHours(0, 0, 0, 0);

        return expiryDate < today;
    }

    function getDisplayStatus(driver) {
        if (isExpired(driver)) {
            return 'Expired';
        }

        return driver.status;
    }

    function getStatusRank(status) {
        var ranks = {
            Available: 1,
            'On Trip': 2,
            'Off Duty': 3,
            Suspended: 4,
            Expired: 5
        };

        return ranks[status] || 99;
    }

    function getStatusTone(status) {
        var tones = {
            Available: 'success',
            'On Trip': 'info',
            'Off Duty': 'warning',
            Suspended: 'danger',
            Expired: 'danger'
        };

        return tones[status] || 'info';
    }

    function getStatusIcon(status) {
        var icons = {
            Available: 'person-check',
            'On Trip': 'truck',
            'Off Duty': 'moon-stars',
            Suspended: 'person-x',
            Expired: 'calendar-x'
        };

        return icons[status] || 'circle-fill';
    }

    function getSafetyScoreBand(score) {
        if (score >= 95) {
            return 'excellent';
        }

        if (score >= 80) {
            return 'good';
        }

        if (score >= 60) {
            return 'average';
        }

        return 'poor';
    }

    function getSafetyScoreTone(score) {
        var band = getSafetyScoreBand(score);
        var tones = {
            excellent: 'success',
            good: 'info',
            average: 'warning',
            poor: 'danger'
        };

        return tones[band];
    }

    function getSafetyScoreIcon(score) {
        var band = getSafetyScoreBand(score);
        var icons = {
            excellent: 'shield-check',
            good: 'shield-check',
            average: 'shield-exclamation',
            poor: 'exclamation-triangle'
        };

        return icons[band];
    }

    function getSafetyScoreLabel(score) {
        var labels = {
            excellent: 'Excellent',
            good: 'Good',
            average: 'Average',
            poor: 'Poor'
        };

        return labels[getSafetyScoreBand(score)];
    }

    function getFilterLabel(filterGroup, value) {
        return driverManagementData.options[filterGroup + 'Labels'][value] || value || '';
    }

    function matchesSearch(driver, term) {
        if (!term) {
            return true;
        }

        var haystack = [driver.name, driver.licenseNumber, formatContactNumber(driver.contactNumber), normalizeDigits(driver.contactNumber)].join(' ').toLowerCase();

        return haystack.indexOf(term) !== -1;
    }

    function matchesSafetyScoreFilter(driver, filterValue) {
        var band = getSafetyScoreBand(driver.safetyScore);

        return filterValue === 'all' || band === filterValue;
    }

    function getFilteredDrivers() {
        var term = driverManagementData.searchTerm.trim().toLowerCase();

        return driverManagementData.drivers.filter(function (driver) {
            var matchesCategory = driverManagementData.filters.licenseCategory === 'all' || driver.licenseCategory === driverManagementData.filters.licenseCategory;
            var displayStatus = getDisplayStatus(driver);
            var matchesStatus = driverManagementData.filters.status === 'all' || displayStatus === driverManagementData.filters.status;
            var matchesScore = matchesSafetyScoreFilter(driver, driverManagementData.filters.safetyScore);

            return matchesCategory && matchesStatus && matchesScore && matchesSearch(driver, term);
        }).sort(function (left, right) {
            var field = driverManagementData.sort.field;
            var direction = driverManagementData.sort.direction === 'asc' ? 1 : -1;
            var leftValue = left[field];
            var rightValue = right[field];

            if (field === 'status') {
                leftValue = getStatusRank(getDisplayStatus(left));
                rightValue = getStatusRank(getDisplayStatus(right));
            }

            if (field === 'licenseExpiryDate') {
                leftValue = new Date(leftValue + 'T00:00:00').getTime();
                rightValue = new Date(rightValue + 'T00:00:00').getTime();
            }

            if (field === 'safetyScore') {
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
        setMetricValue('total', driverManagementData.summary.total);
        setMetricValue('available', driverManagementData.summary.available);
        setMetricValue('onTrip', driverManagementData.summary.onTrip);
        setMetricValue('suspended', driverManagementData.summary.suspended);
    }

    function updateFilterButtonLabels() {
        Object.keys(driverManagementData.draftFilters).forEach(function (filterKey) {
            var labelNode = dom.root.querySelector('[data-filter-label="' + filterKey + '"]');

            if (labelNode) {
                labelNode.textContent = getFilterLabel(filterKey, driverManagementData.draftFilters[filterKey]);
            }
        });

        dom.root.querySelectorAll('[data-filter-option]').forEach(function (button) {
            var group = button.getAttribute('data-filter-group');
            var value = button.getAttribute('data-filter-value');
            var isSelected = driverManagementData.draftFilters[group] === value;
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

            icon.className = 'bi ' + (driverManagementData.sort.field === field ? (driverManagementData.sort.direction === 'asc' ? 'bi-sort-down' : 'bi-sort-up') : 'bi-arrow-down-up');
        });
    }

    function updatePagination(totalItems) {
        var paginationHost = dom.root.querySelector('[data-driver-pagination]');
        var paginationList = paginationHost ? paginationHost.querySelector('.pagination') : null;
        var totalPages = totalItems ? Math.ceil(totalItems / driverManagementData.pageSize) : 0;

        if (!paginationList) {
            return;
        }

        if (totalPages <= 1) {
            paginationHost.classList.add('d-none');
            paginationList.innerHTML = '';
            return;
        }

        paginationHost.classList.remove('d-none');

        if (driverManagementData.currentPage > totalPages) {
            driverManagementData.currentPage = totalPages;
        }

        var items = [];
        var previousDisabled = driverManagementData.currentPage === 1;
        var nextDisabled = driverManagementData.currentPage === totalPages;

        items.push('<li class="page-item ' + (previousDisabled ? 'disabled' : '') + '"><button type="button" class="page-link" data-page="' + (driverManagementData.currentPage - 1) + '" ' + (previousDisabled ? 'tabindex="-1" aria-disabled="true"' : '') + '>Prev</button></li>');

        for (var page = 1; page <= totalPages; page += 1) {
            items.push('<li class="page-item ' + (page === driverManagementData.currentPage ? 'active' : '') + '"><button type="button" class="page-link" data-page="' + page + '" aria-current="' + (page === driverManagementData.currentPage ? 'page' : 'false') + '">' + page + '</button></li>');
        }

        items.push('<li class="page-item ' + (nextDisabled ? 'disabled' : '') + '"><button type="button" class="page-link" data-page="' + (driverManagementData.currentPage + 1) + '" ' + (nextDisabled ? 'tabindex="-1" aria-disabled="true"' : '') + '>Next</button></li>');

        paginationList.innerHTML = items.join('');
    }

    function updatePageCopy(filteredDrivers) {
        var resultsCount = dom.root.querySelector('[data-driver-results-count]');
        var pageSummary = dom.root.querySelector('[data-driver-page-summary]');
        var pageInfo = dom.root.querySelector('[data-driver-page-info]');
        var totalFiltered = filteredDrivers.length;
        var start = totalFiltered ? ((driverManagementData.currentPage - 1) * driverManagementData.pageSize) + 1 : 0;
        var end = Math.min(driverManagementData.currentPage * driverManagementData.pageSize, totalFiltered);

        if (resultsCount) {
            resultsCount.textContent = totalFiltered + ' driver' + (totalFiltered === 1 ? '' : 's') + ' found';
        }

        if (pageSummary) {
            pageSummary.textContent = totalFiltered ? 'Showing ' + start + '-' + end + ' of ' + totalFiltered + ' driver' + (totalFiltered === 1 ? '' : 's') + '.' : 'No drivers available for the current filters.';
        }

        if (pageInfo) {
            pageInfo.textContent = totalFiltered ? 'Page ' + driverManagementData.currentPage + ' of ' + Math.max(1, Math.ceil(totalFiltered / driverManagementData.pageSize)) : 'No results';
        }
    }

    function setBadgeTone(badge, status, icon, label) {
        badge.className = 'app-badge app-badge-' + status;
        badge.innerHTML = '<i class="bi bi-' + icon + '"></i><span>' + label + '</span>';
    }

    function renderDriverRows(filteredDrivers) {
        var tbody = dom.root.querySelector('[data-driver-table-body]');
        var table = dom.root.querySelector('[data-driver-table]');
        var emptyState = dom.root.querySelector('[data-driver-empty]');
        var filterEmptyState = dom.root.querySelector('[data-driver-filter-empty]');
        var rowTemplate = document.getElementById('driver-row-template');
        var startIndex = (driverManagementData.currentPage - 1) * driverManagementData.pageSize;
        var pageItems = filteredDrivers.slice(startIndex, startIndex + driverManagementData.pageSize);

        if (!tbody || !rowTemplate) {
            return;
        }

        tbody.innerHTML = '';

        if (!driverManagementData.drivers.length) {
            table.classList.add('d-none');
            emptyState.classList.remove('d-none');
            filterEmptyState.classList.add('d-none');
            return;
        }

        if (!filteredDrivers.length) {
            table.classList.add('d-none');
            emptyState.classList.add('d-none');
            filterEmptyState.classList.remove('d-none');
            return;
        }

        table.classList.remove('d-none');
        emptyState.classList.add('d-none');
        filterEmptyState.classList.add('d-none');

        pageItems.forEach(function (driver) {
            var row = rowTemplate.content.cloneNode(true);
            var nameCell = row.querySelector('[data-field="name"]');
            var licenseCell = row.querySelector('[data-field="licenseNumber"]');
            var categoryCell = row.querySelector('[data-field="licenseCategory"]');
            var expiryCell = row.querySelector('[data-field="licenseExpiryDate"]');
            var safetyCell = row.querySelector('[data-field="safetyScore"]');
            var contactCell = row.querySelector('[data-field="contactNumber"]');
            var statusBadge = row.querySelector('[data-status-badge]');
            var displayStatus = getDisplayStatus(driver);
            var safetyTone = getSafetyScoreTone(driver.safetyScore);

            nameCell.textContent = driver.name;
            licenseCell.textContent = driver.licenseNumber;
            categoryCell.textContent = driver.licenseCategory;
            contactCell.textContent = formatContactNumber(driver.contactNumber);

            if (isExpired(driver)) {
                expiryCell.innerHTML = '<span class="app-badge app-badge-danger"><i class="bi bi-calendar-x"></i><span>Expired</span></span>';
            } else {
                expiryCell.textContent = formatDate(driver.licenseExpiryDate);
            }

            safetyCell.innerHTML = '<span class="app-badge app-badge-' + safetyTone + '"><i class="bi bi-' + getSafetyScoreIcon(driver.safetyScore) + '"></i><span>' + driver.safetyScore + '% ' + getSafetyScoreLabel(driver.safetyScore) + '</span></span>';
            setBadgeTone(statusBadge, getStatusTone(displayStatus), getStatusIcon(displayStatus), displayStatus);

            row.querySelectorAll('[data-driver-action]').forEach(function (button) {
                button.setAttribute('data-driver-id', driver.id);
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
        var filteredDrivers = getFilteredDrivers();

        updateSortIndicators();
        updateFilterButtonLabels();
        updatePagination(filteredDrivers.length);
        updatePageCopy(filteredDrivers);
        renderDriverRows(filteredDrivers);
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

    function openDriverModal(mode, driverId) {
        var modalElement = document.getElementById('driverFormModal');
        var modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        var form = document.getElementById('driver-form');
        var titleNode = modalElement.querySelector('.modal-title');
        var subtitleNode = modalElement.querySelector('[data-driver-modal-subtitle]');
        var saveButton = modalElement.querySelector('[data-driver-save-button]');
        var driver = driverId ? getDriverById(driverId) : null;
        var inputs = form.querySelectorAll('input, select, textarea');

        state.editingId = mode === 'edit' ? driverId : null;
        state.viewOnly = mode === 'view';

        form.reset();
        form.setAttribute('data-mode', mode);
        form.querySelector('#driver-id').value = driver ? driver.id : '';

        if (titleNode) {
            titleNode.textContent = mode === 'edit' ? 'Edit Driver' : mode === 'view' ? 'Driver Details' : 'Register Driver';
        }

        if (subtitleNode) {
            subtitleNode.textContent = mode === 'edit' ? 'Update driver profile, license and availability.' : mode === 'view' ? 'Review driver details before making changes.' : 'Add a new driver profile.';
        }

        if (driver) {
            form.querySelector('#driver-name').value = driver.name;
            form.querySelector('#driver-license-number').value = driver.licenseNumber;
            form.querySelector('#driver-license-category').value = driver.licenseCategory;
            form.querySelector('#driver-license-expiry-date').value = driver.licenseExpiryDate;
            form.querySelector('#driver-contact-number').value = normalizeDigits(driver.contactNumber);
            form.querySelector('#driver-safety-score').value = driver.safetyScore;
            form.querySelector('#driver-status').value = driver.status;
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
            var focusTarget = state.viewOnly ? modalElement.querySelector('[data-bs-dismiss="modal"]') : form.querySelector('#driver-name');

            if (focusTarget) {
                focusTarget.focus();
            }
        }, 150);
    }

    function validateDriverForm(form) {
        var driverName = form.querySelector('#driver-name');
        var licenseNumber = form.querySelector('#driver-license-number');
        var licenseCategory = form.querySelector('#driver-license-category');
        var licenseExpiryDate = form.querySelector('#driver-license-expiry-date');
        var contactNumber = form.querySelector('#driver-contact-number');
        var safetyScore = form.querySelector('#driver-safety-score');
        var status = form.querySelector('#driver-status');
        var errors = {};
        var contactDigits = normalizeDigits(contactNumber.value);
        var scoreValue = Number(safetyScore.value);

        if (!driverName.value.trim()) {
            errors.driver_name = 'Driver name is required.';
        }

        if (!licenseNumber.value.trim()) {
            errors.license_number = 'License number is required.';
        }

        if (!licenseCategory.value) {
            errors.license_category = 'License category is required.';
        }

        if (!licenseExpiryDate.value) {
            errors.license_expiry_date = 'License expiry date is required.';
        }

        if (!contactDigits) {
            errors.contact_number = 'Contact number is required.';
        } else if (!/^\d+$/.test(contactDigits)) {
            errors.contact_number = 'Contact number must contain digits only.';
        }

        if (safetyScore.value === '' || Number.isNaN(scoreValue) || scoreValue < 0 || scoreValue > 100) {
            errors.safety_score = 'Safety score must be between 0 and 100.';
        }

        if (!status.value) {
            errors.status = 'Status is required.';
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

    function saveDriver(form) {
        var errors = validateDriverForm(form);

        if (Object.keys(errors).length) {
            showValidationErrors(form, errors);
            return false;
        }

        var driverId = form.querySelector('#driver-id').value;
        var driverPayload = {
            id: driverId || ('drv-' + Math.random().toString(36).slice(2, 9)),
            name: form.querySelector('#driver-name').value.trim(),
            licenseNumber: form.querySelector('#driver-license-number').value.trim().toUpperCase(),
            licenseCategory: form.querySelector('#driver-license-category').value,
            licenseExpiryDate: form.querySelector('#driver-license-expiry-date').value,
            contactNumber: normalizeDigits(form.querySelector('#driver-contact-number').value),
            safetyScore: Number(form.querySelector('#driver-safety-score').value),
            status: form.querySelector('#driver-status').value
        };

        if (driverId) {
            driverManagementData.drivers = driverManagementData.drivers.map(function (driver) {
                if (driver.id !== driverId) {
                    return driver;
                }

                return Object.assign({}, driver, driverPayload);
            });
        } else {
            driverManagementData.drivers.unshift(driverPayload);
        }

        driverManagementData.currentPage = 1;
        renderTable();
        bootstrap.Modal.getInstance(document.getElementById('driverFormModal')).hide();

        return true;
    }

    function openDeleteModal(driverId) {
        state.pendingDeleteId = driverId;
        bootstrap.Modal.getOrCreateInstance(document.getElementById('driverDeleteModal')).show();
    }

    function confirmDelete() {
        if (!state.pendingDeleteId) {
            return;
        }

        driverManagementData.drivers = driverManagementData.drivers.filter(function (driver) {
            return driver.id !== state.pendingDeleteId;
        });
        state.pendingDeleteId = null;
        driverManagementData.currentPage = 1;
        renderTable();
        bootstrap.Modal.getInstance(document.getElementById('driverDeleteModal')).hide();
    }

    function resetDraftFilters() {
        driverManagementData.draftFilters = {
            licenseCategory: 'all',
            status: 'all',
            safetyScore: 'all'
        };
        updateFilterButtonLabels();
    }

    function applyFilters() {
        driverManagementData.filters = Object.assign({}, driverManagementData.draftFilters);
        driverManagementData.currentPage = 1;
        renderTable();
    }

    function handleSortClick(event) {
        var button = event.target.closest('[data-sort-key]');

        if (!button) {
            return;
        }

        var key = button.getAttribute('data-sort-key');

        if (driverManagementData.sort.field === key) {
            driverManagementData.sort.direction = driverManagementData.sort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            driverManagementData.sort.field = key;
            driverManagementData.sort.direction = 'asc';
        }

        renderTable();
    }

    function handleActionClick(event) {
        var actionButton = event.target.closest('[data-driver-action]');

        if (actionButton) {
            var driverId = actionButton.getAttribute('data-driver-id');
            var action = actionButton.getAttribute('data-driver-action');

            if (action === 'view') {
                openDriverModal('view', driverId);
            }

            if (action === 'edit') {
                openDriverModal('edit', driverId);
            }

            if (action === 'delete') {
                openDeleteModal(driverId);
            }
        }

        if (event.target.closest('[data-driver-create-button], [data-driver-empty-action]')) {
            openDriverModal('create');
        }

        if (event.target.closest('[data-driver-filter-reset], [data-driver-reset-filters]')) {
            resetDraftFilters();
            applyFilters();
        }

        if (event.target.closest('[data-driver-apply-filters]')) {
            applyFilters();
        }

        var filterOption = event.target.closest('[data-filter-option]');

        if (filterOption) {
            var group = filterOption.getAttribute('data-filter-group');
            var value = filterOption.getAttribute('data-filter-value');

            driverManagementData.draftFilters[group] = value;
            updateFilterButtonLabels();
            closeDropdownMenus();
        }

        var pageButton = event.target.closest('[data-page]');

        if (pageButton && !pageButton.closest('.disabled')) {
            driverManagementData.currentPage = Number(pageButton.getAttribute('data-page'));
            renderTable();
        }
    }

    function bindEvents() {
        dom.searchInput.addEventListener('input', function (event) {
            driverManagementData.searchTerm = event.target.value || '';
            driverManagementData.currentPage = 1;
            renderTable();
        });

        dom.contactInput.addEventListener('input', function (event) {
            event.target.value = normalizeDigits(event.target.value);
        });

        dom.root.addEventListener('click', handleActionClick);

        document.getElementById('driver-form').addEventListener('submit', function (event) {
            event.preventDefault();
            if (state.viewOnly) {
                return;
            }

            saveDriver(event.currentTarget);
        });

        document.getElementById('driverDeleteModal').querySelector('.modal-footer .btn-danger').addEventListener('click', confirmDelete);

        document.getElementById('driverFormModal').addEventListener('hidden.bs.modal', function () {
            state.editingId = null;
            state.viewOnly = false;

            var form = document.getElementById('driver-form');
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

            var saveButton = document.querySelector('[data-driver-save-button]');
            if (saveButton) {
                saveButton.classList.remove('d-none');
            }
        });

        document.getElementById('driverDeleteModal').addEventListener('hidden.bs.modal', function () {
            state.pendingDeleteId = null;
        });

        dom.root.querySelectorAll('[data-sort-key]').forEach(function (button) {
            button.addEventListener('click', handleSortClick);
        });
    }

    function init() {
        dom.root = document.querySelector('[data-driver-management-root]');
        dom.searchInput = document.querySelector('[name="driver_management_search"]');
        dom.contactInput = document.getElementById('driver-contact-number');

        if (!dom.root || !dom.searchInput || !dom.contactInput) {
            return;
        }

        renderSummaryCards();
        updateFilterButtonLabels();
        updateSortIndicators();
        bindEvents();
        renderLoadingState();

        window.setTimeout(function () {
            driverManagementData.loading = false;
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