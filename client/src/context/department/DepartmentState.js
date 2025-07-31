import React, { useEffect, useState } from "react";
import DepartmentContext from "./DepartmentContext";

const DepartmentState = (props) => {
  const [department, setDepartment] = useState(() => {
    const storedData = localStorage.getItem("department");
    return storedData ? JSON.parse(storedData) : {};
  });

  useEffect(() => {
    localStorage.setItem("department", JSON.stringify(department));
  }, [department]);

  return (
    <DepartmentContext.Provider value={{ department, setDepartment }}>
      {props.children}
    </DepartmentContext.Provider>
  );
};

export default DepartmentState;