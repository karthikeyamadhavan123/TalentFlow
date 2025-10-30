import React, { useEffect } from 'react'

const Protected = ({ Component }: { Component: React.ReactNode }) => {
    useEffect(() => {
        const userType = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (userType?.role !== 'hr') {
            window.location.href = '/login'; // Redirect to login if not HR user
        }
    }, [])
    return (
        <div>
            {Component}
        </div>
    )
}

export default Protected
