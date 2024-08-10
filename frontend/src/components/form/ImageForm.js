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
                onClick={props.onClose}>
          Close
        </button>
        <button type="submit" className="btn btn-primary">Upload</button>
      </div>
    </form>
  );
}