import { createBrowserRouter } from "react-router-dom";
import Home from "./Layout/Layout";
import App from "./App";
import Categories from "./Pages/Categories/Categories";
import Cities from "./Pages/Cities/Cities";
import Brands from "./Pages/Brands/Brands";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />
    },
    {
        path: "/layout",
        element: <Home />,
        children: [
            {
                path: "categories",
                element: <Categories />
            },
            {
                path: "cities",
                element: <Cities />
            },
            {
                path:"brands",
                element:<Brands/>
            }
        ]
    }
])

export default router