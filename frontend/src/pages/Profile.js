import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import EditProfile from "../components/ui/EditProfile";

export default function Profile() {
  const location = useLocation();
  const { userID } = location.state;
  const [user, setUser] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    let result = await axios.get("http://localhost:5000/get-user", {params: {_id: userID}})
    setUser(result.data);
  }

  return (
    <>
      <div className="container-fluid w-50 text-center">
        <h1>{user.name}</h1>
        <EditProfile />
        <p>{user.bio}</p>
      </div>
    </>
  );
}