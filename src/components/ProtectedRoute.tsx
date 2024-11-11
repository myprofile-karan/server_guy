import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ component }: { component: React.ReactNode }) => {
    const navigate = useNavigate();

    useEffect(() => {
        async function checkUser() {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user) {
                navigate('/login')
            }
        }
        checkUser();
    });



    return (
        <>
            {component}
        </>
    )
}

export default ProtectedRoute
