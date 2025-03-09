
import App from "./App.jsx";

import RoleSelection from "./components/RoleSelection.jsx";
import HelperMap from "./components/HelperMap.jsx";

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
    path: "/map",
    element: <HelperMap />,
  },
];

export default routes;
