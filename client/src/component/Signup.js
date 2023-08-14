import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    let navigate = useNavigate();
    const handleSignup = async () => {
        try {
            const response = await axios.post('http://localhost:5000/signup', { username, password, email });
            console.log(response.data);
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div>
            <center><h1>User Signup</h1></center>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button onClick={handleSignup}>Sign Up</button>
        </div>
    )
}

export default Signup
