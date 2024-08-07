import { createBrowserRouter } from "react-router-dom";
import Home from "./Layout/Layout";
import App from "./App";
import Categories from "./Pages/Categories/Categories";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>
    },
    {
        path: "/layout",
        element: <Home/>,
        children: [
            {
                path: "categories",
                element: <Categories/>
            }
        ]
    }
])

export default router