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

    const result = await axios.post("http://localhost:5000/upload-image",
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
            onChange={(e) => {setFieldValue("image", e.target.files[0])}}
          />
          <CustomTextarea
            label="Caption"
            name="caption"
            type="text"
            placeholder="Enter a caption (optional)"
            rows={3}
          />
          <button disabled={isSubmitting}
                  type="submit"
                  className="btn btn-primary form-control my-2 w-50">
            Submit
          </button>
          <button className="btn btn-outline-light form-control my-2 w-50" onClick={props.onClose}>
            Close
          </button>
        </Form>
      )}
    </Formik>
  );
}