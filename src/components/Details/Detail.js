import React, { Component } from 'react'

import styles from './Details.module.css'

export default class Detail extends Component {
    render() {
        let { name, value } = this.props
        return (
            <div className={styles.detail}>
                <div className={styles.key}>{name}</div>
                <div className={styles.val}>{value}</div>
            </div>
        )
    }
}
