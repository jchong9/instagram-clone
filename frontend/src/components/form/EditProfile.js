import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {Form, Formik} from "formik";
import CustomInput from "../ui/CustomInput";
import CustomTextarea from "../ui/CustomTextarea";
import {editProfileSchema} from "../../schemas/editProfileSchema";

export default function EditProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  async function updateUser(values, actions) {
    const result = await axios.patch("http://localhost:5000/update-user", {
      username: values.username ? values.username : user.username,
      bio: values.bio ? values.bio : user.bio
    }, {
      params: {id: user._id}
    });
    localStorage.setItem("user", JSON.stringify(result.data));
    actions.resetForm();
    navigate("/profile", {state: {userID: user._id}});
  }

  return (
    <div className="center">
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
            <button disabled={isSubmitting} type="submit" className="btn btn-primary form-control w-50 my-2">Submit</button>
            <button className="btn btn-outline-light form-control w-50"
                    onClick={() => navigate("/profile", {state: {userID: user._id}})}>
              Close
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
