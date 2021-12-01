import React from "react";
import { Router, Route, Switch } from 'react-router-dom';
import '../styles/App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

// components
import MintPage from './MintPage';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/component/MintPage">
                    <MintPage/>
                </Route> 
            </Switch>
        </Router>
        // <div className="App">
        //     <h1>Animix</h1>
        //     <Switch>
        //         <Routes>
        //             <Route path='/' component={MintPage} />
        //         </Routes>
        //     </Switch>
        //     <Button>
        //         onClick={}
        //     </Button>
        // </div>
    );
}

export default App;