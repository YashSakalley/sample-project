import React, { useState, useEffect } from 'react'
import { Breadcrumb, Col, Container, Image, Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

import Axios from 'axios'

import styles from '../components/List/Character/Character.module.css'

export default function Character() {

    const id = useParams().id
    const [character, setCharacter] = useState({
        name: '',
        status: '',
        location: {},
        origin: {},
        episode: []
    })

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_API_URL}/character/${id}`)
            .then(res => {
                console.log(res);
                setCharacter(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [id])

    let statusColor = '';
    switch (character.status) {
        case 'Alive':
            statusColor = 'green';
            break
        case 'Dead':
            statusColor = 'red';
            break
        default:
            statusColor = 'orange'
    }

    return (
        <div className={styles.background}>
            <Container className={styles.character}>
                <Row>
                    <Col md={5} className="p-0">
                        <Image src={character.image} fluid rounded />
                    </Col>
                    <Col md={7} className="pr-0">
                        <Breadcrumb>
                            <Breadcrumb.Item href="/character">Characters</Breadcrumb.Item>
                            <Breadcrumb.Item active>{character.name}</Breadcrumb.Item>
                        </Breadcrumb>
                        <h2>{character.name.toUpperCase()}</h2>
                        <div className="d-flex align-items-center">
                            <div style={{
                                width: '20px',
                                height: '20px',
                                margin: '10px',
                                borderRadius: '50%',

                                backgroundColor: statusColor
                            }}></div> {character.status.toUpperCase()} </div>
                        <div className="d-flex align-items-center m-1">
                            Gender: {character.gender}
                        </div>
                        <div className="d-flex align-items-center m-1">
                            Location: {character.location.name}
                        </div>
                        <div className="d-flex align-items-center m-1">
                            Species: {character.species}
                        </div>
                        <div className="d-flex align-items-center m-1">
                            Origin: {character.origin.name}
                        </div>
                        <div className="d-flex align-items-center m-1">
                            Episodes appeared in: {character.episode.length}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
