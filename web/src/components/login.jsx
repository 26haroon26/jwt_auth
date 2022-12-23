import "./style.css";
import { useState } from "react";
import axios from "axios";
let baseUrl = "";
if (window.location.href.split(":")[0] === "http") {
  baseUrl = "http://localhost:4000";
} else {
  baseUrl = "https://zany-gold-swordfish-tie.cyclic.app";
}
// https://crudmongodbpwa-production.up.railway.app
function Login() {
  const [result, setResult] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      let response = await axios.post(
        `${baseUrl}/login`,
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("login successful");
      setResult("login successful");
    } catch (e) {
      console.log("e: ", e);
    }
  };
  return (
    <div>
      <fieldset>
        <legend>Login</legend>
        <p className="result">{result}</p>
        <form onSubmit={loginHandler}>
          <input
            id="email"
            label="Email"
            type="email"
            placeholder="jane@acme.com"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            id="password"
            label="Password"
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button className="loginbtn" type="submit">
            Submit
          </button>
        
        </form>
      </fieldset>
    </div>
  );
}

export default Login;
