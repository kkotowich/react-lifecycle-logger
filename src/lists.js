import React, { Component } from 'react'
import uuid from 'uuid/v4'
import { Row, H4, Id, Value, Item, NoKey, Medium, Faster} from './styled'
import {start, stop, printWasted, printInclusive} from 'react-addons-perf'


export class BigList extends Component {

  static displayName = "BigList"


  constructor(props) {
    super(props)

    this.ids = []

    for (let i = 0; i < 500; i++) {
      this.ids.push(uuid())
    }


    this.state = {
      items: this.ids.map((id)=>{
        return {
         id,
         value: getRandomInt(1,5)
        }
      })
    }
  }

  updateList = () => {
    let newItems = this.ids.map((id)=>{
      return {
       id,
       value: getRandomInt(1,5)
      }
    })
    start()
    this.setState(
      ()=>{
        return {
          items: newItems
        }
      },
      ()=>{
        stop()
        printInclusive()
        printWasted()
      }
    )
  }



  render() {
    return (
      <Row>
        <button
          onClick={this.updateList}
        >
          UpdateList
        </button>
        {/*
        <NoKey>
          <H4>no key</H4>
          {this.state.items.map((item, index) => (
            <Regular
              item={item}
              key={index}
            />
          ))}
        </NoKey>


        <Medium>
          <H4>key, no optimization</H4>
          {this.state.items.map(item => (
            <Regular
              item={item}
              key={item.id}
            />
          ))}
        </Medium>
        */}

        <Faster>
          <H4>key and optimization</H4>
          {this.state.items.map(item => (
            <Optimized
              item={item}
              key={item.id}
            />
          ))}
        </Faster>
        
      </Row>
    )
  }
}


class Optimized extends Component {


  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.item.value !== this.props.item.value
  }

  render() {
    let {id, value} = this.props.item
    return (
      <Item
        value={value}
      >
        <Id>{id}</Id>
        <Value>{value}</Value>
      </Item>
    )
  }
}

class Regular extends Component {


  render() {
    let {id, value} = this.props.item
    return (
      <Item
        value={value}
      >
        <Id>{id}</Id>
        <Value>{value}</Value>
      </Item>
    )
  }
}


function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
