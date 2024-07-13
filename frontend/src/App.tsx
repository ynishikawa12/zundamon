import { useState } from "react";
import { CreateUser } from "./components/CreateUser";
import { Login } from "./components/Login";
import { Profile } from "./components/Profile";
import { Route, Routes } from "react-router-dom"
import { Voice } from "./components/Voice";

export default function App() {
  const [loginedUserName, setLoginedUserName] = useState<string>("");

  return (
    <>
    <Routes>
        <Route path="/" element={ <Login setLoginedUserName={setLoginedUserName}/> } />
        <Route path="/createUser" element={ <CreateUser /> } />
        <Route path="/profile" element={ <Profile loginedUserName={loginedUserName} /> } />
        <Route path="/voices/:id" element={<Voice />} />
    </Routes>
    </>
  )
}