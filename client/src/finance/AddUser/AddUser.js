import React, { useContext, useState } from "react";
import AlertContext from "../../contexts/alert/AlertContext";
import "./addUser.css";

const AddUser = () => {
  const { successful, unSuccessful } = useContext(AlertContext);
  const initialCreds = {
    name: "",
    username: "",
    password: "",
    email: "",
    cPassword: "",
    role: "-1",
  };
  const [creds, setCreds] = useState(initialCreds);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (creds.password !== creds.cPassword)
      return unSuccessful("Passwords didn't match!");
    if (creds.role === "-1")
      return unSuccessful("Please select valid user type.");
    creds.role = parseInt(creds.role);
    console.log(creds);
    const response = await fetch(
      `${process.env.REACT_APP_API_HOST}/api/admin/createuser`,
      {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("authToken"),
          "Content-type": "application/json",
        },
        body: JSON.stringify(creds),
      }
    );
    const json = await response.json();
    console.log(json);
    if (json.error) unSuccessful(json.error);
    else {
      successful(json.success);
      setCreds(initialCreds);
    }
  };

  const handleOnChange = async (e) => {
    const { name, value } = e.target;
    setCreds({ ...creds, [name]: value });
  };

  return (
    <div className="p-4">
      <div className="add-user">
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter username"
            value={creds.username}
            onChange={handleOnChange}
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email"
            value={creds.email}
            onChange={handleOnChange}
            required
          />

          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter name"
            value={creds.name}
            onChange={handleOnChange}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            value={creds.password}
            onChange={handleOnChange}
            required
          />
          <label htmlFor="confirmpassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmpassword"
            name="cPassword"
            placeholder="Confirm password"
            value={creds.cPassword}
            onChange={handleOnChange}
            required
          />

          <label htmlFor="userType">User Type:</label>
          <select
            id="userType"
            name="role"
            value={creds.role}
            required
            onChange={handleOnChange}
          >
            <option value="-1">Select user type</option>
            <option value="2">Admin</option>
            <option value="1">F&A User</option>
            <option value="0">Department</option>
          </select>
          <div className="container">
            <button className="btn btn-primary" type="submit">
              Submit{" "}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setCreds(initialCreds)}
            >
              Reset{" "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;