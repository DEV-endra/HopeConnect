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

const isAuthenticated = async () => {
  const token = localStorage.getItem("token");

  if (!token) return false;
  try {
    const response = await fetch("https://hopeconnect-backend.onrender.com/users/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token: token }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.status === "valid";
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error verifying authentication:", error);
    return false;
  }

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
    path: "/HelperDashboard", // New route for the Map Page
    element: isAuthenticated() ? <HelperDashBoard /> : <Login />,
  },
  {
    path: "/HelpeeDashboard", // New route for the Map Page
    element: isAuthenticated() ? <HelpeeDashBoard /> : <Login />,
  },
  {
    path: "/map", // New route for the Map Page
    element: <HelperMap />,
  },
  {
    path: "/philosophy", // New route for the Map Page
    element: isAuthenticated() ? <Philosophy /> : <Login />,
  },
  {
    path: "/connect",
    element: isAuthenticated() ? <Connect /> : <Login />,
  },
  {
    path: "/audio_connect",
    element: isAuthenticated() ? <AudioConnect /> : <Login />,
  }
];

export default routes;
