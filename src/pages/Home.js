import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Axios from 'axios'

import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import Pagination from 'react-bootstrap/Pagination'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Select from 'react-select'

import Header from '../components/Layout/Header'
import EpisodeModal from '../components/List/EpisodeModal'

const sortOptions = [
    { value: 'air_date', label: 'Air Date' },
    { value: 'episode', label: 'Episode' },
    { value: 'name', label: 'Name' }
]

export default class Home extends Component {
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
                this.setState({ episodes: res.data.results, max_page: res.data.info.pages })
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
                this.setState({ episodes: res.data.results, loading: false })
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
                this.setState({ episodes: res.data.results, loading: false })
            })
            .catch(err => {
                console.log(err);
            })
        this.setState({ page_num: this.state.page_num - 1 })
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

    onNameChange = (e) => {
        console.log(e.target.value);
        this.setState({ filterName: e.target.value })
    }

    onNameSubmit = () => {
        console.log(this.state.filterName);
        Axios.get(`${process.env.REACT_APP_API_URL}/episode/?name=${this.state.filterName}&?episode=${this.state.filterEpisode}`)
            .then(res => {
                console.log(res);
                this.setState({ episodes: res.data.results, max_page: res.data.info.pages })
            })
            .catch(err => {
                console.log(err);
            })
    }

    onEpisodeChange = (e) => {
        console.log(e.target.value);
        this.setState({ filterEpisode: e.target.value })
    }

    onEpisodeSubmit = () => {
        console.log(this.state.filterEpisode);
        Axios.get(`${process.env.REACT_APP_API_URL}/episode/?episode=${this.state.filterEpisode}&?name=${this.state.filterName}`)
            .then(res => {
                console.log(res);
                this.setState({ episodes: res.data.results, max_page: res.data.info.pages })
            })
            .catch(err => {
                console.log(err);
            })
    }

    onSortChanged = (e) => {
        let eps = this.state.episodes;
        eps.sort(this.GetSortOrder(e.value))
        console.log(e.value)
        this.setState(eps)
    }

    onShowModal = (episode) => {
        this.setState({ currentEpisode: episode, showModal: true })
    }

    render() {
        return (
            <div>
                <Header />
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
                            <InputGroup className="mb-3">
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
                                className="mb-4"
                                options={sortOptions} />
                        </Col>
                        <Col md={8}>
                            <h1 className="mb-4 mt-4">Episodes</h1>
                            <Link to="/character">Browse Characters</Link>
                            <Pagination className="mt-2 mb-4 d-flex justify-content-center">
                                <Pagination.Prev disabled={this.state.page_num === 1} onClick={this.onPrevPageClicked} />
                                <Pagination.Item>{this.state.page_num}</Pagination.Item>
                                <Pagination.Next disabled={this.state.page_num === this.state.max_page} onClick={this.onNextPageClicked} />
                                {this.state.loading && <Pagination.Item> Please Wait</Pagination.Item>}
                            </Pagination>
                            <ListGroup>
                                {
                                    this.state.episodes.map(episode => (

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
                                <Pagination.Prev disabled={this.state.page_num === 1} onClick={this.onPrevPageClicked} />
                                <Pagination.Item>{this.state.page_num}</Pagination.Item>
                                <Pagination.Next disabled={this.state.page_num === this.state.max_page} onClick={this.onNextPageClicked} />
                                {this.state.loading && <Pagination.Item> Please Wait</Pagination.Item>}
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
