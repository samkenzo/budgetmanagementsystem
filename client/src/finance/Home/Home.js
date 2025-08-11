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
    console.log(json)
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
              <th scope="col">Expenditure</th>
              <th scope="col">Indents in Process</th>
              <th scope="col">Fund Available</th>
              <th scope="col">% Utilized</th>
              {/* <th scope="col">Remark</th> */}
            </tr>
          </thead>
          <tbody>
            {equipment.length ? (
              equipment.map((eq, i) => {
                const { name, budget, expenditure,in_process,remarks } = eq;
                return (
                  <tr onClick={() => handleClick(eq, 1)} role="button" id={i}key={i}>
                    <td>{i + 1}</td>
                    <td>{name}</td>
                    <td>{budget}</td>
                    <td>{expenditure}</td>
                    <td>{in_process}</td>
                    <td>{budget - expenditure}</td>
                    <td>{((expenditure / budget) * 100).toFixed(2)}%</td>
                    {/* <td></td> */}
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
              {/* <th scope="col">Remark</th> */}
            </tr>
          </thead>
          <tbody>
            {consumable.length ? (
              consumable.map((con, i) => {
                const { name, budget,in_process, expenditure } = con;
                return (
                  <tr onClick={() => handleClick(con, 0)} role="button">
                    <td>{i + 1}</td>
                    <td>{name}</td>
                    <td>{budget}</td>
                    <td>{expenditure}</td>
                    <td>{in_process}</td>
                    <td>{budget - expenditure}</td>
                    <td>{((expenditure / budget) * 100).toFixed(2)}%</td>
                    {/* <td>None</td> */}
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