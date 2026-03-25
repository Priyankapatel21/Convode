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
        // If we already have a user in context, we're good
        if (user) {
            setLoading(false)
            return
        }

        // If there is no token at all, they must login
        if (!token) {
            setLoading(false);
            return
        }

        // If there is a token but no user state (e.g., after a page refresh),
        // try to fetch the profile using the token.
        // Our new Axios interceptor will handle refreshing if the token is expired!
        axios.get('/users/profile')
            .then(res => {
                setUser(res.data.user)
                setLoading(false)
            })
            .catch((err) => {
                console.error("Auth verification failed:", err)
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
                navigate('/login')
            })

    }, [user, token, navigate, setUser])

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