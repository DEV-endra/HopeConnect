import App from "./App.jsx";
import RoleSelection from "./components/RoleSelection.jsx";
import HelperMap from "./components/HelperMap.jsx"; // Import the new Map page
import Splash from "./components/Splash.jsx";
import SignUp from "./components/SignUp.jsx"
import Login from "./components/LoginPage.jsx"
import DashBoard from "./components/DashBoard.jsx"
import HelperDashBoard from "./components/HelperDashboard.jsx"
import SeekerDashBoard from "./components/SeekerDashboard.jsx"
import MyComponent from "./components/Connect.jsx"
const isAuthenticated = () => {
  // Check if the user is authenticated (e.g., token exists, session active)
  return localStorage.getItem('token') !== null;
};
const routes = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/RoleSelection",
    element: <RoleSelection />,
  },
  {
    path: "/Splash", // New route for the Map Page
    element: <Splash />,
  },
  {
    path: "/SignUp", // New route for the Map Page
    element: <SignUp />,
  },
  {
    path: "/Login", // New route for the Map Page
    element: <Login />,
  },
  {
    path: "/dashboard", // New route for the Map Page
    element: <DashBoard />,
  },
  {
    path: "/HelperDashBoard", // New route for the Map Page
    element: isAuthenticated() ? <HelperDashBoard /> : <Login />,
  },
  {
    path: "/SeekerDashBoard", // New route for the Map Page
    element: isAuthenticated() ? <SeekerDashBoard /> : <Login />,
  },
  {
    path: "/map", // New route for the Map Page
    element: <HelperMap />,
  },
  {
    path: "/connect",
    element: <MyComponent />
  },
];

export default routes;
