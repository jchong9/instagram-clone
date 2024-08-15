import * as yup from "yup";
import axios from "axios";

export const imageUploadSchema =  yup.object().shape({
  image: yup.mixed()
    .required("Required")
    .test("image", "Image must not exceed 5MB", (value) => {
      if (value) {
        return value.size <= 5242880;
      }
      return true;
    }),
  caption: yup.string()
    .max(200, "Your caption must not exceed 200 characters"),
});