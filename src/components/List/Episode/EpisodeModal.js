import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'

import Axios from 'axios'

export default class EpisodeModal extends Component {
    state = {
        showCharacters: false,
        characters: [],
        loading: false
    }

    getCharacters = async (characters) => {
        this.setState({ loading: true })
        let newChars = []
        let wait = characters.length;
        await characters.forEach(character => {
            Axios.get(`${character}`)
                .then(res => {
                    let { data } = res;
                    newChars.push({ id: data.id, img: data.image, name: data.name })
                    wait--;
                    if (wait === 0) {
                        this.setState({ characters: newChars, loading: false })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        })
    }

    onCloseModal = () => {
        this.props.onHide(); this.setState({ characters: [] })
    }

    render() {
        let { episode } = this.props

        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {episode.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <strong>Aired on:</strong> {episode.air_date} <br />
                    <strong>Episode:</strong> {episode.episode} <br />

                    <div className="d-flex overflow-auto align-items-center">
                        {
                            this.state.characters.length > 0
                                ?
                                this.state.characters.map((character, id) => (
                                    <Link to={`/character/${character.id}`} key={id}>
                                        <Image className='m-2 mt-4' style={{ width: '45px' }} src={character.img} alt={character.name} roundedCircle />
                                    </Link>
                                ))
                                : <>
                                    {
                                        this.state.loading
                                            ?
                                            <div className="m-2">Loading</div>
                                            : null
                                    }
                                    <Button variant="info" size="sm" className="mb-2 mt-4" onClick={() => this.getCharacters(episode.characters)}>Show Characters</Button>
                                </>
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.onCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
