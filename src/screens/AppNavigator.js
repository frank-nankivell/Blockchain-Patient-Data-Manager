import {
    createNavigator,
    SwitchRouter,
    getActiveChildNavigationOptions
  } from "@react-navigation/core";
  
  //import About from "./screens/About";
  import Home from "./screens/Home";
  import DataHome from "./screens/DataHome";
  import Login from "./screens/Login";
  import About from "./screens/About";
  
  
  const App = createNavigator(
    SwitchRouter({
      Home,
      About,
      DataHome,
      Login
    }),
    {}
  );
  
  export default App;