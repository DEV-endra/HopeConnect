import App from "./App.jsx";
import RoleSelection from "./components/RoleSelection.jsx";
import HelperMap from "./components/HelperMap.jsx"; // Import the new Map page
import Splash from "./components/Splash.jsx";
import SignUp from "./components/SignUp.jsx"
import Login from "./components/LoginPage.jsx"
import DashBoard from "./components/DashBoard.jsx"
import HelperDashBoard from "./components/HelperDashboard.jsx"
import HelpeeDashBoard from "./components/HelpeeDashboard.jsx"
import Connect from "./components/Connect.jsx"
import Philosophy from "./components/Philosophy.jsx";
import AudioConnect from "./components/AudioConnect.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

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
    path: "/Splash",
    element: <Splash />,
  },
  {
    path: "/SignUp",
    element: <SignUp />,
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <DashBoard />,
  },
  {
    path: "/HelperDashboard",
    element: (
      <ProtectedRoute>
        <HelperDashBoard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/HelpeeDashboard", // New route for the Map Page
    element: (
      <ProtectedRoute>
        <HelpeeDashBoard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/map", // New route for the Map Page
    element: (
      <ProtectedRoute>
        <HelperMap />
      </ProtectedRoute>
    ),
  },
  {
    path: "/philosophy", // New route for the Map Page
    element: (
      <ProtectedRoute>
        <Philosophy />
      </ProtectedRoute>
    ),
  },
  {
    path: "/connect",
    element: (
      <ProtectedRoute>
        <Connect />
      </ProtectedRoute>
    ),
  },
  {
    path: "/audio_connect",
    element: (
      <ProtectedRoute>
        <AudioConnect />
      </ProtectedRoute>
    ),
  }
];

export default routes;
