import React from "react";
import { useFormik } from "formik";
import { generateDocument } from "./GenerateDocument";
import { Container } from './Container';
import { response } from "./apiresponse"

const formSchema = {
    first_name: "Ryan",
    last_name: "Buxman",
    phone: "719-334-0415",
    description: "Default"
};

export const DynamicDocufill = () => {
  const formik = useFormik({
    initialValues: {},
    onSubmit: values => {
      //alert(JSON.stringify(values, null, 2));
      generateDocument(values);
    }
  });
  // This function would be a user uploads their saved config, then it populates the form for them.
  const handleReset = () => {
    formik.setValues(formSchema);
  }

  const downloadFile = ({ data, fileName, fileType }) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType })
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }
  
  const exportToJson = e => {
    e.preventDefault()
    downloadFile({
      data: JSON.stringify(formik.values),
      fileName: 'formData.json', // Could probs use some state to name this dynamically
      fileType: 'text/json',
    })
  }

  const uploadJson = e => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      console.log("e.target.result", e.target.result);
      formik.setValues(JSON.parse(e.target.result)); // JSON.parse takes it from a string to an object!
    };
  }

  return (
    <div>
    <form onSubmit={formik.handleSubmit}>
      <Container config={response} formik={formik} />
      <button type="submit">Submit</button>
    </form>
    <button onClick={handleReset}>Reset</button>
    <button onClick={exportToJson}>Export</button>
    <input type="file" onChange={uploadJson} />
    </div>
  );
};