import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';


function UserList() {
    const [users, setUsers] = useState([]);
    const { state } = useLocation();
    const { tok, id } = state;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/users?token=${tok}`);
            setUsers(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(error.response.data);
        }
    };

    return (
        <div>
            <center><h1>Friend List</h1></center>

            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <Link to='/chat' state={{ recevier: user.id, sender: id, token: tok }} >{user.username}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}


export default UserList
