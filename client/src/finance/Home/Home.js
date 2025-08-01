import React, { useContext, useEffect, useState } from "react";
import YearContext from "../../contexts/year/YearContext";
import AlertContext from "../../contexts/alert/AlertContext";
import DepartmentContext from "../../contexts/department/DepartmentContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { unSuccessful } = useContext(AlertContext);
  const { year } = useContext(YearContext);
  const { setDepartment } = useContext(DepartmentContext);
  const [equipment, setEquipment] = useState([]);
  const [consumable, setConsumable] = useState([]);
  const navigate = useNavigate();

  const fetchSummary = async () => {
    const response = await fetch(
      `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/budget/fetchsummary?year=${year}`,
      {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("authToken"),
        },
      }
    );
    const json = await response.json();
    if (json.error) unSuccessful(json.error);
    else {
      setConsumable(json.con_result);
      setEquipment(json.eq_result);
    }
  };

  const handleClick = (dept, type) => {
    setDepartment({ ...dept, type });
    navigate("/finance/dept");
  };

  useEffect(() => {
    fetchSummary();
  }, [year]);

  return (

    <div>
      <div className="container centered-div2">
        <h1 className="text-center">
          <b className="w3-large">
            Year {year}-{(year % 100) + 1}
          </b>
        </h1>
      </div>
      <div className="container table-container">
        {/* Add button at the leftmost top corner of the table */}
        {/* <button type="button" class="btn btn-success" id="addButton">Add</button> */}
        {/* Sort by dropdowns at the top-right corner of the table */}
        {/* <div id="sortDropdowns">
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-primary dropdown-toggle"
              data-toggle="dropdown"
            >
              Sort by
            </button>
            <div className="dropdown-menu">
              <a className="dropdown-item" href="#">
                Department
              </a>
              <a className="dropdown-item" href="#">
                %utilized
              </a>
            </div>
          </div>
        </div> */}
        {/* <div id="downloadDropdowns">
          <div id="download">
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-primary dropdown-toggle"
                data-toggle="dropdown"
              >
                Download
              </button>
              <div className="dropdown-menu">
                <a className="dropdown-item" href="#">
                  As PDF
                </a>
                <a className="dropdown-item" href="#">
                  As EXCEL SHEET
                </a>
              </div>
            </div>
          </div>
        </div> */}
        {/* Search bar */}
        {/* <div
          className="input-group mb-3"
          id="searchBar"
          style={{ maxWidth: 300 }}
        >
          <input type="text" className="form-control" placeholder="Search" />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button">
              Search
            </button>
          </div>
        </div> */}
        {/* <div class="d-flex justify-content-end">
<button type="button" class="btn btn-success mr-2">Add</button>
<button type="button" class="btn btn-primary mr-2">Filter</button>
<button type="button" class="btn btn-info">Sort</button>
    </div> */}
      </div>
      <div className="container table-container">
        <table className="table table-bordered">
          <thead>
            <tr>
              <td colSpan={8} className="text-center">
                <h3>Equipment Budget</h3>
              </td>
            </tr>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Department</th>
              <th scope="col">Budget Allocated</th>
              <th scope="col">Actual Expenditure</th>
              <th scope="col">Indents in Process</th>
              <th scope="col">Fund Available</th>
              <th scope="col">% Utilized</th>
              <th scope="col">Remark</th>
            </tr>
          </thead>
          <tbody>
            {equipment.length ? (
              equipment.map((eq, i) => {
                const { name, budget, expenditure } = eq;
                return (
                  <tr onClick={() => handleClick(eq, 1)} role="button" id = {i}>
                    <td>{i + 1}</td>
                    <td>{name}</td>
                    <td>{budget}</td>
                    <td>{expenditure}</td>
                    <td>81.71</td>
                    <td>{budget - expenditure}</td>
                    <td>{((expenditure / budget) * 100).toFixed(2)}%</td>
                    <td>None</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="text-center">
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <br />
       <div className="container table-container">
        <table className="table table-bordered">
          <thead>
            <tr>
              <td colSpan={8} className="text-center">
                <h3>Consumable Budget</h3>
              </td>
            </tr>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Department</th>
              <th scope="col">Budget Allocated</th>
              <th scope="col">Actual Expenditure</th>
              <th scope="col">Indents in Process</th>
              <th scope="col">Fund Available</th>
              <th scope="col">% Utilized</th>
              <th scope="col">Remark</th>
            </tr>
          </thead>
          <tbody>
            {consumable.length ? (
              consumable.map((con, i) => {
                const { name, budget, expenditure } = con;
                return (
                  <tr onClick={() => handleClick(con, 0)} role="button">
                    <td>{i + 1}</td>
                    <td>{name}</td>
                    <td>{budget}</td>
                    <td>{expenditure}</td>
                    <td>81.71</td>
                    <td>{budget - expenditure}</td>
                     <td>{((expenditure / budget) * 100).toFixed(2)}%</td>
                    <td>None</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="text-center">
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;