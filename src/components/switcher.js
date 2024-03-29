import React, { Component } from 'react';
import { Card, Row, Col } from 'react-materialize'
import io from 'socket.io-client';
import { getAllNews } from '../apis/news_api'
import { getAllSlides } from '../apis/slides_api'
import { getAllGraphs } from '../apis/graphs_api'
import NewsItem from './newsitem'
import Weather from './weather'
import Traffic from './traffic'
import Clock from './clock'
import Social from './social'
import Ticker from './ticker'
import Trains from './trains'
import Keukendienst from './keukendienst'
import Forecast from './forecast'
import Grafana from './grafana'
import 'velocity-animate/velocity.ui'
import VelocityTransitionGroup from 'velocity-react/velocity-transition-group'
import '../css/switcher.css';
import { LOGO, HOST } from '../variables'


const availableSlides = {
    "traffic": <Traffic time={15} title="Verkeer in de buurt"/>,
    "social": <Social time={15} title="Zorginnovatie op social media"/>,
    "trains": <Trains time={15} title="NMBS station Geel"/>,
    "keukendienst": <Keukendienst time={15} title="Keukendienst deze week" />,
    "weather": <Forecast time={15} title="Het Weer"/>,
}

class Switcher extends Component {
    count = 0
    featureSlides = []
    graphs = []

    constructor(props) {
        super(props);

        // connect live reloader
        const socket = io.connect(HOST)
        socket.on('update', this.loadFeatureSlides.bind(this))
    
        this.state = { 
            items: [],
            next: [],
        };
        

        this.loadFeatureSlides.bind(this)()
        setTimeout(this.rotate.bind(this), 5000) //maybe i should be improved
    }

    loadFeatureSlides() {
        getAllSlides().then(this.gotSlides.bind(this))
    }

    loadGraphs() {
        getAllGraphs().then(this.gotGraphs.bind(this))
    }

    loadNews() {
        getAllNews().then(this.gotNewsItems.bind(this))
    }

    gotNewsItems(result) {
        const items = result.data.map(i => <NewsItem content={i.content} title={i.title} time={i.slideTime}/>).concat(this.featureSlides).concat(this.graphs)
        console.log(items)
        this.setState({ items, next: (items.slice(1,3).reverse().map((i, j) => { 
            if (!i) {
                // eslint-disable-next-line 
                return
            }
            return <Card className={j === 0? "up-next left-column-card": "up-next-next left-column-card"} key={this.getCount()}><span className="up-next-style">{i.props.title}</span></Card>
            }))
        })
    }

    gotSlides(result) {
        this.featureSlides = []
        for (let key of result.data) {
            this.featureSlides.push(availableSlides[key])
        }
        this.loadGraphs.bind(this)()
    }

    gotGraphs(result) {
        this.graphs = []
        for (let item of result.data) {
            this.graphs.push(<Grafana time={15} title={item.name} src={item.url}/>)
        }
        this.loadNews.bind(this)()
    } 

    getCount() {
        this.count++;
        return this.count
    }

    rotate() {
        let items = this.state.items;
        const lastZero = items[0];
        items = items.slice(1,items.length);
        items.push(lastZero);

        console.log(items.slice(1,3).reverse())

        this.setState({ items, next: (items.slice(1,3).reverse().map((i, j) => { 
            if (!i) {
                // eslint-disable-next-line 
                return
            }
            return <Card className={j === 0? "up-next left-column-card": "up-next-next left-column-card"} key={this.getCount()}><span className="up-next-style">{i.props.title}</span></Card>
            }))
        })

        let slideTime = 15000;
        if (items[0]) {
            slideTime= items[0].props.time * 1000
        }
        setTimeout(this.rotate.bind(this), slideTime)
    }

    render() {
        return <div>
            <Row>
            <Col s={2}>
                <Row><div className="logo-margin"><img className="logo" src={LOGO} alt="zorginnovatie logo"/></div></Row>
                <Row><Card className="left-column-card"><Clock/></Card></Row>
                <Row><Card className="left-column-card"><Weather/></Card></Row>
                <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
                    <h3>{this.state.next}</h3>
                </VelocityTransitionGroup>
       
            </Col>
            <Col s={10}>
                <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
                    <Card className="mainslide" key={this.count}>{this.state.items[0]}</Card>              
                </VelocityTransitionGroup>
            </Col>
        </Row>
        <Ticker/>
        </div>

    }
}


export default Switcher