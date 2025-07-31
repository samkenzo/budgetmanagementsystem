import AlertState from "./contexts/alert/AlertState";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Departments from "./context/department/Departments";
import Finance from "./finance/Finance";
import Home from "./finance/Home/Home";
import YearState from "./contexts/year/YearState";
import DepartmentState from "./contexts/department/DepartmentState";
import Department from "./finance/Department/Department";


function App() {
  return (
    <>
      <AlertState>
        <YearState>
          <DepartmentState>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              style={{ fontSize: "1em" }}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            <Router>
              <Routes>
                <Route exact path="/" element={<Login />} />
                <Route exact path="/dept" element={<Departments />} />
                <Route exact path="/finance/" element={<Finance />}>
                  <Route path="" element={<Home />} />
                  <Route path="dept" element={<Department />} />
                </Route>
              </Routes>
            </Router>
          </DepartmentState>
        </YearState>
      </AlertState>
    </>
  );

  }

export default App;