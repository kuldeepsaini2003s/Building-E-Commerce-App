import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Body from "./components/Body";
import Contact from "./components/Contact";
import ProductList from "./components/ProductList";
import ProductPage from "./components/ProductPage";
import BestSelling from "./components/BestSelling";
import Cart from "./components/Cart";
import Liked from "./components/Liked";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Body />,
      children: [
        {
          path:"/",
          element:<Home/>
        },
        {
          path: "/Products",
          element: <ProductList />,
        },
        {
          path: "/best-selling",
          element: <BestSelling />,
        },
        {
          path: "/cart",
          element: <Cart />,
        },
        {
          path: "/like-products",
          element: <Liked />,
        },
        {
          path: "/Contact",
          element: <Contact />,
        },
      ],
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);
  return (    
    <RouterProvider router={appRouter}/>          
  );
}

export default App;
