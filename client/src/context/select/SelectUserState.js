import React, { useEffect, useState } from "react";
import SelectedUserContext from "./SelectedUserContext";

const UserState = (props) => {
  const [SelectedUser, setSelectedUser] = useState(() => {
    const storedData = localStorage.getItem("SelectedUser");
    return storedData ? JSON.parse(storedData) : {};
  });

  useEffect(() => {
    localStorage.setItem("SelectedUser", JSON.stringify(SelectedUser));
  }, [SelectedUser]);

  return (
    <SelectedUserContext.Provider value={{ SelectedUser, setSelectedUser }}>
      {props.children}
    </SelectedUserContext.Provider>
  );
};

export default UserState;