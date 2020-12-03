import { Route, Switch } from 'react-router-dom';

import Details from './pages/Details';
import EpisodeList from './pages/Home';
import List from './pages/List';
import Character from './pages/Character'
import CharacterList from './pages/CharacterList'


const AppRouter = () => {
    return (
        <Switch>
            <Route path="/list">
                <List />
            </Route>

            <Route path="/details">
                <Details />
            </Route>

            <Route path="/character/:id">
                <Character />
            </Route>

            <Route path="/character">
                <CharacterList />
            </Route>

            <Route path="">
                <EpisodeList />
            </Route>
        </Switch>
    )
}

export default AppRouter