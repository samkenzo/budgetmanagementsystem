import React, { useContext } from "react";
import DepartmentContext from "../../contexts/department/DepartmentContext";

const Department = () => {
  const { department } = useContext(DepartmentContext);
  return (
    <>
      <h1>Hello cse</h1>
    </>
  );
};

export default Department;