import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { backendUrl } from "./utils";
// import "./styles.css"
function SignUpForm() {
  const [state, setState] = React.useState({
    firstName: "",
    lastName:"",
    email: "",
    password: "",
    password2: ""
  });
  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = async evt => {
    evt.preventDefault();

    const { firstName,lastName, email, password, password2 } = state;
    if(password !== password2){
      toast.error("Password does not match!");
      return;
    }

    try{
      const res = await axios.post(backendUrl+"iam/register/",{
        "first_name": firstName,
        "last_name": lastName,
        email,
        password
      });
      console.log(res?.data)
      toast.success(res?.data)
    }catch(error){
      toast.error(error?.response?.data)
    }
      setState({
        firstName: "",
    lastName:"",
    email: "",
    password: "",
    password2: ""
      });
  };

  return (
    <div className="container">
      <div className="form-wrap">
        <h1>Sign Up</h1>
        <form onSubmit={handleOnSubmit}>
          <div className="form-group">
            <label htmlFor="first-name">First Name</label>
            <input value={state.firstName} onChange={handleChange} type="text" name="firstName" id="first-name" />
          </div>
          <div className="form-group">
            <label htmlFor="last-name">Last Name</label>
            <input value={state.lastName} onChange={handleChange} type="text" name="lastName" id="last-name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input value={state.email} onChange={handleChange} type="email" name="email" id="email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input value={state.password} onChange={handleChange} type="password" name="password" id="password" />
          </div>
          <div className="form-group">
            <label for="password2">Confirm Password</label>
            <input value={state.password2} onChange={handleChange} type="password" name="password2" id="password2" />
          </div>
          <button type="submit" class="btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;
