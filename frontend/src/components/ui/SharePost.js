import {useState} from "react";

export default function SharePost() {
  const [visibility, setVisibility] = useState('isNotVisible');
  const [image, setImage] = useState(null);
  const user = localStorage.getItem("user");

  function adjustVisibility() {
    if (visibility === "isVisible") {
      setVisibility("isNotVisible");
    }
    else {
      setVisibility("isVisible")
    }
  }

  function uploadImage(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);
  }

  return (
    <div>
      <button onClick={adjustVisibility}>
        Add posts
      </button>
      <div className="modal-backdrop" id={visibility}></div>
      <div className="modal-container" id={visibility}>
        <div className="modal-header">
          <h4>Start sharing your memories today</h4>
        </div>
        <div className="modal-body">
          <form onSubmit={uploadImage}>
            <input type="file" accept="image/*"/>
            <br/>
            <input type="text" placeholder="Enter a description"/>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" onClick={adjustVisibility}>Close</button>
          <button type="submit">Upload</button>
        </div>
      </div>
    </div>
  );
}