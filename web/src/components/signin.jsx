import React from "react";
import "./style.css";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  //   const navigate = useNavigate();
  return (
    <>
      <fieldset className="feildSignin">
        <legend> SignIn</legend>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmpassword: "",
          }}
          onSubmit={(values) => {
            // navigate('/login')
          }}
        >
          <Form>
            <label htmlFor="firstName">First Name</label>
            <Field id="firstName" name="firstName" placeholder="Jane" />
            <br />
            <label htmlFor="lastName">Last Name</label>
            <Field id="lastName" name="lastName" placeholder="Doe" />
            <br />

            <label htmlFor="email">Email</label>
            <Field
              id="email"
              name="email"
              placeholder="jane@acme.com"
              type="email"
            />
            <br />
            <label htmlFor="password">Password</label>
            <Field
              id="password"
              name="password"
              placeholder="Password"
              type="password"
            />
            <br />
            <label htmlFor="password">Confirm Password</label>
            <Field
              id="Confirmpassword"
              name="confirmpassword"
              placeholder="Confirm"
              type="password"
            />
            <br />
            <button type="submit" className="signbtn">
              Submit
            </button>
          </Form>
        </Formik>
      </fieldset>
    </>
  );
};
export default SignIn;
