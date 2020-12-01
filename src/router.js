import { Route, Switch } from 'react-router-dom';
import Details from './pages/Details';
import Home from './pages/Home';
import List from './pages/List';


const AppRouter = () => {
    return (
        <Switch>
            <Route path="/list">
                <List />
            </Route>

            <Route path="/details/:id">
                <Details />
            </Route>

            <Route path="">
                <Home />
            </Route>
        </Switch>
    )
}

export default AppRouter