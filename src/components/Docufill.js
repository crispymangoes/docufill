import React from "react";
import { useFormik } from "formik";
import { generateDocument } from "./GenerateDocument";

const formSchema = {
    first_name: "",
    last_name: "",
    phone: "",
    description: "Default"
};

export const Docufill = () => {
  const formik = useFormik({
    initialValues: formSchema,
    onSubmit: values => {
      //alert(JSON.stringify(values, null, 2));
      generateDocument(values);
    }
  });
  return (
    <div>
    <form onSubmit={formik.handleSubmit}>
    <label htmlFor="first_name">First Name</label>
      <input
        id="first_name"
        name="first_name"
        type="text"
        onChange={formik.handleChange}
        
      />

      <label htmlFor="last_name">Last Name</label>
      <input
        id="last_name"
        name="last_name"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.last_name}
      />

      <label htmlFor="phone">Phone</label>
      <input
        id="phone"
        name="phone"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.phone}
      />

      <label htmlFor="description">Description</label>
      <input
        id="description"
        name="description"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.description}
      />
      <button type="submit">Submit</button>
    </form>
    </div>
  );
};