import React, { useContext, useState } from "react";
import "./navbar.css";
import logo from "../../assets/images/iitindorelogo.png";
import { Link } from "react-router-dom";
import YearContext from "../../contexts/year/YearContext";

const Navbar = () => {
  const {setYear}=useContext(YearContext)
  const [years] = useState(() => {
    let years=[];
    for (let i = 2021; i <= new Date().getFullYear(); i++) years.push(i);
    return years;
  });

  const changeYear = (i) => {
    setYear(i);
  };

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg custom-navbar">
          <div className="container-fluid">
            <div className="container2">
              <Link className="navbar-brand" to="/">
                <img
                  src={logo}
                  alt="Logo"
                  width="60"
                  className="d-inline-block align-text-top"
                />
              </Link>
              <h5 className="nav-title">Budget Allocation IIT Indore</h5>
            </div>

            <div className="justify-content-between">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      to="/dept"
                    >
                      Home |
                    </Link>
                  </li>
                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle"
                      to="/"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Change Year
                    </Link>
                    <ul className="dropdown-menu">
                      {years.map((year, i) => {
                        return (
                          <li
                            role="button"
                            className="dropdown-item"
                            key={i}
                            onClick={() => changeYear(year)}
                          >
                            {year}-{(year % 100) + 1}
                          </li>
                        );
                      })}
                    </ul>
                  </li>

                  {localStorage.getItem("authToken") ? (
                    <li className="nav-item">
                      <Link
                        className="nav-link active"
                        aria-current="page"
                        to="/"
                      >
                        Logout
                      </Link>
                    </li>
                  ) : (
                    <li className="nav-item">
                      <Link
                        className="nav-link active"
                        aria-current="page"
                        to="/login"
                      >
                        Log in
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;