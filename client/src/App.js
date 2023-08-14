import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './Home';
import Navbar from "./component/Navbar";
import Signup from "./component/Signup";
import Login from "./component/Login";
import Chat from "./component/Chat";
import UserList from "./component/UserList";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/chat" element={<Chat />} />
        <Route exact path="/userList" element={<UserList />} />
      </Routes>
    </Router>

  );
}

export default App;
