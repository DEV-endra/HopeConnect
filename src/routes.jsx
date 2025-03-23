import App from "./App.jsx";
import RoleSelection from "./components/RoleSelection.jsx";
import HelperMap from "./components/HelperMap.jsx"; // Import the new Map page
import Splash from "./components/Splash.jsx";
import SignUp from "./components/SignUp.jsx"
import Login from "./components/LoginPage.jsx"
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
    element: <SignUp/>,
  },
  {
    path: "/Login", // New route for the Map Page
    element: <Login/>,
  },
  {
    path: "/map", // New route for the Map Page
    element: <HelperMap />,
  }
];

export default routes;
