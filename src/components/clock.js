import React, { Component } from 'react';

class Clock extends Component {
    constructor(props) {
        super(props)

        this.state = { time: new Date(), dots: true}
        setInterval(this.update.bind(this),1000)
    }

    update() {
        this.setState({ time: new Date(), dots: !this.state.dots })
    }

    render() {
        let dots = ":"
        if (!this.state.dots) {
            dots = " "
        }
        return <div>
            <h1 style={{textAlign:"center"}}>{this.state.time.getHours()}{dots}{this.state.time.getMinutes()}</h1>
        </div>
    }
}


export default Clock