import React, { useContext, useEffect, useState } from "react";
import "./navbar.css";
import logo from "../../assets/images/iitindorelogo.png";
import { Link, useNavigate } from "react-router-dom";
import YearContext from "../../contexts/year/YearContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [years, setYears] = useState([]);
  const { setYear } = useContext(YearContext);

  useEffect(() => {
    if (!localStorage.getItem("authToken")) navigate("/");
    let curYears = [];
    for (let index = 2021; index <= new Date().getFullYear(); index++) {
      curYears.push(index);
    }
    setYears(curYears);
  }, []);

  const logOut = () => {
    localStorage.clear("authToken");
    navigate("/");
  };

  const changeYear = (i) => {
    setYear(i);
  };

  return (
    <>
      
      <header>
        <nav className="navbar navbar-expand-lg custom-navbar">
          <div className="container-fluid">
            <div className="container2">
              <Link className="navbar-brand" to="/finance">
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
                data-bs-target="/navbarSupportedContent"
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
                      to="/finance"
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
                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle"
                      to="/"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Manage Users
                    </Link>
                    <ul className="dropdown-menu">
                      <li>
                        <Link className="dropdown-item" to="/">
                          Add new dept
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/">
                          Remove existing dept
                        </Link>
                      </li>
                      <hr className="dropdown-divider" />
                      <li>
                        <Link className="dropdown-item" to="/">
                          Add new user
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/">
                          Remove existing user
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle"
                      to="/"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Budget Controls
                    </Link>
                    <ul className="dropdown-menu">
                      <li>
                        <Link className="dropdown-item" to="/">
                          Increase Allocated Budget
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/">
                          Reset Financial Year
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li
                    className="nav-item nav-link active"
                    role="button"
                    onClick={logOut}
                  >
                    Logout
                  </li>
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