import React from "react";
import AlertContext from "./AlertContext";
import { toast } from "react-toastify";

const AlertState = (props) => {
  const successful = (msg) => {
    toast.success(msg, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const unSuccessful = (msg) => {
    toast.error(msg, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  return (
    <AlertContext.Provider value={{ successful, unSuccessful }}>
      {props.children}
    </AlertContext.Provider>
  );
};

export default AlertState;