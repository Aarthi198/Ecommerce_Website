const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003';
const AUTH_TOKEN_KEY = 'threads_trinkets_auth_token';

const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
};

export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

const fetcher = async (path: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || response.statusText || 'API request failed');
  }

  return data;
};

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
};

export const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

export const getProducts = () => fetcher('/api/products');
export const getProductById = (id: string) => fetcher(`/api/products/${id}`);

export const createProduct = (payload: {
  name: string;
  description: string;
  category: string;
  price: number;
  salePrice?: number;
  stock: number;
  images?: { url: string; alt: string }[];
}) =>
  fetcher('/api/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateProduct = (
  id: string,
  payload: {
    name: string;
    description: string;
    category: string;
    price: number;
    salePrice?: number;
    stock: number;
    images?: { url: string; alt: string }[];
  }
) =>
  fetcher(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const deleteProduct = (id: string) =>
  fetcher(`/api/products/${id}`, { method: 'DELETE' });

export const uploadProductImage = async (file: File): Promise<{ url: string; alt: string }> => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/api/admin/upload-image`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || 'Image upload failed');
  }

  return data;
};
export const submitContactMessage = (payload: { name: string; email: string; message: string }) =>
  fetcher('/api/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const submitOrder = (payload: {
  items: { product: string; quantity: number }[];
  shippingAddress: {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
}) =>
  fetcher('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const login = (payload: { email: string; password: string }) =>
  fetcher('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const loginAdmin = (payload: { email: string; password: string }) =>
  fetcher('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getAdminOrders = () => fetcher('/api/admin/orders');

export const updateAdminDeliveryStatus = (orderId: string, deliveryStatus: string) =>
  fetcher(`/api/admin/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ deliveryStatus }),
  });

export const getAdminStats = () => fetcher('/api/admin/stats');

export const register = (payload: { name: string; email: string; password: string }) =>
  fetcher('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getProfile = () => fetcher('/api/auth/profile');

export const getMyOrders = () => fetcher('/api/orders/my-orders');
