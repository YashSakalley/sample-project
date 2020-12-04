import React, { useState, useEffect } from 'react'
import { Badge, Breadcrumb, Button, Col, Container, Image, Row } from 'react-bootstrap'
import { useParams, useHistory } from 'react-router-dom'

import Axios from 'axios'

import styles from '../components/List/Character/Character.module.css'



export default function Character() {
    const history = useHistory();
    const id = useParams().id
    const [character, setCharacter] = useState({
        name: '',
        status: '',
        location: {},
        origin: {},
        episode: []
    })



    useEffect(() => {

        const fetchApi = (id) => {
            Axios.get(`${process.env.REACT_APP_API_URL}/character/${id}`)
                .then(res => {
                    console.log(res);
                    setCharacter(res.data)
                })
                .catch(err => {
                    console.log(err);
                })
        }

        fetchApi(id)

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

    let speciesColor = 'dark'
    if (character.species === 'Human')
        speciesColor = 'info'

    let genderColor = 'info';
    switch (character.gender) {
        case 'Male':
            genderColor = 'primary'
            break
        case 'Female':
            genderColor = 'secondary'
            break
        default:
            genderColor = 'info'
    }

    return (
        <div className={styles.background}>
            <Container className={styles.character}>
                <Row>
                    <Col md={5} className="p-0">
                        <Image src={character.image} style={{ height: '100%' }} fluid rounded />
                    </Col>
                    <Col md={7} className="pr-0">
                        <Breadcrumb>
                            <Breadcrumb.Item href="/character">Characters</Breadcrumb.Item>
                            <Breadcrumb.Item active>{character.name}</Breadcrumb.Item>
                        </Breadcrumb>
                        <h2>{character.name.toUpperCase()}</h2>
                        <Button onClick={() => history.goBack()} size="sm" variant="light">Go Back</Button>
                        <div className="d-flex align-items-center">
                            <div style={{
                                width: '20px',
                                height: '20px',
                                margin: '10px',
                                borderRadius: '50%',

                                backgroundColor: statusColor
                            }}></div> {character.status.toUpperCase()} </div>

                        <div className="d-flex align-items-center m-1">
                            Gender: <Badge className="m-1 mt-2" variant={genderColor}> {character.gender} </Badge>
                        </div>
                        <div className="d-flex align-items-center m-1">
                            Species: <Badge className="m-1 mt-2" variant={speciesColor}> {character.species} </Badge>
                        </div>
                        <div className="d-flex align-items-center m-1">
                            Location: {character.location.name}
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
