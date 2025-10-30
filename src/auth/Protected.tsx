import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Protected = ({ Component }: { Component: React.ReactNode }) => {
   const navigate = useNavigate()
    useEffect(() => {
        const userType = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (userType?.role !== 'hr') {
           navigate('/login');
        }
    }, [])
    return (
        <div>
            {Component}
        </div>
    )
}

export default Protected
