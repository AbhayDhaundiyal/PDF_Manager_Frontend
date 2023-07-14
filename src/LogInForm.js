import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
// import "./styles.css"
function LogInForm(props) {
  const [state, setState] = React.useState({
    email: "",
    password: ""
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

    const { email, password } = state;
    const obj = {"email": email,"password":  password}
    try{
    const res =  await axios.post(process.env.REACT_APP_BACKEND + "iam/login/", obj)
    props?.setUser(res?.data)
    }catch(err){
      console.log(err);
      toast.error(err?.response?.data);
    }
    
    for (const key in state) {
      setState({
        ...state,
        [key]: ""
      });
    }
  };

  return (
    <div className="container">
        <div class="form-wrap">
            <h1>Log in</h1>
            <form onSubmit={handleOnSubmit}>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input value={state.email} onChange={handleChange} type="email" name="email" id="email" />
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input value={state.password} onChange={handleChange}  type="password" name="password" id="password" />
                </div>
                <button>Sign In</button>
            </form>
        </div>
    </div>
  );
}

export default LogInForm;
