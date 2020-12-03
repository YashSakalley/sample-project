import { Route, Switch } from 'react-router-dom';

import EpisodeList from './pages/EpisodeList';
import Character from './pages/Character'
import CharacterList from './pages/CharacterList'


const AppRouter = () => {
    return (
        <Switch>

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