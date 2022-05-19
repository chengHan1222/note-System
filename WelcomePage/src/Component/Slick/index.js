import React, { Component } from 'react'
import Carousel from 'react-grid-carousel'
import './index.css'

export default class index extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: 1
        }
    }

    test() {
        this.setState({ id: 2 })
    }

    render() {

        let isHover = true
        let images = [{ key: 0, value: "55570.jpg" }, { key: 1, value: "55570.jpg" }
        ]

        // img.value
        return (
            <div>
                <Carousel hideArrow={!isHover} showDots>
                    {images.map((img, i) => (
                        <Carousel.Item key={i}>
                            <img src={require('../../picture/' + img.value )} alt="" width="100%" height="200px" />
                        </Carousel.Item>

                    ))}
                </Carousel>

            </div >
        )

    }
}
