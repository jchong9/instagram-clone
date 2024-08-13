import axios from "axios";
import {useState} from "react";

export default function ImageForm(props) {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

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

    props.onClose();
  }

  function onInputChange(e) {
    setImage(e.target.files[0]);
  }

  return (
    <form onSubmit={uploadImage}>
      <div className="form-group">
        <label>Enter a file: </label>
        <br/>
        <input type="file"
               accept="image/*"
               className="form-control-file"
               onChange={onInputChange}/>
      </div>
      <div className="form-group my-3">
        <label>Caption: </label>
        <textarea
               placeholder="Enter a caption"
               className="form-control"
               value={caption || ""}
               rows="3"
               onChange={e => setCaption(e.target.value)}>
        </textarea>
      </div>
      <div>
        <button type="submit" className="btn btn-primary me-2">Upload</button>
        <button className="btn btn-outline-light" onClick={props.onClose}>
          Close
        </button>
      </div>
    </form>
  );
}