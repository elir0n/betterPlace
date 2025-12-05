const API_URL = 'http://localhost:5000';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const api = {
    auth: {
        login: async (phone: string, password: string) => {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, password }),
            });
            if (!res.ok) throw new Error((await res.json()).error);
            const data = await res.json();
            localStorage.setItem('token', data.token);
            return data.user;
        },
        register: async (name: string, phone: string, password: string) => {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, password }),
            });
            if (!res.ok) throw new Error((await res.json()).error);
            return await res.json();
        },
        getProfile: async () => {
            const res = await fetch(`${API_URL}/auth/me`, {
                headers: getHeaders(),
            });
            if (!res.ok) throw new Error('Failed to fetch profile');
            return await res.json();
        }
    },
    tasks: {
        list: async (category?: string, lat?: number, lng?: number, radius?: number) => {
            const params = new URLSearchParams();
            if (category) params.append('category', category);
            if (lat && lng && radius) {
                params.append('lat', lat.toString());
                params.append('lng', lng.toString());
                params.append('radius', radius.toString());
            }
            const res = await fetch(`${API_URL}/tasks?${params}`, {
                headers: getHeaders(),
            });
            if (!res.ok) throw new Error('Failed to fetch tasks');
            return (await res.json()).data.tasks;
        },
        create: async (taskData: any) => {
            const res = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(taskData),
            });
            if (!res.ok) throw new Error((await res.json()).error);
            return (await res.json()).data;
        },
        getById: async (id: string) => {
            const res = await fetch(`${API_URL}/tasks/${id}`, {
                headers: getHeaders(),
            });
            if (!res.ok) throw new Error('Failed to fetch task');
            return (await res.json()).data;
        }
    },
    wallet: {
        getBalance: async () => {
            const res = await fetch(`${API_URL}/wallet/balance`, {
                headers: getHeaders(),
            });
            if (!res.ok) throw new Error('Failed to fetch balance');
            return (await res.json()).data;
        }
    }
};
