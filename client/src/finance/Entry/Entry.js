import React, { useContext, useState } from "react";
import YearContext from "../../contexts/year/YearContext";
import "./entry.css";

const Entry = ({ props }) => {
  const { initialIndent, submitIndent, setIndentActive } = props;
  initialIndent.status = 0;
  const { year } = useContext(YearContext);
  const [edit, setEdit] = useState(0);
  const [indent, setIndent] = useState(initialIndent);
  const {
    i,
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
  const statusArr = ["Indent in Process", "Indent Payment Done"];

  let date;
  if (entry_date) date = new Date(entry_date).toDateString();
  else date = new Date().toDateString();
  const handleOnChange = async (e) => {
    const { name, value } = e.target;
    setIndent({ ...indent, [name]: value });
  };
  const handleSubmit = async () => {
    const response = await submitIndent(indent);
    console.log(response);
    if (response == 1) setEdit(0);
  };

  return edit ? (
    <tr key={i}>
      <td>{i + 1}</td>
      {type ? (
        <>Direct Purchased</>
      ) : (
        <td>
          <select name="status" value={indent.status} onChange={handleOnChange}>
            {statusArr.map((mess, i) => {
              return (
                <option value={i} key={i}>
                  {mess}
                </option>
              );
            })}
          </select>
        </td>
      )}
      <td>{date}</td>
      <td>
        <input
          onChange={handleOnChange}
          name="particulars"
          value={particulars}
        ></input>
      </td>
      <td>
        {year}-{(year % 100) + 1}
      </td>
      <td>
        <input
          value={indenter}
          onChange={handleOnChange}
          name="indenter"
        ></input>
      </td>
      {initialIndent.indent_no == "" ? (
        <td>
          <input
            value={indent_no}
            onChange={handleOnChange}
            name="indent_no"
            type="number"
          ></input>
        </td>
      ) : (
        <td>{indent_no}</td>
      )}
      <td>
        <input
          value={po_no}
          onChange={handleOnChange}
          name="po_no"
          type="number"
        ></input>
      </td>
      <td>
        <input
          value={indent_amount}
          onChange={handleOnChange}
          name="indent_amount"
          type="number"
        ></input>
      </td>
      <td>
        <input
          value={amount}
          onChange={handleOnChange}
          name="amount"
          type="number"
        ></input>
      </td>
      <td>
        <input value={remark} onChange={handleOnChange} name="remark"></input>
      </td>
      <td>
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={() => setEdit(0)}>Cancel</button>
      </td>
    </tr>
  ) : (
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
      <td>
        <button
          onClick={() => {
            setEdit(1);
            setIndentActive(indent_no);
          }}
        >
          Edit
        </button>
        <button
          onClick={() => {
            alert("Will be implemented soon.");
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default Entry;