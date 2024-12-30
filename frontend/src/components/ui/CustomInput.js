import {useField} from "formik";

export default function CustomInput({ label, ...props }) {
  const [field, meta] = useField(props);

  return (
    <div className="form-group my-2">
      <label>{label}</label>
      <input
        {...field}
        {...props}
        className={meta.touched && meta.error ? "form-control input-error" : "form-control"}
      />
      {meta.touched && meta.error && (
        <div className="error">{meta.error}</div>
      )}
    </div>
  );
}