import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import "./style.css";
import { useNavigate } from "react-router-dom";


const validationSchema = yup.object({
  email: yup
    .string("Enter your email")

    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const WithMaterialUI = () => {
    const navigate = useNavigate();

    const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
        console.log(values);
            navigate('/dashboard')
    },
  });

//   let handleSubmit = ()=>{
        //     navigate('/dashboard')

//   }
  return (
    <div>
      <fieldset>
        <legend>Login</legend>
        <form onSubmit={formik.handleSubmit}>
          <input
            id="email"
            label="Email"
            placeholder="jane@acme.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            
          />
          <input
            id="password"
            label="Password"
            type="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            
          />
           <button className="loginbtn" type="submit">
            Submit
          </button>
          {/* <button className="loginbtn" variant="contained"  onClick={handleSubmit}>
            Submit
          </button> */}
        </form>
      </fieldset>
    </div>
  );
};
export default WithMaterialUI;