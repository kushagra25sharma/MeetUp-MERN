import './App.css';
import Sidebar from "./Sidebar/Sidebar";
import Chat from "./Chat/Chat";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Login/Login";
import { useStateValue } from "./StateProvider";

function App() {
  const [{ user }, dispatch] = useStateValue();

  return (
    <div className="app">
      <div className="app__body">
        {!user ? (
          <Login />
        ) : (
          <Router>
            <Switch>
              <Route path="/rooms/:roomId">
                <Sidebar />
                <Chat />
              </Route>
              <Route>
                <Sidebar />
              </Route>
            </Switch>
          </Router>
        )}
      </div>
    </div>
  );
}

export default App;
