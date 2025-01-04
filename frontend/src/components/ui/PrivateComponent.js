import { Navigate, Outlet } from 'react-router-dom';
import SharePost from "./SharePost";

export default function PrivateComponent() {
  const auth = localStorage.getItem("user");
  return (
    <>
      {auth ? (
        <>
          <Outlet />
          <SharePost />
        </>
      ) : (
        <Navigate to={'/signup'} />
      )}
    </>
  );
}