import React, { useContext, useState} from "react";
import AlertContext from "../../contexts/alert/AlertContext";
// import SelectedUserContext from "../../contexts/select/SelectedUserContext";
import "./updateProfile.css";

const UpdateProfile = ({ props }) => {
  const { update, setUsers, users, setUpdate } = props;
  const user = update;
  console.log(user);
  const { successful, unSuccessful } = useContext(AlertContext);
  // const { SelectedUser } = useContext(SelectedUserContext);

  const initialCreds = {
    name: user.name,
    username: user.username,
    password: "",
    cPassword: "",
  };

  const [creds, setCreds] = useState(initialCreds);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (creds.password !== creds.cPassword) {
      return unSuccessful("Passwords didn't match");
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_HOST}/api/admin/updateUser`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "auth-token": localStorage.getItem("authToken"),
        },
        body: JSON.stringify(creds),
      }
    );

    const json = await response.json();
    if (json.error) {
      unSuccessful(json.error);
    } else {
      successful(json.success);
      let { emp, dept, admin } = users;
      if (user.role === 1) {
        for (let i = 0; i < emp.length; i++)
          if (emp[i].username === user.username) emp[i].name = creds.name;
      } else if (user.role === 2) {
        for (let i = 0; i < admin.length; i++)
          if (admin[i].username === user.username) admin[i].name = creds.name;
      } else {
        for (let i = 0; i < dept.length; i++)
          if (dept[i].username === user.username) dept[i].name = creds.name;
      }
      setUsers({ emp, dept, admin });
      setUpdate(null);
    }
  };

  const handleOnChange = (e) => {
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
          disabled
        />

        <label htmlFor="name">Updated Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter name"
          value={creds.name}
          onChange={handleOnChange}
          required
        />

        <label htmlFor="password">New Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter password"
          value={creds.password}
          onChange={handleOnChange}
        />

        <label htmlFor="confirmpassword">Confirm New Password:</label>
        <input
          type="password"
          id="confirmpassword"
          name="cPassword"
          placeholder="Confirm password"
          value={creds.cPassword}
          onChange={handleOnChange}
        />

        <div className="container">
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
          <button
            className="btn btn-primary"
            type="reset"
            onClick={() => setCreds(initialCreds)}
          >
            Reset
          </button>
          <button
            className="btn btn-primary"
            type="reset"
            onClick={() => setUpdate(null)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    </div> 
  );
};

export default UpdateProfile;