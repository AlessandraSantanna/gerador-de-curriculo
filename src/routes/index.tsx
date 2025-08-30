import * as React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Generator from "../pages/Generator";
import Visualizer from "../pages/Visualizer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "generator",
    element: <Generator />,
  },
  {
    path: "visualizer",
    element: <Visualizer />,
  },
]);

export default router;


//https://reactrouter.com/6.28.0/start/overview