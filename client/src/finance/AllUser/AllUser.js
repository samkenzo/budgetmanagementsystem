import React, { useContext, useEffect, useState } from "react";
import AlertContext from "../../contexts/alert/AlertContext";
import "./allUsers.css";
import UpdateProfile from "../UpdateProfile/UpdateProfile";

const AllUsers = () => {
  const { unSuccessful, successful } = useContext(AlertContext);
  const [users, setUsers] = useState({ dept: [], admin: [], emp: [] });
  const [update, setUpdate] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);
  const roleArr = ["Admin", "F&A Employee", "Department"];

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/user/allUsers`,
        {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem("authToken"),
          },
        }
      );
      const json = await response.json();
      console.log(json);
      if (json.error) unSuccessful(json.error);
      else {
        const { users } = json;
        let admin = [],
          emp = [],
          dept = [];
        for (let i = 0; i < users.length; i++)
          if (users[i].role == 2) admin.push(users[i]);
          else if (users[i].role == 1) emp.push(users[i]);
          else dept.push(users[i]);
        setUsers({ admin, dept, emp });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      unSuccessful("Error fetching user data");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const remUser = async (username) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/admin/removeUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("authToken"),
          },
          body: JSON.stringify({ username }),
        }
      );
      const json = await response.json();
      if (json.error) unSuccessful(json.error);
      else {
        successful(json.success);
        const admin = users.admin.filter((user) => user.username !== username);
        const emp = users.emp.filter((user) => user.username !== username);
        const dept = users.dept.filter((user) => user.username !== username);
        setUsers({ dept, admin, emp });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      unSuccessful("Error fetching user data");
    }
  };

  const handleConfirmRemoval = (user) => {
    setShowConfirmation(true);
    setUserToRemove(user);
  };

  const handleConfirmationCancel = () => {
    setShowConfirmation(false);
    setUserToRemove(null);
  };

  const handleConfirmationConfirm = () => {
    remUser(userToRemove.username);
    setShowConfirmation(false);
    setUserToRemove(null);
  };

  const updateUser = async (user) => {
    console.log(user);
    setUpdate(user);
  };

  const UserDetails = ({ props }) => {
    const { user, i, role } = props;
    const { name, username } = user;
    return (
      <tr>
        <td>{i + 1}</td>
        <td>{username}</td>
        <td>{name}</td>
        <td>
          <button onClick={() => updateUser(user)}>Update</button>
        </td>
        <td>
          <button onClick={() => handleConfirmRemoval(user)}>Remove</button>
        </td>
      </tr>
    );
  };

  return update ? (
    <UpdateProfile props={{ update, setUpdate, users, setUsers }} />
  ) : (
    <div className="user">
      <div className="centered-div2">
        <div className="heading">
          <h1 className="text-center">
            <b className="w3-large">User Details</b>
          </h1>
        </div>

        {roleArr.map((role, i) => {
          return (
            <div key={i}>
              <h3 className="text-center">
                <b className="w3-large">{role}</b>
              </h3>

              <div className="container table-container">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Username</th>
                      <th>Name</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {i == 0 ? (
                      users.admin.map((user, i) => {
                        return <UserDetails props={{ user, i }} key={i} />;
                      })
                    ) : i == 1 ? (
                      users.emp.length > 0 ? (
                        users.emp.map((user, i) => {
                          return <UserDetails props={{ user, i }} key={i} />;
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center">
                            <h6>No Employees</h6>
                          </td>
                        </tr>
                      )
                    ) : users.dept.length ? (
                      users.dept.map((user, i) => {
                        return <UserDetails props={{ user, i }} key={i} />;
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center">
                          <h6>No Departments</h6>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {showConfirmation && (
        <div style={{ position: "fixed", top: "0", left: "40%" }}>
          <div className="confirmation-card">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Confirm Removal</h5>
                <p className="card-text">
                  Are you sure you want to remove the user "
                  {userToRemove.username}"?
                </p>

                <div className="card-actions">
                  <button
                    className="btn btn-danger"
                    onClick={handleConfirmationConfirm}
                  >
                    Confirm
                  </button>
                  &nbsp;
                  <button
                    className="btn btn-info"
                    onClick={handleConfirmationCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;