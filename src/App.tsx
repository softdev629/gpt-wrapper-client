import { createBrowserRouter, RouterProvider } from "react-router-dom"

import SigninPage from "./pages/signin.page"

const router = createBrowserRouter([
  {
    path: "/",
    element: <SigninPage />
  }
])

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
