import Dashboard from "./Dashboard";
import TopBar from "../ui/TopBar";
import { UserContextProvider } from "../../contexts/userContext";

function Home() {
    return(
       <>
        <UserContextProvider>
          <TopBar/>
          <Dashboard/>
        </UserContextProvider>

       </>

    );
}

export default Home
