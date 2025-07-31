import React, { useState } from "react";
import DepartmentContext from "./DepartmentContext";

const DepartmentState = (props) => {
  const [department, setDepartment] = useState({});

  return (
    <DepartmentContext.Provider value={{ department, setDepartment }}>
      {props.children}
    </DepartmentContext.Provider>
  );
};

export default DepartmentState;