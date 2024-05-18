import { CreateUser } from "./components/CreateUser";
import { Login } from "./components/Login";
import { Route, Routes } from "react-router-dom"
import { Profile } from "./components/Profile";

export default function App() {
  return (
    <>
    <Routes>
        <Route path="/" element={ <Login /> } />
        <Route path="/createUser" element={ <CreateUser /> } />
        <Route path="/profile" element={ <Profile username="" /> } />
    </Routes>
    </>
  )
}