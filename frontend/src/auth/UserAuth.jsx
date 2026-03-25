import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import axios from '../config/axios'

const UserAuth = ({ children }) => {
    const { user, setUser } = useContext(UserContext)
    const [ loading, setLoading ] = useState(true)
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
    // 1. Check if tokens are in the URL (Google Redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const refreshTokenFromUrl = urlParams.get('refreshToken');

    if (tokenFromUrl) {
        // Save to localStorage immediately
        localStorage.setItem('token', tokenFromUrl);
        if (refreshTokenFromUrl) {
            localStorage.setItem('refreshToken', refreshTokenFromUrl);
        }
        
        // Clean the URL so the token doesn't stay visible in the address bar
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 2. Now get the token (either existing or just saved)
    const currentToken = localStorage.getItem('token');

    if (user) {
        setLoading(false);
        return;
    }

    if (!currentToken) {
        setLoading(false);
        // Optional: navigate('/login') if you want to force login
        return;
    }

    // 3. Fetch the profile to get the actual name (username)
    axios.get('/users/profile')
        .then(res => {
            setUser(res.data.user); // This updates the Context with your name!
            setLoading(false);
        })
        .catch((err) => {
            console.error("Auth verification failed:", err);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            setLoading(false);
            navigate('/login');
        });

}, [ user, navigate, setUser ]); // Added dependencies

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="text-sm font-medium animate-pulse">Verifying Session...</p>
                </div>
            </div>
        )
    }

    return (
        <>{children}</>
    )
}

export default UserAuth