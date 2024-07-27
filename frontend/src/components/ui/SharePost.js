import {useState} from "react";
import axios from "axios";

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

  async function uploadImage(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);

    const result = await axios.post("http://localhost:5000/upload-image", formData, {
        headers: {"Content-Type": "multipart/form-data"},
    });

    adjustVisibility();
  }

  function onInputChange(e) {
    console.warn(e.target.files[0]);
    setImage(e.target.files[0]);
  }

  return (
    <>
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
              <input type="file" accept="image/*" onChange={onInputChange} />
              <br/>
              <input type="text" placeholder="Enter a description"/>
              <button type="button" onClick={adjustVisibility}>Close</button>
              <button type="submit">Upload</button>
          </form>
        </div>
      </div>
    </>
  );
}