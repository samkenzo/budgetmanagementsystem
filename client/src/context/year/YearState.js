import React, { useState } from "react";
import YearContext from "./YearContext";

const YearState = (props) => {
  const curDate = new Date();
  const curYear = curDate.getFullYear();
  const curMonth = curDate.getMonth();
  const [year, setYear] = useState(curMonth < 3 ? curYear - 1 : curYear);

  return (
    <YearContext.Provider value={{ year, setYear }}>
      {props.children}
    </YearContext.Provider>
  );
};

export default YearState;