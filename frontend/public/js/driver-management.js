(function () {
    const api = window.TransitOpsAPI;

    let driverManagementData = {
        drivers: [],
        pageSize: 5,
        currentPage: 1,
        searchTerm: '',
        sort: {
            field: 'name',
            direction: 'asc'
        },
        filters: {
            category: 'all',
            status: 'all'
        }
    };

    let editingId = null;
    let viewOnly = false;
    let pendingDeleteId = null;

    const statusToneMap = {
        'available': 'success',
        'on trip': 'info',
        'off duty': 'warning',
        'suspended': 'danger',
        'expired': 'danger'
    };

    function getToneForStatus(status) {
        return statusToneMap[String(status || '').toLowerCase()] || 'info';
    }

    async function loadDrivers() {
        try {
            document.getElementById('driver-table-body').innerHTML = `
                <tr data-loading-row>
                    <td colspan="8" class="text-center py-4 text-app-muted">
                        <div class="spinner-border spinner-border-sm text-light me-2" role="status"></div>
                        Fetching driver profiles...
                    </td>
                </tr>
            `;

            // Fetch drivers from API
            const apiDrivers = await api.drivers.list();
            
            // Map API structure to UI properties
            driverManagementData.drivers = apiDrivers.map(d => ({
                id: d.id,
                user_id: d.user_id,
                name: d.name,
                licenseNumber: d.license_number,
                licenseCategory: d.license_category,
                licenseExpiryDate: d.license_expiry_date,
                contactNumber: d.contact_number,
                safetyScore: d.safety_score,
                status: d.status
            }));

            renderSummary();
            renderTable();
        } catch (err) {
            console.error('Error loading drivers:', err);
        }
    }

    function renderSummary() {
        const drivers = driverManagementData.drivers;
        const total = drivers.length;
        const available = drivers.filter(d => d.status === 'Available').length;
        const onTrip = drivers.filter(d => d.status === 'On Trip').length;
        const suspended = drivers.filter(d => d.status === 'Suspended').length;

        // Populate summary metrics cards
        const totalCard = document.querySelector('[data-summary-card="total"] [data-summary-value]');
        if (totalCard) totalCard.textContent = total;

        const availCard = document.querySelector('[data-summary-card="available"] [data-summary-value]');
        if (availCard) availCard.textContent = available;

        const tripCard = document.querySelector('[data-summary-card="onTrip"] [data-summary-value]');
        if (tripCard) tripCard.textContent = onTrip;

        const suspCard = document.querySelector('[data-summary-card="suspended"] [data-summary-value]');
        if (suspCard) suspCard.textContent = suspended;

        // Update count text
        const countLabel = document.getElementById('driver-count-label');
        if (countLabel) countLabel.textContent = `${total} drivers registered`;
    }

    function renderTable() {
        const tbody = document.getElementById('driver-table-body');
        const emptyState = document.querySelector('[data-driver-empty]');
        const filterEmptyState = document.querySelector('[data-driver-filter-empty]');
        const tableWrapper = document.getElementById('drivers-table-wrapper');
        const template = document.getElementById('driver-row-template');

        if (!tbody || !template) return;

        tbody.innerHTML = '';

        // Apply filters & search local logic
        let filtered = driverManagementData.drivers;

        // 1. Search term check
        if (driverManagementData.searchTerm) {
            const term = driverManagementData.searchTerm.toLowerCase();
            filtered = filtered.filter(d => 
                d.name.toLowerCase().includes(term) ||
                d.licenseNumber.toLowerCase().includes(term) ||
                d.contactNumber.includes(term)
            );
        }

        // 2. Category filter
        if (driverManagementData.filters.category && driverManagementData.filters.category !== 'all') {
            filtered = filtered.filter(d => d.licenseCategory === driverManagementData.filters.category);
        }

        // 3. Status filter
        if (driverManagementData.filters.status && driverManagementData.filters.status !== 'all') {
            filtered = filtered.filter(d => d.status === driverManagementData.filters.status);
        }

        // Apply Sorting
        const field = driverManagementData.sort.field;
        const dir = driverManagementData.sort.direction === 'asc' ? 1 : -1;
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
        const totalPages = Math.ceil(totalItems / driverManagementData.pageSize) || 1;
        
        if (driverManagementData.currentPage > totalPages) {
            driverManagementData.currentPage = totalPages;
        }

        const startIdx = (driverManagementData.currentPage - 1) * driverManagementData.pageSize;
        const endIdx = startIdx + driverManagementData.pageSize;
        const pageItems = filtered.slice(startIdx, endIdx);

        // Display state check
        if (driverManagementData.drivers.length === 0) {
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

        pageItems.forEach(driver => {
            const row = template.content.cloneNode(true);
            
            row.querySelector('[data-field="name"]').textContent = driver.name;
            row.querySelector('[data-field="licenseNumber"]').textContent = driver.licenseNumber;
            row.querySelector('[data-field="licenseCategory"]').textContent = driver.licenseCategory;
            row.querySelector('[data-field="licenseExpiryDate"]').textContent = driver.licenseExpiryDate;
            row.querySelector('[data-field="safetyScore"]').textContent = `${driver.safetyScore}%`;
            row.querySelector('[data-field="contactNumber"]').textContent = driver.contactNumber;
            
            const badge = row.querySelector('[data-status-badge]');
            if (badge) {
                badge.className = `badge bg-${getToneForStatus(driver.status)}`;
                badge.textContent = driver.status;
            }

            // Bind actions
            row.querySelector('[data-driver-action="view"]').onclick = () => openFormModal('view', driver);
            row.querySelector('[data-driver-action="edit"]').onclick = () => openFormModal('edit', driver);
            row.querySelector('[data-driver-action="delete"]').onclick = () => openDeleteConfirm(driver.id);

            tbody.appendChild(row);
        });

        // Update Page Info
        const pageInfo = document.getElementById('driver-page-info');
        if (pageInfo) pageInfo.textContent = `Page ${driverManagementData.currentPage} of ${totalPages}`;

        const pageSummary = document.getElementById('driver-page-summary');
        if (pageSummary) {
            const showingStart = totalItems === 0 ? 0 : startIdx + 1;
            const showingEnd = Math.min(endIdx, totalItems);
            pageSummary.textContent = `Showing ${showingStart} to ${showingEnd} of ${totalItems} drivers`;
        }

        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        const pagList = document.getElementById('driver-pagination-list');
        if (!pagList) return;

        pagList.innerHTML = '';

        // Previous button
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${driverManagementData.currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `<button type="button" class="page-link" aria-label="Previous"><i class="bi bi-chevron-left"></i></button>`;
        if (driverManagementData.currentPage > 1) {
            prevLi.onclick = () => { driverManagementData.currentPage--; renderTable(); };
        }
        pagList.appendChild(prevLi);

        // Pages
        for (let i = 1; i <= totalPages; i++) {
            const pageLi = document.createElement('li');
            pageLi.className = `page-item ${driverManagementData.currentPage === i ? 'active' : ''}`;
            pageLi.innerHTML = `<button type="button" class="page-link">${i}</button>`;
            pageLi.onclick = () => { driverManagementData.currentPage = i; renderTable(); };
            pagList.appendChild(pageLi);
        }

        // Next button
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${driverManagementData.currentPage === totalPages ? 'disabled' : ''}`;
        nextLi.innerHTML = `<button type="button" class="page-link" aria-label="Next"><i class="bi bi-chevron-right"></i></button>`;
        if (driverManagementData.currentPage < totalPages) {
            nextLi.onclick = () => { driverManagementData.currentPage++; renderTable(); };
        }
        pagList.appendChild(nextLi);
    }

    function openFormModal(mode, driver = null) {
        editingId = driver ? driver.id : null;
        viewOnly = mode === 'view';

        const title = document.getElementById('driver-modal-title');
        const submitBtn = document.getElementById('save-driver-btn');
        const errDiv = document.getElementById('driver-modal-error');

        if (errDiv) errDiv.classList.add('d-none');

        if (title) title.textContent = mode === 'create' ? 'Register Driver' : mode === 'edit' ? 'Edit Driver Profile' : 'Driver Specifications';
        if (submitBtn) {
            submitBtn.textContent = mode === 'create' ? 'Register Driver' : 'Save Profile';
            submitBtn.classList.toggle('d-none', viewOnly);
        }

        // Populate fields
        document.getElementById('driver-id').value = editingId || '';
        document.getElementById('driver-name').value = driver ? driver.name : '';
        document.getElementById('driver-license-number').value = driver ? driver.licenseNumber : '';
        document.getElementById('driver-license-category').value = driver ? driver.licenseCategory : '';
        document.getElementById('driver-status').value = driver ? driver.status : 'Available';
        document.getElementById('driver-license-expiry-date').value = driver ? driver.licenseExpiryDate : '';
        document.getElementById('driver-contact-number').value = driver ? driver.contactNumber : '';
        document.getElementById('driver-safety-score').value = driver ? driver.safetyScore : '100';

        // Disable/enable inputs
        const formInputs = document.querySelectorAll('#driver-form input, #driver-form select');
        formInputs.forEach(input => {
            input.disabled = viewOnly;
        });

        // Show Modal
        const myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('driverFormModal'));
        myModal.show();
    }

    function openDeleteConfirm(id) {
        pendingDeleteId = id;
        const myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('driverDeleteModal'));
        myModal.show();
    }

    async function handleDelete() {
        if (!pendingDeleteId) return;
        try {
            await api.drivers.delete(pendingDeleteId);
            pendingDeleteId = null;
            bootstrap.Modal.getInstance(document.getElementById('driverDeleteModal')).hide();
            loadDrivers();
        } catch (err) {
            alert(err.message);
        }
    }

    function init() {
        loadDrivers();

        // Create Button click
        const regBtn = document.querySelector('[data-driver-create-button]');
        if (regBtn) {
            regBtn.onclick = () => openFormModal('create');
        }

        // Apply filters
        document.getElementById('apply-filters-btn').onclick = () => {
            driverManagementData.filters.category = document.getElementById('filter-category').value;
            driverManagementData.filters.status = document.getElementById('filter-status').value;
            driverManagementData.searchTerm = document.getElementById('filter-search').value || '';
            driverManagementData.currentPage = 1;
            renderTable();
        };

        // Reset filters
        const resetFilters = () => {
            document.getElementById('filter-category').value = 'all';
            document.getElementById('filter-status').value = 'all';
            document.getElementById('filter-search').value = '';
            driverManagementData.filters = { category: 'all', status: 'all' };
            driverManagementData.searchTerm = '';
            driverManagementData.currentPage = 1;
            renderTable();
        };

        const resetBtn = document.getElementById('reset-filters-btn');
        if (resetBtn) resetBtn.onclick = resetFilters;

        // Search input text
        const searchInput = document.querySelector('[name="driver_management_search"]');
        if (searchInput) {
            searchInput.oninput = (e) => {
                driverManagementData.searchTerm = e.target.value || '';
                driverManagementData.currentPage = 1;
                renderTable();
            };
        }

        // Save Form Submit
        const form = document.getElementById('driver-form');
        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                const errDiv = document.getElementById('driver-modal-error');
                errDiv.classList.add('d-none');

                const name = document.getElementById('driver-name').value.trim();
                const licNum = document.getElementById('driver-license-number').value.trim();
                const licCat = document.getElementById('driver-license-category').value;
                const status = document.getElementById('driver-status').value;
                const expiry = document.getElementById('driver-license-expiry-date').value;
                const contact = document.getElementById('driver-contact-number').value.trim();
                const score = parseFloat(document.getElementById('driver-safety-score').value);

                if (!name || !licNum || !licCat || !status || !expiry || !contact || isNaN(score)) {
                    errDiv.textContent = 'Please fill out all fields with valid data.';
                    errDiv.classList.remove('d-none');
                    return;
                }

                const payload = {
                    name: name,
                    license_number: licNum,
                    license_category: licCat,
                    license_expiry_date: expiry,
                    contact_number: contact,
                    safety_score: score,
                    status: status
                };

                try {
                    if (editingId) {
                        await api.drivers.update(editingId, payload);
                    } else {
                        await api.drivers.create(payload);
                    }
                    
                    bootstrap.Modal.getInstance(document.getElementById('driverFormModal')).hide();
                    loadDrivers();
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