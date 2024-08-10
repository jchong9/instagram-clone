import DisplayPost from "../components/ui/DisplayPost";

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <h1>Homepage</h1>
      <DisplayPost requestURL="get-image" id={user._id} search="" />
    </>
  );
}