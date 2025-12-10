import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import DisplayProp from "./components/DisplayProp"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

const router = createBrowserRouter([
  {
    path:"/",
    element:<MainLayout />,
    children:[
      {
        path:"/",
        element:<Home />
      },
      {
        path:"/profile",
        element:<Profile />

      },
      {
        path:"/property",
        element:<DisplayProp />
      }
    ]
  },
  {
    path:"/login",
    element:<Login />
  },
  {
    path:"/signup",
    element:<Signup />
  },
  
])


function App() {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  );
}

export default App;
