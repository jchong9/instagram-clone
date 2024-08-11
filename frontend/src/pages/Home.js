import DisplayPost from "../components/ui/DisplayPost";

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <DisplayPost requestURL="get-image" id={user._id} search="" />
    </>
  );
}