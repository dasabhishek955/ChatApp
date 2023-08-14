import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'


function Chat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const location = useLocation();
    const user_id = location.state.sender
    const recevier_id = location.state.recevier
    const token = location.state.token
    let navigate = useNavigate();

    // Fetch previous conversations when the component mounts
    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        // Save the messages in LocalStorage whenever it changes
        localStorage.setItem('messages', JSON.stringify(messages));
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/messages/${recevier_id},${user_id}?token=${token}`);
            setMessages(response.data);
        } catch (error) {
            console.error(error.response.data);
        }
    };
    const handleBackToUserList = () => {
        // Navigate back to the UserList page
        navigate("/userList", { state: { tok: token, id: user_id } });
    };


    const sendMessage = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/send-message`, { token, content: newMessage, user_id, recevier_id }, {
                headers: { 'Content-Type': 'application/json' } // Set the Content-Type header to application/json
            });
            console.log(response.data);
            // Update the UI to display the newly sent message in real-time
            const newMessageData = { id: response.data.id, sender_id: user_id, content: newMessage, timestamp: new Date().toISOString() };
            setMessages([...messages, newMessageData]);

            // Add the new message to the LocalStorage
            localStorage.setItem('messages', JSON.stringify([...messages, newMessageData]));
        } catch (error) {
            console.error(error.response.data);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };


    return (
        <div>
            <center><h1>Chat</h1></center>
            <button onClick={handleBackToUserList}>Back to User List</button>
            <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
                {messages.map((message) => (
                    <div key={message.id} className={`message-container ${message.sender_id === user_id ? 'right' : 'left'}`}>
                        <p className="message-text">
                            {message.content}
                        </p>
                        <span className="message-timestamp">
                            {formatTime(message.timestamp)}
                        </span>
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input type="text" placeholder="Type your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                <button className="button-85 my-5 mx-5 btn-lg" onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default Chat;