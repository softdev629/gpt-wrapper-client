import { createBrowserRouter, RouterProvider } from "react-router-dom";

import SigninPage from "./pages/signin.page";
import CheckPage from "./pages/check.page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SigninPage />,
  },
  {
    path: "/check",
    element: <CheckPage />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
