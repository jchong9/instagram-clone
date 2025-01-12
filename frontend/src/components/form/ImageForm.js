import axios from "axios";
import {Form, Formik} from "formik";
import CustomInput from "../ui/CustomInput";
import {imageUploadSchema} from "../../schemas/imageUploadSchema";
import CustomTextarea from "../ui/CustomTextarea";
import {API} from "../../utils/constants";
import {useMutation, useQueryClient} from "@tanstack/react-query";

const apiURL = API.baseURL;

async function uploadPost(newPost) {
  const { data } = await axios.post(`${apiURL}/posts`, newPost, {
    headers: {"Content-Type": "multipart/form-data"},
  });
  return data;
}

export default function ImageForm({ onClose }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const queryClient = useQueryClient();

  const uploadPostMutation = useMutation({
    mutationFn: uploadPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  function handleUpload(values, { resetForm }) {
    const formData = new FormData();
    formData.append("image", values.image);
    formData.append("caption", values.caption);
    formData.append("username", user.username);
    formData.append("userID", user._id);
    formData.append("createdAt", new Date().toLocaleDateString());

    uploadPostMutation.mutate(formData, {
      onSuccess: () => {
        resetForm();
        onClose();
      }
    })
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
      onSubmit={handleUpload}
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
            <button className="btn btn-outline-light mx-2" onClick={onClose}>
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