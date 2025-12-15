import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import { UserContextProvider } from "./userContext";

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