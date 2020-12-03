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
        episodes: [],
        showModal: false,
        currentEpisode: {},
        page_num: 1,
        loading: false,
        filterName: '',
        filterEpisode: ''
    }

    componentDidMount() {

        Axios.get(`${process.env.REACT_APP_API_URL}/episode`)
            .then(res => {
                console.log(res);
                this.setState({ max_page: res.data.info.pages })
                this.props.onSetEpisodes(res.data.results)
            })
            .catch(err => {
                console.log(err);
            })

    }

    onNextPageClicked = () => {
        if (this.state.page_num === this.state.max_page) return;
        this.setState({ loading: true })
        Axios.get(`${process.env.REACT_APP_API_URL}/episode/?page=${this.state.page_num + 1}`)
            .then(res => {
                console.log(res);
                this.setState({ loading: false })
                this.props.onSetEpisodes(res.data.results)
                window.scrollTo(0, 0)
            })
            .catch(err => {
                console.log(err);
            })
        this.setState({ page_num: this.state.page_num + 1 })
    }

    onPrevPageClicked = () => {
        if (this.state.page_num === 1) return;
        this.setState({ loading: true })
        Axios.get(`${process.env.REACT_APP_API_URL}/episode/?page=${this.state.page_num - 1}`)
            .then(res => {
                console.log(res);
                this.setState({ loading: false })
                this.props.onSetEpisodes(res.data.results)
                window.scrollTo(0, 0)
            })
            .catch(err => {
                console.log(err);
            })
        this.setState({ page_num: this.state.page_num - 1 })
    }

    onFirstPageClicked = () => {
        this.setState({ loading: true })
        Axios.get(`${process.env.REACT_APP_API_URL}/episode/?page=${1}`)
            .then(res => {
                console.log(res);
                this.setState({ loading: false })
                this.props.onSetEpisodes(res.data.results)
                window.scrollTo(0, 0)
            })
            .catch(err => {
                console.log(err);
            })
        this.setState({ page_num: 1 })
    }

    onLastPageClicked = () => {
        this.setState({ loading: true })
        Axios.get(`${process.env.REACT_APP_API_URL}/episode/?page=${this.state.max_page}`)
            .then(res => {
                console.log(res);
                this.setState({ loading: false })
                this.props.onSetEpisodes(res.data.results)
                window.scrollTo(0, 0)
            })
            .catch(err => {
                console.log(err);
            })
        this.setState({ page_num: this.state.max_page })
    }

    onNameChange = (e) => {
        console.log(e.target.value);
        this.setState({ filterName: e.target.value })
    }

    onNameSubmit = () => {
        Axios.get(`${process.env.REACT_APP_API_URL}/episode/?name=${this.state.filterName}&?episode=${this.state.filterEpisode}`)
            .then(res => {
                console.log(res);
                this.setState({ max_page: res.data.info.pages, page_num: 1 })
                this.props.onSetEpisodes(res.data.results)
            })
            .catch(err => {
                console.log(err);
            })
    }

    onEpisodeChange = (e) => {
        this.setState({ filterEpisode: e.target.value })
    }

    onEpisodeSubmit = () => {
        Axios.get(`${process.env.REACT_APP_API_URL}/episode/?episode=${this.state.filterEpisode}&?name=${this.state.filterName}`)
            .then(res => {
                console.log(res);
                this.setState({ max_page: res.data.info.pages, page_num: 1 })
                this.props.onSetEpisodes(res.data.results)
            })
            .catch(err => {
                console.log(err);
            })
    }

    onSortChanged = async (e) => {
        let eps = this.props.episodes;
        await eps.sort(this.GetSortOrder(e.value))
        console.log('sort');
        this.props.onSetEpisodes(eps)
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

    onShowModal = (episode) => {
        this.setState({ currentEpisode: episode, showModal: true })
    }

    render() {
        let { episodes } = this.props
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
                                />
                                <InputGroup.Append>
                                    <Button variant="outline-secondary" onClick={this.onNameSubmit}>Search</Button>
                                </InputGroup.Append>
                            </InputGroup>

                            <hr />
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
                                />
                                <InputGroup.Append>
                                    <Button variant="outline-secondary" onClick={this.onEpisodeSubmit}>Search</Button>
                                </InputGroup.Append>
                            </InputGroup>

                            <hr />

                            Sort:
                            <Select
                                onChange={this.onSortChanged}
                                className="mb-4 mt-1"
                                options={sortOptions} />
                        </Col>
                        <Col md={8}>
                            <h1 className="mb-1 mt-2">Episodes</h1>

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
                                    this.state.page_num - 1 > 0
                                        ? <>
                                            <Pagination.First disabled={this.state.page_num === 1} onClick={this.onFirstPageClicked} />
                                            <Pagination.Prev disabled={this.state.page_num === 1} onClick={this.onPrevPageClicked} />

                                            {
                                                this.state.page_num === 2
                                                    ? null
                                                    : <>
                                                        <Pagination.Item disabled={this.state.page_num === 1} onClick={this.onFirstPageClicked}>{1}</Pagination.Item>
                                                        {
                                                            this.state.page_num === 3
                                                                ? null
                                                                :
                                                                <Pagination.Ellipsis />
                                                        }
                                                    </>
                                            }
                                            <Pagination.Item onClick={this.onPrevPageClicked} >{this.state.page_num - 1}</Pagination.Item>
                                        </>
                                        : null
                                }

                                <Pagination.Item active>{this.state.page_num}</Pagination.Item>

                                {
                                    this.state.page_num < this.state.max_page
                                        ?
                                        <>
                                            <Pagination.Item onClick={this.onNextPageClicked}>{this.state.page_num + 1}</Pagination.Item>
                                            {
                                                this.state.page_num === this.state.max_page - 1
                                                    ? null
                                                    : <>
                                                        {
                                                            this.state.page_num === this.state.max_page - 2
                                                                ? null
                                                                :
                                                                <Pagination.Ellipsis />
                                                        }
                                                        <Pagination.Item onClick={this.onLastPageClicked}>{this.state.max_page}</Pagination.Item>
                                                    </>
                                            }

                                            <Pagination.Next disabled={this.state.page_num === this.state.max_page} onClick={this.onNextPageClicked} />
                                            <Pagination.Last disabled={this.state.page_num === this.state.max_page} onClick={this.onLastPageClicked} />
                                        </> : null
                                }

                            </Pagination>
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
        onSetEpisodes: (episodes) => dispatch({ type: action_types.SET_EPISODES, payload: { episodes: episodes } })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EpisodeList);