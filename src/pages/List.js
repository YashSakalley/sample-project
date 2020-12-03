import React, { Component } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Character from '../components/List/Character'
import Header from '../components/Layout/Header'
import styles from '../components/List/List.module.css'

import * as action_types from '../store/actions'

class List extends Component {

    state = {
        info: {},
        characters: [],
        page_num: 1,
        isLoading: false,
        isFilter: false,
        url: 'https://rickandmortyapi.com/api/character/?page='
    }

    componentDidMount = () => {
        this.setState({ isLoading: true })
        this.updateCharacter()
    }

    viewNextPage = () => {
        this.setState({ isLoading: true })
        this.setState({ page_num: this.state.page_num + 1 })
        this.updateCharacter()
    }

    viewPrevPage = () => {
        this.setState({ isLoading: true })
        this.setState({ page_num: this.state.page_num - 1 })
        this.updateCharacter()
    }

    updateCharacter = () => {
        Axios.get(`${this.state.url}${this.state.page_num}`)
            .then(res => {
                console.log(res.data.info);
                let { data } = res
                this.setState({
                    info: data.info,
                    characters: data.results
                })
            })
            .catch(err => {
                console.log(err);
            })
            .then(() => {
                this.setState({ isLoading: false })
            })
    }

    onViewCharacter = (char) => {
        let { setCharacter } = this.props;
        setCharacter(char);
        this.props.history.push('/details')
    }

    GetSortOrder = (prop) => {
        return function (a, b) {
            if (a[prop] > b[prop]) {
                return 1;
            } else if (a[prop] < b[prop]) {
                return -1;
            }
            return 0;
        }
    }

    search = (filter) => {
        let { name, species, gender, status } = filter;
        let url = `https://rickandmortyapi.com/api/character/?name=${name}&status=${status}&species=${species}&gender=${gender}`
        this.setState({ url: url })
        Axios.get(url)
            .then(res => {
                console.log(res.data.info);
                let { data } = res
                this.setState({
                    info: data.info,
                    characters: data.results
                })
            })
            .catch(err => {
                console.log(err);
            })
        console.log(filter);
    }

    onSortChanged = (attr) => {
        let chars = this.state.characters
        chars.sort(this.GetSortOrder(attr))
        this.setState({ characters: chars })
    }

    render() {
        return (
            <>
                {
                    this.state.isLoading
                        ?
                        <div className={styles.loading}>
                            Please Wait . . .
                        </div>
                        : null
                }

                <Header
                    onSearch={this.search}
                    sortChanged={this.onSortChanged}
                    enableFilter={() => { this.setState({ isFilter: true }) }}
                    isFilter={this.state.isFilter} />

                <div className={styles.list}>
                    {
                        this.state.characters.map((character, id) => (
                            <Character key={id} character={character} click={() => this.onViewCharacter(character)} />
                        ))
                    }
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around'
                }}>
                    <button
                        className={styles.button}
                        disabled={this.state.info.prev === null}
                        onClick={this.viewPrevPage}>
                        Prev
                    </button>
                    <button
                        className={styles.button}
                        disabled={this.state.info.next === null}
                        onClick={this.viewNextPage}>
                        Next
                    </button>
                </div>
                <div className={styles.pageNum}>Page number: {this.state.page_num}</div>
            </>
        )
    }
}

const mapDispatch = (dispatch) => {
    return {
        setCharacter: (character) => dispatch({ type: action_types.SET_BLOG, payload: { char: character } })
    }
}

export default connect(null, mapDispatch)(withRouter(List));