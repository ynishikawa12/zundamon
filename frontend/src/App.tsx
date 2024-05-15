import { useState } from "react";
import { CreateUser } from "./components/CreateUser";
import { Login } from "./components/Login";
import { Profile } from "./components/Profile";

export default function App() {
  const [username, setUsername] = useState<string>("");
  return (
    <div>
      <Login setLoginedName={setUsername}/>
      <CreateUser />
      <Profile username={username}/>
    </div>
  )
}