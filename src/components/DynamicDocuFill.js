import React from "react";
import { useFormik } from "formik";
import { generateDocument } from "./GenerateDocument";
import { Container } from './Container';
import { response } from "./apiresponse"

export const DynamicDocufill = () => {
  const formik = useFormik({
    initialValues: {},
    onSubmit: values => {
      //alert(JSON.stringify(values, null, 2));
      generateDocument(values);
    }
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <Container config={response} formik={formik} />
      <button type="submit">Submit</button>
    </form>
  );
};