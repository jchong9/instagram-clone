import {useState} from "react";

export default function SharePost() {
  const [visibility, setVisiblity] = useState('isNotVisible');

  function adjustVisibility() {
    if (visibility === "isVisible") {
      setVisiblity("isNotVisible");
    }
    else {
      setVisiblity("isVisible")
    }
  }

  return (
    <div>
      <button onClick={adjustVisibility}>
        Add posts
      </button>
      <div className={visibility}>
        <h4>MODAL</h4>
      </div>
    </div>
  );
}