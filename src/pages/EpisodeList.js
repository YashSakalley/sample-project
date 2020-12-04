import React, { Component } from 'react'
import { connect } from 'react-redux'
import Axios from 'axios'
import Select from 'react-select'

import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import Pagination from 'react-bootstrap/Pagination'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import Header from '../components/Layout/Header'
import EpisodeModal from '../components/List/Episode/EpisodeModal'
import * as action_types from '../store/actions'

const sortOptions = [
    { value: 'air_date', label: 'Air Date' },
    { value: 'episode', label: 'Episode' },
    { value: 'name', label: 'Name' }
]

class EpisodeList extends Component {
    state = {
        max_page: 1,
        page_num: 1,
        showModal: false,
        loading: false,
        filterName: '',
        filterEpisode: '',
        currentEpisode: {},
        error: ''
    }

    fetchApi = (params) => {
        this.setState({ loading: true })
        Axios.get(`${process.env.REACT_APP_API_URL}/episode`, { params })
            .then(res => {
                console.log(res);
                this.setState({ loading: false, max_page: res.data.info.pages, error: '' })
                this.props.onSetEpisodes(res.data.results)
                window.scrollTo(0, 0)
            })
            .catch(err => {
                console.log(err);
                this.setState({ error: 'No episodes found', loading: false })
            })
    }

    componentDidMount() {
        this.fetchApi(null)
    }

    onNextPageClicked = () => {
        if (this.state.page_num === this.state.max_page) return;
        const params = {
            page: this.state.page_num + 1
        }

        this.fetchApi(params)
        this.setState({ page_num: this.state.page_num + 1 })
    }

    onPrevPageClicked = () => {
        if (this.state.page_num === 1) return;
        const params = {
            page: this.state.page_num - 1
        }

        this.fetchApi(params)
        this.setState({ page_num: this.state.page_num - 1 })
    }

    onFirstPageClicked = () => {
        const params = {
            page: 1
        }

        this.fetchApi(params)
        this.setState({ page_num: 1 })
    }

    onLastPageClicked = () => {
        const params = {
            page: this.state.max_page
        }

        this.fetchApi(params)
        this.setState({ page_num: this.state.max_page })
    }

    onNameChange = (e) => {
        this.setState({ filterName: e.target.value })
    }

    onEpisodeChange = (e) => {
        this.setState({ filterEpisode: e.target.value })
    }

    onQuerySubmit = () => {
        const params = {
            name: this.state.filterName,
            episode: this.state.filterEpisode
        }

        this.fetchApi(params)
        this.setState({ page_num: 1 })
    }

    onClearFilters = () => {
        this.setState({ filterEpisode: '', filterName: '' })
        this.fetchApi()
    }

    onSortChanged = (e) => {
        this.props.onSortEpisodes(e.value)
    }

    onShowModal = (episode) => {
        this.setState({ currentEpisode: episode, showModal: true })
    }

    render() {
        const { episodes } = this.props
        const { page_num } = this.state

        return (
            <div>
                <Header />
                <Navbar bg="light" variant="light">
                    <Navbar.Brand href="#home">Browse</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/" active>Episodes</Nav.Link>
                        <Nav.Link href="/character">Characters</Nav.Link>
                    </Nav>
                </Navbar>
                <Container>
                    <Row>
                        <Col md={4}>
                            <h3 className="mt-2">Filter</h3>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon1">#</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    placeholder="Name"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    onChange={this.onNameChange}
                                    value={this.state.filterName}
                                />

                            </InputGroup>

                            Episode Number:
                            <InputGroup className="mb-3 mt-1">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon2">e</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    placeholder="Episode Number"
                                    aria-label="episode_num"
                                    aria-describedby="basic-addon2"
                                    onChange={this.onEpisodeChange}
                                    value={this.state.filterEpisode}
                                />

                            </InputGroup>

                            <Button variant="outline-secondary" onClick={this.onQuerySubmit}>Search</Button>

                            <hr />

                            Sort:
                            <Select
                                onChange={this.onSortChanged}
                                className="mb-4 mt-1"
                                options={sortOptions} />
                        </Col>
                        <Col md={8}>
                            <h1 className="mb-1 mt-2">Episodes</h1>
                            {
                                this.state.error
                                    ?
                                    <>
                                        {this.state.error}
                                        <Button variant="info" className="m-2" onClick={this.onClearFilters}>Clear Filters</Button>
                                    </>
                                    :
                                    <>
                                        <ListGroup className="mt-4">
                                            {
                                                episodes.map(episode => (

                                                    <ListGroup.Item key={episode.id}>
                                                        <h3>{episode.name}</h3>
                                                        <br />
                                                        {episode.air_date} <br />
                                                        {episode.episode}
                                                        <Button style={{ float: "right" }} variant="outline-info" onClick={() => this.onShowModal(episode)}>View More</Button>
                                                    </ListGroup.Item>

                                                ))
                                            }
                                        </ListGroup>

                                        <Pagination className="mt-2 mb-4 d-flex justify-content-center">
                                            {this.state.loading && <Pagination.Item> Please Wait</Pagination.Item>}
                                        </Pagination>

                                        <Pagination className="mt-2 mb-4 d-flex justify-content-center">
                                            {
                                                page_num - 1 > 0
                                                    ? <>
                                                        <Pagination.First disabled={page_num === 1} onClick={this.onFirstPageClicked} />
                                                        <Pagination.Prev disabled={page_num === 1} onClick={this.onPrevPageClicked} />

                                                        {
                                                            page_num === 2
                                                                ? null
                                                                : <>
                                                                    <Pagination.Item disabled={page_num === 1} onClick={this.onFirstPageClicked}>{1}</Pagination.Item>
                                                                    {
                                                                        page_num === 3
                                                                            ? null
                                                                            :
                                                                            <Pagination.Ellipsis />
                                                                    }
                                                                </>
                                                        }
                                                        <Pagination.Item onClick={this.onPrevPageClicked} >{page_num - 1}</Pagination.Item>
                                                    </>
                                                    : null
                                            }

                                            <Pagination.Item active>{page_num}</Pagination.Item>

                                            {
                                                page_num < this.state.max_page
                                                    ?
                                                    <>
                                                        <Pagination.Item onClick={this.onNextPageClicked}>{page_num + 1}</Pagination.Item>
                                                        {
                                                            page_num === this.state.max_page - 1
                                                                ? null
                                                                : <>
                                                                    {
                                                                        page_num === this.state.max_page - 2
                                                                            ? null
                                                                            :
                                                                            <Pagination.Ellipsis />
                                                                    }
                                                                    <Pagination.Item onClick={this.onLastPageClicked}>{this.state.max_page}</Pagination.Item>
                                                                </>
                                                        }

                                                        <Pagination.Next disabled={page_num === this.state.max_page} onClick={this.onNextPageClicked} />
                                                        <Pagination.Last disabled={page_num === this.state.max_page} onClick={this.onLastPageClicked} />
                                                    </> : null
                                            }

                                        </Pagination>
                                    </>
                            }

                        </Col>
                    </Row>
                </Container>
                <EpisodeModal
                    episode={this.state.currentEpisode}
                    show={this.state.showModal}
                    onHide={() => this.setState({ showModal: false })}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        episodes: state.eps.episodes
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSetEpisodes: (episodes) => dispatch({ type: action_types.SET_EPISODES, payload: { episodes: episodes } }),
        onSortEpisodes: (attr) => dispatch({ type: action_types.SORT_EPISODES, payload: { attr: attr } })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EpisodeList);