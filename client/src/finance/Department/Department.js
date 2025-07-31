import React, { useContext } from "react";
import DepartmentContext from "../../contexts/department/DepartmentContext";
import "./department.css";
import YearContext from "../../contexts/year/YearContext";

const Department = () => {
  const { department } = useContext(DepartmentContext);
  const { year } = useContext(YearContext);
  const { name, budget, expenditure, username } = department;

  const fetchData = async () => {
    const response = await fetch(
      `http://${process.env.REACT_APP_API_PORT}:${process.env.REACT_APP_API_PORT}/api/budget/fetchtable?username=${username}&type=${type}&year=${year}`,
      {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("authToken"),
        },
      }
    );
    const json = await response.json();
  };

  return (
    <>
      <h2 className="m-3 text-center">{name}</h2>
      <h3 className="m-3 text-center">
        Year:{year}-{(year % 100) + 1}
      </h3>
      <table>
        <thead>
          <tr>
            <th colspan="3">Budget (Rs.)</th>
            <th colspan="3">Expenditure</th>
            <th colspan="3">Fund Available</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="3">{budget}</td>
            <td colspan="3">{expenditure}</td>
            <td colspan="3">{budget - expenditure}</td>
          </tr>
          <tr>
            <th colspan="9" className="text-center">
              <h4>Indents in Process</h4>
            </th>
          </tr>
          <tr>
            <th>Entry Date</th>
            <th>Particulars</th>
            <th>Year</th>
            <th>Indenter</th>
            <th>Indent No.</th>
            <th>PO No.</th>
            <th>Indent Amount</th>
            <th>Amount (₹)</th>
            <th>Account Head</th>
          </tr>
          <tr>
            <td>21-Sep-23</td>
            <td>23-24</td>
            <td>419</td>
            <td>64,566</td>
            <td>64,566</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td>25-Aug-23</td>
            <td>23-24</td>
            <td>367</td>
            <td>18,00,000</td>
            <td>18,00,000</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td>-</td>
            <td>23-24</td>
            <td>96</td>
            <td>1,61,034</td>
            <td>1,61,034</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td colspan="6">TOTAL</td>
            <td>20,25,600</td>
            <td>23,47,668</td>
            <td>-</td>
          </tr>
          <tr>
            <th colspan="9">
              <h4 className="text-center">Direct Purchase</h4>
            </th>
          </tr>
          <tr>
            <th>Entry Date</th>
            <th>Particulars</th>
            <th>Year</th>
            <th>Indenter</th>
            <th>Indent No.</th>
            <th>PO No.</th>
            <th>Indent Amount</th>
            <th>Amount (₹)</th>
            <th>Account Head</th>
          </tr>

          <tr>
            <td colspan="6">TOTAL</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <th colspan="9">
              <h4 className="text-center">Indent Payment Done</h4>
            </th>
          </tr>
          <tr>
            <th>Entry Date</th>
            <th>Particulars</th>
            <th>Year</th>
            <th>Indenter</th>
            <th>Indent No.</th>
            <th>PO No.</th>
            <th>Indent Amount</th>
            <th>Amount (₹)</th>
            <th>Account Head</th>
          </tr>

          <tr>
            <td colspan="6">TOTAL</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default Department;