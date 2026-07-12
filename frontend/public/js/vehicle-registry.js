(function () {
    const api = window.TransitOpsAPI;

    let vehicleRegistryData = {
        vehicles: [],
        pageSize: 5,
        currentPage: 1,
        searchTerm: '',
        sort: {
            field: 'registrationNumber',
            direction: 'asc'
        },
        filters: {
            type: 'all',
            status: 'all'
        }
    };

    let editingId = null;
    let viewOnly = false;
    let pendingDeleteId = null;

    const statusToneMap = {
        'available': 'success',
        'on trip': 'info',
        'maintenance': 'danger',
        'retired': 'warning'
    };

    function getToneForStatus(status) {
        return statusToneMap[String(status || '').toLowerCase()] || 'info';
    }

    async function loadVehicles() {
        try {
            document.getElementById('vehicle-table-body').innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4 text-app-muted">
                        <div class="spinner-border spinner-border-sm text-light me-2" role="status"></div>
                        Fetching fleet assets...
                    </td>
                </tr>
            `;

            // Fetch vehicles from API
            const apiVehicles = await api.vehicles.list(vehicleRegistryData.filters);
            
            // Map API structure to UI properties
            vehicleRegistryData.vehicles = apiVehicles.map(v => ({
                id: v.id,
                registrationNumber: v.registration_number,
                name: v.name_model,
                type: v.type,
                capacityValue: v.max_load_capacity,
                capacityUnit: v.type === 'Bus' ? 'Seats' : 'kg',
                odometer: v.odometer,
                acquisitionCost: v.acquisition_cost,
                status: v.status
            }));

            renderSummary();
            renderTable();
        } catch (err) {
            console.error('Error loading vehicles:', err);
        }
    }

    function renderSummary() {
        const vehicles = vehicleRegistryData.vehicles;
        const total = vehicles.length;
        const available = vehicles.filter(v => v.status === 'Available').length;
        const onTrip = vehicles.filter(v => v.status === 'On Trip').length;
        const maintenance = vehicles.filter(v => v.status === 'Maintenance' || v.status === 'In Shop').length;

        // Populate summary metrics cards
        const totalCard = document.querySelector('[data-summary-card="total"] [data-summary-value]');
        if (totalCard) totalCard.textContent = total;

        const availCard = document.querySelector('[data-summary-card="available"] [data-summary-value]');
        if (availCard) availCard.textContent = available;

        const tripCard = document.querySelector('[data-summary-card="onTrip"] [data-summary-value]');
        if (tripCard) tripCard.textContent = onTrip;

        const maintCard = document.querySelector('[data-summary-card="maintenance"] [data-summary-value]');
        if (maintCard) maintCard.textContent = maintenance;

        // Update count text
        const countLabel = document.getElementById('vehicle-count-label');
        if (countLabel) countLabel.textContent = `${total} vehicles registered`;
    }

    function renderTable() {
        const tbody = document.getElementById('vehicle-table-body');
        const emptyState = document.querySelector('[data-vehicle-empty]');
        const filterEmptyState = document.querySelector('[data-vehicle-filter-empty]');
        const tableWrapper = document.getElementById('vehicles-table-wrapper');
        const template = document.getElementById('vehicle-row-template');

        if (!tbody || !template) return;

        tbody.innerHTML = '';

        // Apply local search filtering
        let filtered = vehicleRegistryData.vehicles;
        if (vehicleRegistryData.searchTerm) {
            const term = vehicleRegistryData.searchTerm.toLowerCase();
            filtered = filtered.filter(v => 
                v.registrationNumber.toLowerCase().includes(term) ||
                v.name.toLowerCase().includes(term) ||
                v.type.toLowerCase().includes(term)
            );
        }

        // Apply Sorting
        const field = vehicleRegistryData.sort.field;
        const dir = vehicleRegistryData.sort.direction === 'asc' ? 1 : -1;
        filtered.sort((a, b) => {
            let valA = a[field];
            let valB = b[field];
            if (typeof valA === 'string') {
                return valA.localeCompare(valB) * dir;
            }
            return (valA - valB) * dir;
        });

        // Pagination
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / vehicleRegistryData.pageSize) || 1;
        
        if (vehicleRegistryData.currentPage > totalPages) {
            vehicleRegistryData.currentPage = totalPages;
        }

        const startIdx = (vehicleRegistryData.currentPage - 1) * vehicleRegistryData.pageSize;
        const endIdx = startIdx + vehicleRegistryData.pageSize;
        const pageItems = filtered.slice(startIdx, endIdx);

        // Display check
        if (vehicleRegistryData.vehicles.length === 0) {
            if (emptyState) emptyState.classList.remove('d-none');
            if (filterEmptyState) filterEmptyState.classList.add('d-none');
            if (tableWrapper) tableWrapper.classList.add('d-none');
            return;
        }

        if (totalItems === 0) {
            if (emptyState) emptyState.classList.add('d-none');
            if (filterEmptyState) filterEmptyState.classList.remove('d-none');
            if (tableWrapper) tableWrapper.classList.add('d-none');
            return;
        }

        if (emptyState) emptyState.classList.add('d-none');
        if (filterEmptyState) filterEmptyState.classList.add('d-none');
        if (tableWrapper) tableWrapper.classList.remove('d-none');

        pageItems.forEach(vehicle => {
            const row = template.content.cloneNode(true);
            const tr = row.querySelector('tr');
            
            row.querySelector('[data-field="registrationNumber"]').textContent = vehicle.registrationNumber;
            row.querySelector('[data-field="name"]').textContent = vehicle.name;
            row.querySelector('[data-field="type"]').textContent = vehicle.type;
            row.querySelector('[data-field="capacity"]').textContent = `${vehicle.capacityValue} ${vehicle.capacityUnit}`;
            row.querySelector('[data-field="odometer"]').textContent = `${vehicle.odometer.toLocaleString()} km`;
            
            const badge = row.querySelector('[data-status-badge]');
            if (badge) {
                badge.className = `badge bg-${getToneForStatus(vehicle.status)}`;
                badge.textContent = vehicle.status;
            }

            // Hook up action buttons
            row.querySelector('[data-vehicle-action="view"]').onclick = () => openFormModal('view', vehicle);
            row.querySelector('[data-vehicle-action="edit"]').onclick = () => openFormModal('edit', vehicle);
            row.querySelector('[data-vehicle-action="delete"]').onclick = () => openDeleteConfirm(vehicle.id);

            tbody.appendChild(row);
        });

        // Update Page Info
        const pageInfo = document.getElementById('vehicle-page-info');
        if (pageInfo) pageInfo.textContent = `Page ${vehicleRegistryData.currentPage} of ${totalPages}`;

        const pageSummary = document.getElementById('vehicle-page-summary');
        if (pageSummary) {
            const showingStart = totalItems === 0 ? 0 : startIdx + 1;
            const showingEnd = Math.min(endIdx, totalItems);
            pageSummary.textContent = `Showing ${showingStart} to ${showingEnd} of ${totalItems} vehicles`;
        }

        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        const pagList = document.getElementById('vehicle-pagination-list');
        if (!pagList) return;

        pagList.innerHTML = '';

        // Previous button
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${vehicleRegistryData.currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `<button type="button" class="page-link" aria-label="Previous"><i class="bi bi-chevron-left"></i></button>`;
        if (vehicleRegistryData.currentPage > 1) {
            prevLi.onclick = () => { vehicleRegistryData.currentPage--; renderTable(); };
        }
        pagList.appendChild(prevLi);

        // Pages
        for (let i = 1; i <= totalPages; i++) {
            const pageLi = document.createElement('li');
            pageLi.className = `page-item ${vehicleRegistryData.currentPage === i ? 'active' : ''}`;
            pageLi.innerHTML = `<button type="button" class="page-link">${i}</button>`;
            pageLi.onclick = () => { vehicleRegistryData.currentPage = i; renderTable(); };
            pagList.appendChild(pageLi);
        }

        // Next button
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${vehicleRegistryData.currentPage === totalPages ? 'disabled' : ''}`;
        nextLi.innerHTML = `<button type="button" class="page-link" aria-label="Next"><i class="bi bi-chevron-right"></i></button>`;
        if (vehicleRegistryData.currentPage < totalPages) {
            nextLi.onclick = () => { vehicleRegistryData.currentPage++; renderTable(); };
        }
        pagList.appendChild(nextLi);
    }

    function openFormModal(mode, vehicle = null) {
        editingId = vehicle ? vehicle.id : null;
        viewOnly = mode === 'view';

        const title = document.getElementById('vehicle-modal-title');
        const submitBtn = document.getElementById('save-vehicle-btn');
        const errDiv = document.getElementById('vehicle-modal-error');

        if (errDiv) errDiv.classList.add('d-none');

        if (title) title.textContent = mode === 'create' ? 'Register Vehicle' : mode === 'edit' ? 'Edit Vehicle Asset' : 'Vehicle Specifications';
        if (submitBtn) {
            submitBtn.textContent = mode === 'create' ? 'Register Vehicle' : 'Save Changes';
            submitBtn.classList.toggle('d-none', viewOnly);
        }

        // Populate fields
        document.getElementById('vehicle-id').value = editingId || '';
        document.getElementById('vehicle-registration-number').value = vehicle ? vehicle.registrationNumber : '';
        document.getElementById('vehicle-name').value = vehicle ? vehicle.name : '';
        document.getElementById('vehicle-type').value = vehicle ? vehicle.type : '';
        document.getElementById('vehicle-status').value = vehicle ? vehicle.status : 'Available';
        document.getElementById('vehicle-capacity').value = vehicle ? vehicle.capacityValue : '';
        document.getElementById('vehicle-odometer').value = vehicle ? vehicle.odometer : '';
        document.getElementById('vehicle-acquisition-cost').value = vehicle ? vehicle.acquisitionCost : '';

        // Disable/enable inputs
        const formInputs = document.querySelectorAll('#vehicle-form input, #vehicle-form select');
        formInputs.forEach(input => {
            input.disabled = viewOnly;
        });

        // Show Modal
        const myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('vehicleFormModal'));
        myModal.show();
    }

    function openDeleteConfirm(id) {
        pendingDeleteId = id;
        const myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('vehicleDeleteModal'));
        myModal.show();
    }

    async function handleDelete() {
        if (!pendingDeleteId) return;
        try {
            await api.vehicles.delete(pendingDeleteId);
            pendingDeleteId = null;
            bootstrap.Modal.getInstance(document.getElementById('vehicleDeleteModal')).hide();
            loadVehicles();
        } catch (err) {
            alert(err.message);
        }
    }

    function init() {
        loadVehicles();

        // Register Button click
        const regBtn = document.querySelector('[data-vehicle-create-button]');
        if (regBtn) {
            regBtn.onclick = () => openFormModal('create');
        }

        // Apply filters
        document.getElementById('apply-filters-btn').onclick = () => {
            vehicleRegistryData.filters.type = document.getElementById('filter-type').value;
            vehicleRegistryData.filters.status = document.getElementById('filter-status').value;
            vehicleRegistryData.searchTerm = document.getElementById('filter-search').value || '';
            vehicleRegistryData.currentPage = 1;
            loadVehicles();
        };

        // Reset filters
        const resetFilters = () => {
            document.getElementById('filter-type').value = 'all';
            document.getElementById('filter-status').value = 'all';
            document.getElementById('filter-search').value = '';
            vehicleRegistryData.filters = { type: 'all', status: 'all' };
            vehicleRegistryData.searchTerm = '';
            vehicleRegistryData.currentPage = 1;
            loadVehicles();
        };

        const resetBtn = document.getElementById('reset-filters-btn');
        if (resetBtn) resetBtn.onclick = resetFilters;

        const resetEmptyBtn = document.getElementById('reset-filters-btn-empty');
        if (resetEmptyBtn) resetEmptyBtn.onclick = resetFilters;

        // Search input text
        const searchInput = document.querySelector('[name="vehicle_registry_search"]');
        if (searchInput) {
            searchInput.oninput = (e) => {
                vehicleRegistryData.searchTerm = e.target.value || '';
                vehicleRegistryData.currentPage = 1;
                renderTable();
            };
        }

        // Save Form Submit
        const form = document.getElementById('vehicle-form');
        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                const errDiv = document.getElementById('vehicle-modal-error');
                errDiv.classList.add('d-none');

                const regNum = document.getElementById('vehicle-registration-number').value.trim();
                const name = document.getElementById('vehicle-name').value.trim();
                const type = document.getElementById('vehicle-type').value;
                const status = document.getElementById('vehicle-status').value;
                const capacity = parseFloat(document.getElementById('vehicle-capacity').value);
                const odometer = parseFloat(document.getElementById('vehicle-odometer').value);
                const acqCost = parseFloat(document.getElementById('vehicle-acquisition-cost').value);

                if (!regNum || !name || !type || isNaN(capacity) || isNaN(odometer) || isNaN(acqCost)) {
                    errDiv.textContent = 'Please fill out all fields with valid numbers.';
                    errDiv.classList.remove('d-none');
                    return;
                }

                const payload = {
                    registration_number: regNum,
                    name_model: name,
                    type: type,
                    max_load_capacity: capacity,
                    odometer: odometer,
                    acquisition_cost: acqCost,
                    status: status
                };

                try {
                    if (editingId) {
                        await api.vehicles.update(editingId, payload);
                    } else {
                        await api.vehicles.create(payload);
                    }
                    
                    bootstrap.Modal.getInstance(document.getElementById('vehicleFormModal')).hide();
                    loadVehicles();
                } catch (err) {
                    errDiv.textContent = err.message;
                    errDiv.classList.remove('d-none');
                }
            };
        }

        // Delete Confirm button
        document.getElementById('confirm-delete-btn').onclick = handleDelete;
    }

    document.addEventListener('DOMContentLoaded', init);
})();