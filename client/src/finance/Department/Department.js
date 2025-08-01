import React, { useContext, useEffect, useState} from "react";
import DepartmentContext from "../../contexts/department/DepartmentContext";
import "./department.css";
import YearContext from "../../contexts/year/YearContext";
import AlertContext from "../../contexts/alert/AlertContext";

const Department = () => {
  const { department } = useContext(DepartmentContext);
  const { year } = useContext(YearContext);
  const { unSuccessful } = useContext(AlertContext);
  const { name, budget, expenditure, username, type } = department;
  const initialIndents = {
    inProcess: [],
    directPur: [],
    payDone: [],
  };
  const [indents, setIndents] = useState(initialIndents);
  const initialTotal = {
    inProcess: { amount: 0, indAmount: 0 },
    directPur: { amount: 0, indAmount: 0 },
    payDone: { amount: 0, indAmount: 0 },
  };
  const [total, setTotal] = useState(initialTotal);

  const fetchData = async () => {
    const response = await fetch(
     `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/budget/fetchtable?username=${username}&type=${type}&year=${year}`,
      {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("authToken"),
        },
      }
    );
    const json = await response.json();
  };

  if (json.error) {
      unSuccessful(json.error);
      setIndents(initialIndents);
      setTotal(initialTotal);
    } else {
      const { indents_process, direct_purchase, indent_pay_done } = json;
      let inProcess = { amount: 0, indAmount: 0 };
      indents_process.map((indent) => {
        inProcess.amount += indent.amount;
        inProcess.indAmount += indent.indent_amount;
      });
      let payDone = { amount: 0, indAmount: 0 };
      indent_pay_done.map((indent) => {
        payDone.amount += indent.amount;
        payDone.indAmount += indent.indent_amount;
      });
      let directPur = { amount: 0, indAmount: 0 };
      direct_purchase.map((indent) => {
        directPur.amount += indent.amount;
        directPur.indAmount += indent.indent_amount;
      });
      setIndents({
        inProcess: indents_process,
        directPur: direct_purchase,
        payDone: indent_pay_done,
      });
      setTotal({ inProcess, payDone, directPur });
    }
  };

  useEffect(() => {
    fetchData();
  }, [year]);

  return (
    <>
      <h2 className="m-3 text-center">{name}</h2>
      <h3 className="m-3 text-center">
        {type ? "Equipment" : "Consumable"} Budget {year}-{(year % 100) + 1}
      </h3>
      <table>
        <thead>
          <tr>
           <th colSpan="2">Budget (Rs.)</th>
            <th colSpan="3">Expenditure</th>
            <th colSpan="3">Fund Available</th>
            <th colSpan="2">Percent Utilised</th>
          </tr>
        </thead>
        <tbody>
          <tr>
         <td colSpan="2">{budget}</td>
            <td colSpan="3">{expenditure}</td>
            <td colSpan="3">{budget - expenditure}</td>
            <td colSpan="2">{((expenditure / budget) * 100).toFixed(2)}%</td>
          </tr>
          <tr>
            <th colspan={10} className="text-center">
              <h4>Indents in Process</h4>
            </th>
          </tr>
          <tr>
            <th>Sr. No.</th>
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
          {indents.inProcess.map((indent, i) => {
            const {
              entry_date,
              particulars,
              indenter,
              indent_no,
              po_no,
              indent_amount,
              amount,
              account_head,
            } = indent;
            const date = new Date(entry_date).toDateString();
            return (
              <tr key={i}>
                <td>{i + 1}</td>
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
                <td>{account_head}</td>
              </tr>
            );
          })}

          <tr>
            <td colSpan="7" className="font-weight-bold">
              Total
            </td>
            <td>{total.inProcess.indAmount}</td>
            <td>{total.inProcess.amount}</td>
            <td></td>
            <th colspan="10">
              <h4 className="text-center">Indent payment done</h4>
            </th>
          </tr>
          <tr>
            <th>Sr. No.</th>
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

           {indents.inProcess.map((indent, i) => {
            const {
              entry_date,
              particulars,
              indenter,
              indent_no,
              po_no,
              indent_amount,
              amount,
              account_head,
            } = indent;
            const date = new Date(entry_date).toDateString();
            return (
              <tr key={i}>
                <td>{i + 1}</td>
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
                <td>{account_head}</td>
              </tr>
            );
          })}

          <tr>
             <td colSpan="7" className="font-weight-bold">
              Total
            </td>
            <td>{total.inProcess.indAmount}</td>
            <td>{total.inProcess.amount}</td>
            <td></td>
          </tr>
          <tr>
            <th colspan="10">
              <h4 className="text-center">Direct purchase</h4>
            </th>
          </tr>
          <tr>
            <th>Sr. No.</th>
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
          {indents.directPur.map((indent, i) => {
            const {
              entry_date,
              particulars,
              indenter,
              indent_no,
              po_no,
              indent_amount,
              amount,
              account_head,
            } = indent;
            const date = new Date(entry_date).toDateString();
            return (
              <tr key={i}>
                <td>{i + 1}</td>
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
                <td>{account_head}</td>
              </tr>
            );
          })}

          <tr>
            <td colSpan="7" className="font-weight-bold">
              Total
            </td>
            <td>{total.directPur.indAmount}</td>
            <td>{total.directPur.amount}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </>
  );
  

export default Department;