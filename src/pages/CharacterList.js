import React, { Component } from 'react'
import { Link } from 'react-router-dom'
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

import style from '../components/List/Character/Character.module.css'
import Header from '../components/Layout/Header'
import * as action_types from '../store/actions'

const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'genderless', label: 'Genderless' },
    { value: 'unknown', label: 'Unknown' }
]

const statusOptions = [
    { value: 'alive', label: 'Alive' },
    { value: 'dead', label: 'Dead' },
    { value: 'unknown', label: 'Unknown' }
]

const sortOptions = [
    { value: 'gender', label: 'Gender' },
    { value: 'name', label: 'Name' },
    { value: 'species', label: 'Species' },
    { value: 'status', label: 'Status' }
]

class CharacterList extends Component {
    state = {
        max_page: 1,
        page_num: 1,
        showModal: false,
        loading: false,
        filterName: '',
        filterStatus: '',
        filterSpecies: '',
        filterType: '',
        filterGender: '',
        query: {},
        error: ''
    }

    fetchApi = (params) => {
        this.setState({ loading: true })
        Axios.get(`${process.env.REACT_APP_API_URL}/character/`, { params })
            .then(res => {
                console.log(res);
                this.setState({ loading: false, max_page: res.data.info.pages, error: '' })
                this.props.onSetCharacters(res.data.results)
                window.scrollTo(0, 0)
            })
            .catch(err => {
                console.log(err);
                this.setState({ error: 'No characters found', loading: false })
            })
    }

    componentDidMount() {
        this.fetchApi(null)
    }

    onNextPageClicked = () => {
        if (this.state.page_num === this.state.max_page) return;
        const params = {
            page: this.state.page_num + 1,
            ...this.state.query
        }

        this.fetchApi(params)
        this.setState({ page_num: this.state.page_num + 1 })
    }

    onPrevPageClicked = () => {
        if (this.state.page_num === 1) return;
        const params = {
            page: this.state.page_num - 1,
            ...this.state.query
        }

        this.fetchApi(params)
        this.setState({ page_num: this.state.page_num - 1 })
    }

    onFirstPageClicked = () => {
        const params = {
            page: 1,
            ...this.state.query
        }

        this.fetchApi(params)
        this.setState({ page_num: 1 })
    }

    onLastPageClicked = () => {
        const params = {
            page: this.state.max_page,
            ...this.state.query
        }

        this.fetchApi(params)
        this.setState({ page_num: this.state.max_page })
    }

    onGenderChanged = (e) => {
        console.log(e)
        this.setState({ filterGender: e.value })
    }

    onStatusChanged = (e) => {
        console.log(e.value)
        this.setState({ filterStatus: e.value })
    }

    onFieldChanged = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onFilterSubmit = () => {

        const params = {
            name: this.state.filterName,
            status: this.state.filterStatus,
            species: this.state.filterSpecies,
            type: this.state.filterType,
            gender: this.state.filterGender
        }

        this.setState({ query: params })
        this.fetchApi(params)

    }

    onClearFilters = () => {
        this.setState({
            filterName: '',
            filterSpecies: '',
            filterType: '',
            filterGender: '',
            filterStatus: ''
        })
        this.fetchApi()
    }

    onSortChanged = (e) => {
        this.props.onSortCharacters(e.value)
    }

    render() {
        const { characters } = this.props
        const { page_num, max_page } = this.state

        return (
            <div>
                <Header />
                <Navbar bg="light" variant="light">
                    <Navbar.Brand href="#home">Browse</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Episodes</Nav.Link>
                        <Nav.Link href="/character" active>Characters</Nav.Link>
                    </Nav>
                </Navbar>
                <Container>
                    <Row>
                        <Col md={4}>
                            <h3 className="mt-2">Filter</h3>
                            <InputGroup className="mb-3">

                                <FormControl
                                    name="filterName"
                                    placeholder="Name"
                                    aria-label="episode_num"
                                    aria-describedby="basic-addon2"
                                    onChange={this.onFieldChanged}
                                    value={this.state.filterName}
                                />

                            </InputGroup>

                            <InputGroup className="mb-3">

                                <FormControl
                                    name="filterSpecies"
                                    placeholder="Species"
                                    aria-label="episode_num"
                                    aria-describedby="basic-addon2"
                                    onChange={this.onFieldChanged}
                                    value={this.state.filterSpecies}
                                />

                            </InputGroup>

                            <InputGroup className="mb-3">

                                <FormControl
                                    name="filterType"
                                    placeholder="Type"
                                    aria-label="episode_num"
                                    aria-describedby="basic-addon2"
                                    onChange={this.onFieldChanged}
                                    value={this.state.filterType}
                                />

                            </InputGroup>

                            Gender:
                            <Select
                                onChange={this.onGenderChanged}
                                className="mb-4 mt-1"
                                options={genderOptions} />

                            Status:
                            <Select
                                onChange={this.onStatusChanged}
                                className="mb-4 mt-1"
                                options={statusOptions} />

                            <Button
                                className="mt-2 right"
                                variant="outline-primary"
                                onClick={this.onFilterSubmit}>Apply Filter</Button>

                            <hr />

                            Sort:
                            <Select
                                onChange={this.onSortChanged}
                                className="mb-4 mt-1"
                                options={sortOptions} />
                        </Col>
                        <Col md={7}>
                            <h1 className="mb-4 mt-4">Characters</h1>
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
                                                characters.map(character => (

                                                    <ListGroup.Item key={character.id} className={`d-flex ${style.character_list_element}`}>
                                                        <img src={character.image} alt="" />
                                                        <div className="d-flex flex-column">
                                                            <h3>{character.name}</h3>
                                                            <Link to={`character/${character.id}`}>View More</Link>
                                                        </div>
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
                                                page_num < max_page
                                                    ?
                                                    <>
                                                        <Pagination.Item onClick={this.onNextPageClicked}>{page_num + 1}</Pagination.Item>
                                                        {
                                                            page_num === max_page - 1
                                                                ? null
                                                                : <>
                                                                    {
                                                                        page_num === max_page - 2
                                                                            ? null
                                                                            :
                                                                            <Pagination.Ellipsis />
                                                                    }
                                                                    <Pagination.Item onClick={this.onLastPageClicked}>{max_page}</Pagination.Item>
                                                                </>
                                                        }

                                                        <Pagination.Next disabled={page_num === max_page} onClick={this.onNextPageClicked} />
                                                        <Pagination.Last disabled={page_num === max_page} onClick={this.onLastPageClicked} />
                                                    </> : null
                                            }

                                        </Pagination>

                                    </>
                            }
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        characters: state.chrs.characters
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSetCharacters: (characters) => dispatch({ type: action_types.SET_CHARACTERS, payload: { characters: characters } }),
        onSortCharacters: (attr) => dispatch({ type: action_types.SORT_CHARACTERS, payload: { attr: attr } })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterList);