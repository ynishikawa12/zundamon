import { useState } from "react";
import { CreateUser } from "./components/CreateUser";
import { Login } from "./components/Login";
import { Profile } from "./components/Profile";
import { Route, Routes } from "react-router-dom"
import { Voice } from "./components/Voice";

export default function App() {
  const [loginedUserId, setLoginedUserId] = useState<number>(null);

  return (
    <>
    <Routes>
        <Route path="/" element={ <Login setLoginedUserId={setLoginedUserId}/> } />
        <Route path="/createUser" element={ <CreateUser /> } />
        <Route path="/profile" element={ <Profile loginedUserId={loginedUserId} /> } />
        <Route path="/voices/:id" element={<Voice />} />
    </Routes>
    </>
  )
}