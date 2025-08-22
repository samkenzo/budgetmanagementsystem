import React, { useContext } from "react";
import DepartmentContext from "../../contexts/department/DepartmentContext";
import YearContext from "../../contexts/year/YearContext";
import DownloadBudget from "../../DownloadBudget/DownloadBudget";

const BudgetDetails = () => {
  const { department } = useContext(DepartmentContext);
  const {
    budget,
    expenditure,
    in_process,
    indents_process,
    direct_purchase,
    username,
    budget_changes,
  } = department;
  const { type } = department;
  const { year } = useContext(YearContext);
  const statusArr = [
    "Indent in Process",
    "Indent Payment Done",
    "Entry Deleted",
  ];

  return (
    <>
      <div className="body">
        <div className="p-4" style={{ backgroundColor: "#edf7fc" }}>
          <h3
            className="m-3 text-center"
            style={{
              fontFamily: "Arial",
              fontSize: "30px",
              fontWeight: "bold",
            }}
          >
            {department.department}
            <div className="float-end">
              <DownloadBudget
                budget={{
                  totalBudget: budget,
                  total: { expenditure, inProcess: in_process },
                  totalBudget: budget,
                  year,
                  department: { name: department.department, username, type },
                  indents: {
                    inProcess: indents_process,
                    directPur: direct_purchase,
                  },
                }}
              />
            </div>
          </h3>
          <h4
            className="m-3 text-center"
            style={{
              fontFamily: "Arial",
              fontSize: "23px",
              fontWeight: "bold",
            }}
          >
            {type ? "Equipment" : "Consumable"} Budget {year}-{(year % 100) + 1}
          </h4>
          <div className="p-4">
            <table>
              <thead>
                <tr>
                  <th
                    colSpan="2"
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Budget (Rs.){" "}
                  </th>
                  <th
                    colSpan={3}
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Expenditure
                  </th>
                  <th
                    colSpan="3"
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Indents in Process
                  </th>
                  <th
                    colSpan="1"
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Fund Available
                  </th>
                  <th
                    colSpan={2}
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Percent Utilised
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ textAlign: "center" }}>
                  <td colSpan="2">{budget}</td>
                  <td colSpan={3}>{expenditure}</td>
                  <td colSpan="3">{in_process}</td>
                  <td colSpan="1">{budget - expenditure}</td>
                  <td colSpan={2}>
                    {((expenditure / budget) * 100).toFixed(2)}%
                  </td>
                </tr>
              </tbody>
            </table>
            {budget_changes.map((budget_change, index) => (
              <h5
                className="m-3 text-left"
                style={{
                  fontFamily: "Arial",
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "black",
                }}
                key={index}
              >
                {budget_change}
              </h5>
            ))}
            <br></br>

            <div>
              <h4
                className="m-3  text-center"
                style={{
                  fontFamily: "Arial",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#27374d",
                }}
              >
                Indents
              </h4>
            </div>
            <table>
              <thead>
                <tr style={{ backgroundColor: "#0a5095", textAlign: "center" }}>
                  <th
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Sr. No.
                  </th>
                  <th
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Status
                  </th>
                  <th
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Entry Date
                  </th>
                  <th
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Particulars
                  </th>
                  <th
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Year
                  </th>
                  <th
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Indenter
                  </th>
                  <th
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Indent No.
                  </th>
                  <th
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    PO No.
                  </th>
                  <th
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Indent Amount
                  </th>
                  <th
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Final Amount (₹)
                  </th>
                  <th
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody>
                {indents_process.length ? (
                  indents_process.map((indent, i) => {
                    const {
                      entry_date,
                      particulars,
                      indenter,
                      indent_no,
                      po_no,
                      indent_amount,
                      amount,
                      remark,
                      status,
                      type,
                    } = indent;
                    let date;
                    if (entry_date) date = new Date(entry_date).toDateString();
                    else date = new Date().toDateString();
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{type ? "Direct Purchased" : statusArr[status]}</td>
                        <td>{date}</td>
                        <td>{particulars}</td>
                        <td>
                          {year}-{(year % 100) + 1}
                        </td>
                        <td>{indenter}</td>
                        <td>{indent_no}</td>
                        <td>{po_no}</td>
                        <td>{indent_amount}</td>
                        <td>{amount}</td>
                        <td>{remark}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={12} className="text-center">
                      No Indents in Process
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div>
              <h4
                style={{
                  fontFamily: "Arial",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#27374d",
                  textAlign: "center",
                }}
              >
                Direct Purchases
              </h4>
            </div>
            <table>
              <thead>
                <tr>
                  <th
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Sr. No.
                  </th>
                  <th
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Status
                  </th>
                  <th
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Entry Date
                  </th>
                  <th
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Particulars
                  </th>
                  <th
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Year
                  </th>
                  <th
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Indenter
                  </th>
                  <th
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Indent No.
                  </th>
                  <th
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    PO No.
                  </th>
                  <th
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Indent Amount
                  </th>
                  <th
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Amount (₹)
                  </th>
                  <th
                    style={{ backgroundColor: "#0a5095", textAlign: "center" }}
                  >
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody>
                {direct_purchase.length ? (
                  direct_purchase.map((indent, i) => {
                    const {
                      entry_date,
                      particulars,
                      indenter,
                      indent_no,
                      po_no,
                      indent_amount,
                      amount,
                      remark,
                      status,
                      type,
                    } = indent;
                    let date;
                    if (entry_date) date = new Date(entry_date).toDateString();
                    else date = new Date().toDateString();
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          {status === 0 ? "Direct Purchased" : "Entry Deleted"}
                        </td>
                        <td>{date}</td>
                        <td>{particulars}</td>
                        <td>
                          {year}-{(year % 100) + 1}
                        </td>
                        <td>{indenter}</td>
                        <td>{indent_no}</td>
                        <td>{po_no}</td>
                        <td>{indent_amount}</td>
                        <td>{amount}</td>
                        <td>{remark}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={12} className="text-center">
                      No Direct Purchases
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default BudgetDetails;