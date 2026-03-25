import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://convode.onrender.com',
    withCredentials: true
});

// 1. Request Interceptor (Existing - attaches the Access Token)
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 2. Response Interceptor (New - handles the Silent Refresh)
axiosInstance.interceptors.response.use(
    (response) => {
        // If the request is successful, just return the response
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 and we haven't retried this specific request yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark as retrying to prevent infinite loops

            try {
                // Call your new refresh-token endpoint
                // Note: We use the base axios here, not axiosInstance, to avoid interceptor loops
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL || 'https://convode.onrender.com'}/users/refresh-token`, 
                    {}, 
                    { withCredentials: true }
                );

                const { accessToken } = response.data;

                // Update local storage with the new short-lived token
                localStorage.setItem('token', accessToken);

                // Update the header for the original failed request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // Retry the original request with the new token
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If refresh fails (e.g., refresh token expired too), log out the user
                console.error("Refresh token expired or invalid", refreshError);
                localStorage.removeItem('token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;