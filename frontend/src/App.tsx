import { CreateUser } from "./components/CreateUser";
import { Login } from "./components/Login";
import { Route, Routes } from "react-router-dom"

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={ <Login /> } />
        <Route path="/createUser" element={ <CreateUser /> } />
      </Routes>
    </>
  )
}