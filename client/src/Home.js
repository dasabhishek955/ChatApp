import React from 'react';
import { useNavigate } from 'react-router-dom'


const Home = () => {
    let navigate = useNavigate();

    const FriendListClick = () => {
        navigate("/userList");
    };

    return (
        <>    {localStorage.getItem('token') ? <div>
            <center><div>
                <h1>Go to your FriendList To start the Chatting</h1>
            </div></center>
            <center><div>
                <button className="button-85 my-5 mx-5 btn-lg" onClick={FriendListClick}>FriendList</button>
            </div></center>
        </div> :
            <center><div>
                <h1> To use this chatting website you need to SignUp or Login</h1>
            </div></center>
        }
        </>
    )
}

export default Home

