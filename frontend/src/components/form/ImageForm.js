import axios from "axios";
import {Form, Formik} from "formik";
import CustomInput from "../ui/CustomInput";
import {imageUploadSchema} from "../../schemas/imageUploadSchema";
import CustomTextarea from "../ui/CustomTextarea";

export default function ImageForm(props) {
  const user = JSON.parse(localStorage.getItem("user"));

  async function uploadImage(values, actions) {
    const formData = new FormData();
    formData.append("image", values.image);
    formData.append("caption", values.caption);
    formData.append("username", user.username);
    formData.append("userID", user._id);
    formData.append("createdAt", new Date().toLocaleDateString());

    await axios.post("http://localhost:5000/posts",
      formData, {
      headers: {"Content-Type": "multipart/form-data"},
    });

    actions.resetForm();
    props.onClose();
  }

  return (
    <Formik
      initialValues={{
        image: '',
        caption: '',
      }}
      validationSchema={imageUploadSchema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={uploadImage}
    >
      {({isSubmitting, setFieldValue}) => (
        <Form>
          <CustomInput
            label="Image"
            name="image"
            type="file"
            accept="image/*"
            value={undefined}
            onChange={(e) => {
              setFieldValue("image", e.target.files[0])
            }}
          />
          <CustomTextarea
            label="Caption"
            name="caption"
            type="text"
            placeholder="Enter a caption (optional)"
            rows={3}
          />
          <div className="d-flex justify-content-end align-items-center my-3">
            <button className="btn btn-outline-light mx-2" onClick={props.onClose}>
              Close
            </button>
            <button disabled={isSubmitting}
                    type="submit"
                    className="btn btn-primary">
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}