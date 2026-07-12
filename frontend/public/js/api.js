(function () {
    const API_BASE_URL = ''; // Same port hosting

    function getToken() {
        return localStorage.getItem('access_token');
    }

    function getUser() {
        const userStr = localStorage.getItem('user');
        try {
            return userStr ? JSON.parse(userStr) : null;
        } catch (e) {
            return null;
        }
    }

    function checkAuth() {
        const token = getToken();
        const user = getUser();
        const path = window.location.pathname;

        if (!token && !path.includes('login.html')) {
            window.location.href = 'login.html';
            return null;
        }

        // Initialize User Topbar fields on DOMContentLoaded
        document.addEventListener('DOMContentLoaded', function () {
            if (user) {
                // Populate displayName
                const displayNameNode = document.querySelector('.app-user-name');
                if (displayNameNode) {
                    displayNameNode.textContent = user.email.split('@')[0];
                }

                // Populate roleName
                const roleNode = document.querySelector('.app-user-role');
                if (roleNode) {
                    roleNode.textContent = user.role || 'Operator';
                }

                // Avatar initials
                const avatarNode = document.querySelector('.app-user-avatar');
                if (avatarNode) {
                    const initials = user.email.split('@')[0].slice(0, 2).toUpperCase();
                    avatarNode.textContent = initials || 'TO';
                }

                // Logout button listener
                const logoutBtns = document.querySelectorAll('[href="#logout"], .dropdown-item[href="#"]');
                logoutBtns.forEach(btn => {
                    if (btn.textContent.includes('Logout') || btn.querySelector('.bi-box-arrow-right')) {
                        btn.addEventListener('click', function (e) {
                            e.preventDefault();
                            logout();
                        });
                    }
                });
            }
        });

        return user;
    }

    function logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }

    async function request(endpoint, options = {}) {
        const token = getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (response.status === 401 && !window.location.pathname.includes('login.html')) {
            logout();
            throw new Error('Session expired. Redirecting to login.');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Request failed.' }));
            throw new Error(errorData.detail || 'An API error occurred.');
        }

        return response.json();
    }

    const api = {
        checkAuth,
        logout,
        auth: {
            login: (email, password) => request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            }),
            register: (email, password, role) => request('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, password, role })
            })
        },
        vehicles: {
            list: (filters = {}) => {
                const params = new URLSearchParams();
                if (filters.status && filters.status !== 'all') params.append('status', filters.status);
                if (filters.type && filters.type !== 'all') params.append('type', filters.type);
                const queryStr = params.toString() ? `?${params.toString()}` : '';
                return request(`/vehicles/${queryStr}`);
            },
            create: (data) => request('/vehicles/', {
                method: 'POST',
                body: JSON.stringify(data)
            }),
            update: (id, data) => request(`/vehicles/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            }),
            delete: (id) => request(`/vehicles/${id}`, {
                method: 'DELETE'
            }),
            getOperationalCosts: (id) => request(`/expenses/vehicle/${id}/total`)
        },
        drivers: {
            list: (filters = {}) => {
                const params = new URLSearchParams();
                if (filters.status && filters.status !== 'all') params.append('status', filters.status);
                const queryStr = params.toString() ? `?${params.toString()}` : '';
                return request(`/drivers/${queryStr}`);
            },
            create: (data) => request('/drivers/', {
                method: 'POST',
                body: JSON.stringify(data)
            }),
            update: (id, data) => request(`/drivers/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            }),
            delete: (id) => request(`/drivers/${id}`, {
                method: 'DELETE'
            })
        },
        trips: {
            list: (status = null) => {
                const query = status ? `?status=${status}` : '';
                return request(`/trips/${query}`);
            },
            create: (data) => request('/trips/', {
                method: 'POST',
                body: JSON.stringify(data)
            }),
            dispatch: (id) => request(`/trips/${id}/dispatch`, {
                method: 'POST'
            }),
            complete: (id, finalOdometer = null, fuelConsumed = null, fuelCost = null) => {
                const params = new URLSearchParams();
                if (finalOdometer !== null) params.append('final_odometer', finalOdometer);
                if (fuelConsumed !== null) params.append('fuel_consumed', fuelConsumed);
                if (fuelCost !== null) params.append('fuel_cost', fuelCost);
                const queryStr = params.toString() ? `?${params.toString()}` : '';
                return request(`/trips/${id}/complete${queryStr}`, {
                    method: 'POST'
                });
            },
            cancel: (id) => request(`/trips/${id}/cancel`, {
                method: 'POST'
            })
        },
        maintenance: {
            list: () => request('/maintenance/'),
            create: (data) => request('/maintenance/', {
                method: 'POST',
                body: JSON.stringify(data)
            }),
            close: (id, cost = null, endDate = null) => {
                const params = new URLSearchParams();
                if (cost !== null) params.append('cost', cost);
                if (endDate !== null) params.append('end_date', endDate);
                const queryStr = params.toString() ? `?${params.toString()}` : '';
                return request(`/maintenance/${id}/close${queryStr}`, {
                    method: 'POST'
                });
            }
        },
        expenses: {
            list: () => request('/expenses/'),
            create: (data) => request('/expenses/', {
                method: 'POST',
                body: JSON.stringify(data)
            }),
            listFuel: () => request('/expenses/fuel'),
            createFuel: (data) => request('/expenses/fuel', {
                method: 'POST',
                body: JSON.stringify(data)
            })
        },
        analytics: {
            getDashboard: (filters = {}) => {
                const params = new URLSearchParams();
                if (filters.type && filters.type !== 'all') params.append('vehicle_type', filters.type);
                if (filters.status && filters.status !== 'all') params.append('status', filters.status);
                if (filters.region && filters.region !== 'all') params.append('region', filters.region);
                const queryStr = params.toString() ? `?${params.toString()}` : '';
                return request(`/analytics/dashboard${queryStr}`);
            },
            getReports: () => request('/analytics/reports')
        }
    };

    window.TransitOpsAPI = api;
})();
