import React, { useContext, useState } from "react";
import {
  Link,
  unstable_HistoryRouter,
  useAsyncValue,
  useNavigate,
} from "react-router-dom";
import finImage from "../assets/images/finance.webp";
import logo from "../assets/images/iitindorelogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import AlertContext from "../contexts/alert/AlertContext";

const ForgotPassword = () => {
  const { successful, unSuccessful } = useContext(AlertContext);
  const [creds, setcreds] = useState({
    username: "",
    email: "",
    password: "",
    cPassword: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpButton, setOtpButton] = useState(true);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setcreds({ ...creds, [name]: value });
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setOtpButton(false);
    const response = await fetch(
      `${process.env.REACT_APP_API_HOST}/api/otp/sendotp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(creds),
      }
    );
    const json = await response.json();
    console.log(json);
    if (!json.error) {
      successful("OTP has been sent to your email");
      setOtpSent(true);
    } else {
      unSuccessful(json.error);
      setOtpButton(true);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    const { password, cPassword, username, otp } = creds;
    if (password !== cPassword) return unSuccessful("Passwords didn'\t match");
    if (password.length < 6)
      return unSuccessful("Password should be atleast 6 characters long!");
    const response = await fetch(
      `${process.env.REACT_APP_API_HOST}/api/otp/resetpassword`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, otp }),
      }
    );
    const json = await response.json();
    if (json.error) unSuccessful(json.error);
    else {
      successful("Password reset successfully!");
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 3000);
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
                              <h4 className="text-center">Forgot Password?</h4>
                              <p className="text-center">
                                Enter your details to reset your password
                              </p>
                            </div>
                          </div>
                        </div>
                        <form onSubmit={sendOtp}>
                          <div className="row gy-3 overflow-hidden">
                            <div className="col-12">
                              <div className="form-floating mb-3">
                                <input
                                  className="form-control"
                                  name="username"
                                  id="username"
                                  value={creds.username}
                                  onChange={handleOnChange}
                                  placeholder="Username"
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
                              <div className="form-floating mb-4">
                                <input
                                  className="form-control"
                                  name="email"
                                  id="email"
                                  placeholder="Email"
                                  required
                                  value={creds.email}
                                  onChange={handleOnChange}
                                />
                                <label htmlFor="email" className="form-label">
                                  Email
                                </label>
                              </div>
                            </div>
                            {!otpSent && (
                              <div className="col-12">
                                <div className="d-grid">
                                  <button
                                    className="btn btn-info btn-lg"
                                    type="submit"
                                    disabled={otpButton === false}
                                  >
                                    Send OTP
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </form>
                        <form onSubmit={updatePassword}>
                          {otpSent && (
                            <div className="row gy-3 overflow-hidden">
                              <div className="col-12">
                                <div className="form-floating mb-3">
                                  <input
                                    className="form-control"
                                    name="otp"
                                    id="otp"
                                    placeholder="OTP"
                                    type="number"
                                    value={creds.otp}
                                    onChange={handleOnChange}
                                    required
                                  />
                                  <label htmlFor="otp" className="form-label">
                                    OTP
                                  </label>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-floating mb-3">
                                  <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    id="newPassword"
                                    value={creds.password}
                                    onChange={handleOnChange}
                                    placeholder="New Password"
                                    required
                                  />
                                  <label
                                    htmlFor="newPassword"
                                    className="form-label"
                                  >
                                    New Password
                                  </label>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-floating mb-3">
                                  <input
                                    type="password"
                                    className="form-control"
                                    name="cPassword"
                                    value={creds.cPassword}
                                    onChange={handleOnChange}
                                    id="confirmPassword"
                                    placeholder="Confirm Password"
                                    required
                                  />
                                  <label
                                    htmlFor="confirmPassword"
                                    className="form-label"
                                  >
                                    Confirm Password
                                  </label>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="d-grid">
                                  <button
                                    className="btn btn-dark btn-lg"
                                    type="submit"
                                  >
                                    Reset Password
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
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

export default ForgotPassword;