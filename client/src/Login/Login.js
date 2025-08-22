import React, { useContext, useState } from "react";
import AlertContext from "../contexts/alert/AlertContext";
import { Link, useNavigate } from "react-router-dom";
import finImage from "../assets/images/finance.webp";
import logo from "../assets/images/iitindorelogo.png";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const { successful, unSuccessful } = useContext(AlertContext);
  const navigate = useNavigate();
  const handleOnChange = async (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };
console.log(`${process.env.REACT_APP_API_HOST}/api/user/login`)
  const login = async (token) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_HOST}/api/user/login`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization:token? `Bearer ${token}`:null,
        },
        body: JSON.stringify(credentials),
      }
    );
    const json = await response.json();
    if (json.error) unSuccessful(json.error);
    else {
      const { role } = json.user;
      localStorage.setItem("authToken", json.authToken);
      localStorage.setItem("userRole", role);
      console.log(json);
      successful("You have been logged in succesfully.");
      setTimeout(() => {
        if (!role) navigate("/dept");
        else navigate("/finance");
        window.location.reload();
      }, 2000);
    }
  };

  return (
    <div style={{ minHeight: "94vh" }}>
      <section className="bg-light p-3 p-md-4 p-xl-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-xxl-11">
              <div className="card border-light-subtle shadow-sm">
                <div className="row g-0">
                  <div className="col-12 col-md-6">
                    <img
                      className="img-fluid rounded-start w-100 h-100 object-fit-cover"
                      loading="lazy"
                      src={finImage}
                      alt="Finance Image"
                    />
                  </div>
                  <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                    <div className="col-12 col-lg-11 col-xl-10">
                      <div className="card-body p-3 p-md-4 p-xl-5">
                        <div className="row">
                          <div className="col-12">
                            <div className="mb-5">
                              <div className="text-center mb-4">
                                <Link to="/">
                                  <img src={logo} alt="IITI Logo" width="70" />
                                </Link>
                              </div>
                              <h4 className="text-center">Welcome User !</h4>
                              <p className="text-center">
                                Enter your login credentials
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="row"></div>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            login();
                          }}
                        >
                          <div className="row gy-3 overflow-hidden">
                            <div className="col-12">
                              <div className="form-floating mb-4">
                                <GoogleLogin
                                  onSuccess={(credentialResponse) => {
                                    const { credential } = credentialResponse;
                                    if (credential) {
                                      login(credential);
                                    }
                                  }}
                                  onError={(err) => console.log(err)}
                                />
                              </div>
                              <div className="form-floating mb-3">
                                <input
                                  className="form-control"
                                  name="username"
                                  id="username"
                                  placeholder="Username"
                                  onChange={handleOnChange}
                                  value={credentials.username}
                                  required
                                />
                                <label
                                  htmlFor="username"
                                  className="form-label"
                                >
                                  Username
                                </label>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="form-floating mb-3">
                                <input
                                  type="password"
                                  className="form-control"
                                  name="password"
                                  id="password"
                                  value={credentials.password}
                                  placeholder="Password"
                                  onChange={handleOnChange}
                                  required
                                />
                                <label
                                  htmlFor="password"
                                  className="form-label"
                                >
                                  Password
                                </label>
                                <br />
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "left",
                                  }}
                                >
                                  <Link to={"/forgot-password"}>
                                    Forgot Password
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="d-grid">
                                <button
                                  className="btn btn-dark btn-lg"
                                  type="submit"
                                >
                                  Log In
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;