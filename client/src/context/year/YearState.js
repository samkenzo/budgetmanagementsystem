import React, { useEffect, useState } from "react";
import YearContext from "./YearContext";

const YearState = (props) => {
  const curDate = new Date();
  const curMonth = curDate.getMonth();
  const curYear = curDate.getFullYear() - (curMonth < 3);
  const [year, setYear] = useState(() => {
    const storedData = localStorage.getItem("year");
    return storedData ? storedData : curYear;
  });
  useEffect(() => {
    localStorage.setItem("year", year);
  }, [year]);

  return (
    <YearContext.Provider value={{ year, setYear }}>
      {props.children}
    </YearContext.Provider>
  );
};

export default YearState;