import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";

export default function Profile() {
  const location = useLocation();
  const { userID } = location.state;
  const [user, setUser] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    let result = await fetch("http://localhost:5000/get-user", {
      method: 'post',
      body: JSON.stringify({_id: userID}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    result = await result.json();
    if (result) {
      setUser(JSON.parse(JSON.stringify(result)));
    }
    console.warn(JSON.parse(JSON.stringify(result)));
  }

  return (
    <div>
      <h1>{user.name}</h1>
    </div>
  );
}