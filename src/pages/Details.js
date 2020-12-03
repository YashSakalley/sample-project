import React, { Component } from 'react'
import { connect } from 'react-redux'

import Detail from '../components/Details/Detail'
import styles from '../components/Details/Details.module.css'

class Details extends Component {
    render() {
        let { character } = this.props

        return (
            <div className={styles.details}>
                <h1> {character.name} </h1>
                <img src={character.image} alt="" />
                <div className={styles.body}>
                    <Detail name="Status" value={character.status} />
                    <Detail name="Species" value={character.species} />
                    <Detail name="Gender" value={character.gender} />
                    <Detail name="Origin" value={character.origin.name} />
                </div>
            </div>
        )
    }
}

const mapState = (state) => {
    return {
        character: state.character
    }
}

export default connect(mapState)(Details);