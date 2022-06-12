import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Index from './components/Index';
import Create from './components/Create';
import Error from './components/Error'
import MyCollections from './components/MyCollections';

// export const history = createBrowserHistory();
// export const history = createMemoryHistory();
const App = () => {
  // const navigate = useNavigate();
  // const history = useHistory();
  const backgroundColorValue=0;
  // const history = createMemoryHistory();
  return (
    // <Router location={history.location} navigator={history}>
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<Index/>} />
        <Route path="/create" element={<Create/>} /> 
        <Route path="/mycollections" element={<MyCollections/> } /> 
        <Route path="*" element={Error} />
        </Routes>
        { 
        // <div>
        //     style={{
        //       switch(backgroundColorValue){
        //         case 0:
        //           <body  class = "background-red" ></body>
        //           break;
        //         case 1:
        //         <body  class = "background-white" ></body>
        //           break;
        //         case 2:
        //             <body  class = "background-yellow" ></body>
        //           break;
        //         case 3:
        //             <body  class = "background-green" ></body>
        //             break;
        //         case 4:
        //             <body  class = "background-blue" ></body>
        //             break;
        //         }
        //     }}
        // </div> 
        }
    </BrowserRouter>
    )
}
export default App;