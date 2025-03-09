import App from "./App.jsx";
import RoleSelection from "./components/RoleSelection.jsx";
import HelperMap from "./components/HelperMap.jsx"; // Import the new Map page

const routes = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/components",
    element: <RoleSelection />,
  },
  {
    path: "/map", // New route for the Map Page
    element: <HelperMap />,
  },
];

export default routes;
