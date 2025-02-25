import { Outlet } from "react-router-dom"
import LeftSidebar from "./LeftSidebar"
import Home from "./Home"


const MainLayout = () => {
  return (
    <div>
      <LeftSidebar/>
      <div>
        <Outlet/>
      </div>
    </div>
  )
}

export default MainLayout
