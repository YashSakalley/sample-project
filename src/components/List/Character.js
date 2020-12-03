import React, { Component } from 'react'

import styles from './Character.module.css'

export default class Character extends Component {
    render() {
        let { character, click } = this.props
        return (
            <div className={styles.character} onClick={click}>
                <img src={character.image} alt="" />
                <div className={styles.name}> {character.name} </div>
                <div>Gender: {character.gender}</div>
                <div>Species: {character.species}</div>
            </div>
        )
    }
}
