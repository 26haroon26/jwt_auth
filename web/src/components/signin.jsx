import React, { useState } from "react";
import "./style.css";
import axios from "axios";
let baseUrl = "";
if (window.location.href.split(":")[0] === "http") {
  baseUrl = "http://localhost:4000";
} else {
  baseUrl = "";
}
// https://crudmongodbpwa-production.up.railway.app
const SignIn = () => {
  const [result, setResult] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signupHandler = async (e) => {
    e.preventDefault();

    try {
      let response = await axios.post(`${baseUrl}/signup`, {
        firstName: name,
        lastName: name,
        email: email,
        password: password,
      });

      console.log("signup successful");
      setResult("signup successful");
    } catch (e) {
      console.log("e: ", e);
    }
  };

  return (
    <>
      <fieldset className="feildSignin">
        <legend> SignIn</legend>
        <p className="result">{result}</p>
        <form onSubmit={signupHandler}>
          <label htmlFor="firstName">First Name</label>

          <input
            type="text"
            id="firstName"
            name="name"
            placeholder="first name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <br />
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="name"
            placeholder="Last name"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <br />
          <label htmlFor="email">Email</label>

          <input
            type="email"
            id="email"
            name="username"
            autoComplete="username"
            placeholder="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <br />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="new-password"
            autoComplete="new-password"
            placeholder="confirm password"
          />
          <br />
          <button type="submit" className="signbtn">
            Signup
          </button>
        </form>
      </fieldset>
    </>
  );
};
export default SignIn;
