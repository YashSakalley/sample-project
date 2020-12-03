import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
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

import style from '../components/List/Character/Character.module.css'
import Header from '../components/Layout/Header'
import * as action_types from '../store/actions'
import { Nav, Navbar } from 'react-bootstrap'

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
        filterName: '',
        filterStatus: '',
        filterSpecies: '',
        filterType: '',
        filterGender: '',
        query: ''
    }

    componentDidMount() {

        Axios.get(`${process.env.REACT_APP_API_URL}/character`)
            .then(res => {
                console.log(res);
                this.setState({ max_page: res.data.info.pages })
                this.props.onSetCharacters(res.data.results)
            })
            .catch(err => {
                console.log(err);
            })

    }

    onNextPageClicked = () => {
        if (this.state.page_num === this.state.max_page) return;
        this.setState({ loading: true })
        Axios.get(`${process.env.REACT_APP_API_URL}/character/?page=${this.state.page_num + 1}&${this.state.query}`)
            .then(res => {
                console.log(res);
                this.setState({ loading: false })
                this.props.onSetCharacters(res.data.results)
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
        Axios.get(`${process.env.REACT_APP_API_URL}/character/?page=${this.state.page_num - 1}&${this.state.query}`)
            .then(res => {
                console.log(res);
                this.setState({ loading: false })
                this.props.onSetCharacters(res.data.results)
                window.scrollTo(0, 0)
            })
            .catch(err => {
                console.log(err);
            })
        this.setState({ page_num: this.state.page_num - 1 })
    }


    onFirstPageClicked = () => {

        this.setState({ loading: true })
        Axios.get(`${process.env.REACT_APP_API_URL}/character/?page=${1}&${this.state.query}`)
            .then(res => {
                console.log(res);
                this.setState({ loading: false })
                this.props.onSetCharacters(res.data.results)
                window.scrollTo(0, 0)
            })
            .catch(err => {
                console.log(err);
            })
        this.setState({ page_num: 1 })
    }

    onLastPageClicked = () => {

        this.setState({ loading: true })
        Axios.get(`${process.env.REACT_APP_API_URL}/character/?page=${this.state.max_page}&${this.state.query}`)
            .then(res => {
                console.log(res);
                this.setState({ loading: false })
                this.props.onSetCharacters(res.data.results)
                window.scrollTo(0, 0)
            })
            .catch(err => {
                console.log(err);
            })
        this.setState({ page_num: this.state.max_page })
    }

    onGenderChanged = (e) => {
        console.log(e.value)
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
        let query = '';
        if (this.state.filterName !== '') {
            query += `name=${this.state.filterName}&`;
        }
        if (this.state.filterStatus !== '') {
            query += `status=${this.state.filterStatus}&`;
        }
        if (this.state.filterSpecies !== '') {
            query += `species=${this.state.filterSpecies}&`;
        }
        if (this.state.filterType !== '') {
            query += `type=${this.state.filterType}&`;
        }
        if (this.state.filterGender !== '') {
            query += `gender=${this.state.filterGender}&`;
        }
        console.log(query);
        this.setState({ query: query })
        Axios.get(`${process.env.REACT_APP_API_URL}/character?${query}`)
            .then(res => {
                console.log(res);
                this.setState({ page_num: 1, max_page: res.data.info.pages })
                this.props.onSetCharacters(res.data.results)
            })
            .catch(err => {
                console.log(err);
            })
    }

    onSortChanged = (e) => {
        let chrs = this.props.characters;
        chrs.sort(this.GetSortOrder(e.value))
        console.log(chrs);
        this.props.onSetCharacters(chrs)
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

    render() {
        let { characters } = this.props

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
                                />

                            </InputGroup>

                            <InputGroup className="mb-3">

                                <FormControl
                                    name="filterSpecies"
                                    placeholder="Species"
                                    aria-label="episode_num"
                                    aria-describedby="basic-addon2"
                                    onChange={this.onFieldChanged}
                                />

                            </InputGroup>

                            <InputGroup className="mb-3">

                                <FormControl
                                    name="filterType"
                                    placeholder="Type"
                                    aria-label="episode_num"
                                    aria-describedby="basic-addon2"
                                    onChange={this.onFieldChanged}
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
                            <h1 className="mb-1 mt-2">Characters</h1>
                            <Link to="/">Browse Episodes</Link>

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
        onSetCharacters: (characters) => dispatch({ type: action_types.SET_CHARACTERS, payload: { characters: characters } })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterList);