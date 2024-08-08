import {useState} from "react";
import axios from "axios";

export default function SharePost() {
  const [visibility, setVisibility] = useState('isNotVisible');
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

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
    formData.append("username", user.name);
    formData.append("userID", user._id);
    formData.append("caption", caption);

    const result = await axios.post("http://localhost:5000/upload-image", formData, {
        headers: {"Content-Type": "multipart/form-data"},
    });

    adjustVisibility();
  }

  function onInputChange(e) {
    setImage(e.target.files[0]);
  }

  return (
    <>
      <button className="btn btn-outline-primary btn-large"
              onClick={() => setVisibility("isVisible")}>
        + Add posts
      </button>
      <div className="modal-backdrop" id={visibility}></div>
      <div className="modal-container" id={visibility}>
        <div className="modal-header">
          <h4>Start sharing posts today</h4>
          <svg xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 384 512"
               onClick={() => setVisibility("isNotVisible")}>
            <path
              d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
          </svg>
        </div>
        <div className="modal-body">
          <form onSubmit={uploadImage}>
            <input type="file" accept="image/*" onChange={onInputChange}/>
            <br/>
            <input type="text"
                   placeholder="Enter a caption"
                   value={caption || ""}
                   onChange={e => setCaption(e.target.value)}
            />
            <br/>
            <div>
              <button className="btn btn-outline-primary"
                      onClick={() => setVisibility("isNotVisible")}>
                Close
              </button>
              <button type="submit" className="btn btn-primary">Upload</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}