import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Generator from "../pages/Generator";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "generator",
    element: <Generator />,
  },
  
]);

export default router;


//https://reactrouter.com/6.28.0/start/overview