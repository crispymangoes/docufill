import React from "react";
import { useFormik } from "formik";
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import { saveAs } from 'file-saver';

const formSchema = {
    first_name: "",
    last_name: "",
    phone: "",
    description: ""
};

function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
  }

const generateDocument = (form) => {
    loadFile(
      'https://docxtemplater.com/tag-example.docx',
      function (error, content) {
        if (error) {
          throw error;
        }
        var zip = new PizZip(content);
        var doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
          //Think I can add a delimeters object here to specifiy the  delimiters
        });
        doc.setData(form);
        try {
          // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
          doc.render();
        } catch (error) {
          // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
          function replaceErrors(key, value) {
            if (value instanceof Error) {
              return Object.getOwnPropertyNames(value).reduce(function (
                error,
                key
              ) {
                error[key] = value[key];
                return error;
              },
              {});
            }
            return value;
          }
          console.log(JSON.stringify({ error: error }, replaceErrors));

          if (error.properties && error.properties.errors instanceof Array) {
            const errorMessages = error.properties.errors
              .map(function (error) {
                return error.properties.explanation;
              })
              .join('\n');
            console.log('errorMessages', errorMessages);
            // errorMessages is a humanly readable message looking like this :
            // 'The tag beginning with "foobar" is unopened'
          }
          throw error;
        }
        var out = doc.getZip().generate({
          type: 'blob',
          mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        }); //Output the document using Data-URI
        saveAs(out, 'output.docx');
      }
    );
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
    <form onSubmit={formik.handleSubmit}>
    <label htmlFor="first_name">First Name</label>
      <input
        id="first_name"
        name="first_name"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.first_name}
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
  );
};