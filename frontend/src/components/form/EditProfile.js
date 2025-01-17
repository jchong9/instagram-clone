import {useNavigate} from "react-router-dom";
import axios from "axios";
import {Form, Formik} from "formik";
import CustomInput from "../ui/CustomInput";
import CustomTextarea from "../ui/CustomTextarea";
import {editProfileSchema} from "../../schemas/editProfileSchema";
import {API} from "../../utils/constants";

export default function EditProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const apiURL = API.baseURL;

  async function updateUser(values, actions) {
    const { data } = await axios.patch(`${apiURL}/users/${user._id}`, {
      username: values.username ? values.username : user.username,
      bio: values.bio ? values.bio : user.bio
    });
    localStorage.setItem("user", JSON.stringify(data));
    actions.resetForm();
    navigate(`/profile/${user._id}`);
  }

  return (
    <div className="center-relative">
      <div className="w-50">
        <h1>Edit your profile</h1>
        <Formik
          initialValues={{
            username: '',
            bio: '',
          }}
          validationSchema={editProfileSchema}
          validateOnChange={false}
          onSubmit={updateUser}
        >
          {({isSubmitting}) => (
            <Form>
              <CustomInput
                label="Username"
                name="username"
                type="text"
                placeholder={user.username}
              />
              <CustomTextarea
                label="Description"
                name="bio"
                placeholder="Enter a description (optional)"
                rows={5}
              />
              <div className="d-flex justify-content-end align-items-center my-3">
                <button className="btn btn-outline-light mx-2"
                        onClick={() => navigate(`/profile/${user._id}`)}>
                  Close
                </button>
                <button className="btn btn-primary"
                        disabled={isSubmitting}
                        type="submit">
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
