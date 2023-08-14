import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    let navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });
            setToken(response.data.token);
            console.log('Login successful');
            localStorage.setItem('token', response.data.token);
            navigate("/userList", { state: { tok: response.data.token, id: response.data.user_id } });

        } catch (error) {
            console.error(error.response.data);
        }
    };

    return (
        <div>
            <h1>User Login</h1>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}

export default Login
