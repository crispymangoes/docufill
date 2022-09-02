import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { generateDocument } from "./GenerateDocument";
import { Container } from './Container';
import { get } from "./fetch";

//Think the initial value for the form needs to be passed in via props... cuz I can't set up formik in the useEffect
export const DynamicDocufill = () => {

  // Stores data used to generate form, must be called by API
  const [data, setData] = useState({});

  const [response, setResponse] = useState(null);
  useEffect(() => {
    async function fetchData() {
      get().then((res) => setResponse(res.data));
    }
    fetchData();
},[]);
  
  useEffect(() => {
    // Format api response
    //const result = JSON.parse(response);
    if (response) {
    for (const field of response) {
      setData((prev) => ({
        ...prev,
        [field['field']]: ""
      }));
    }
  }
  }, [response]);
  
  const formik = useFormik({
    initialValues: {},
    onSubmit: values => {
      //alert(JSON.stringify(values, null, 2));
      generateDocument(values);
    }
  });

  const handleReset = () => {
    formik.setValues(data);
  }

  //TODO rename data so it is different from the global one
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

  // Would be cool to parse through json and see if any key values match, what we need, pull them out of the json.
  // that way people can take similair config files and use them to populate  some of the shared fields!
  const uploadJson = e => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      console.log("e.target.result", e.target.result);
      formik.setValues(JSON.parse(e.target.result)); // JSON.parse takes it from a string to an object!
    };
  }

  if (!response) return <div>Loading...</div>;

  return (
    <div>
    <form onSubmit={formik.handleSubmit}>
      <Container config={response} formik={formik} />
      <button type="submit">Submit</button>
    </form>
    <button onClick={handleReset}>Reset</button>
    <button onClick={exportToJson}>Save Fields</button>
    <input type="file" onChange={uploadJson} />
    </div>
  );
};