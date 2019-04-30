import React, { Component } from 'react'
import axios from 'axios'
import config from '../../../api-config'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'


class Inventory extends Component {
  constructor() {
    super()
    this.state = {
      isAllLoading: true,
      isError: false,
      invent: []
    }
  }

  componentDidMount() {
    axios.get(`${config.apiaddress}/inventory`)
    .then(({data, status}) => {
      this.setState({ invent: data, isAllLoading: false })
    })
    .catch(() => {
      this.setState({ isAllLoading: false, isError: true })
    })
  }

  render() {
    const { invent, isAllLoading, isError } = this.state
    return (
      <>
        <style>{`
          .table {
            font-size: 1.55rem;
            line-height: 1.3;
          }
          .table td {
            height: 43px
          }
          .table td, .table th {
            padding: .33rem 1.25rem;
          }
        `}</style>
        <Container>
          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Номер</th>
                  <th>Название</th>
                  <th>Марка/Модель</th>
                </tr>
              </thead>
              <tbody>
                {
                  isAllLoading
                  ? <tr>
                      <td colSpan='3'>Загрузка</td>
                    </tr>
                  : isError
                    ? <tr>
                        <td colSpan='3'>Ошибка при получении данных с сервера</td>
                      </tr>
                    : null
                }
                {
                  invent.map(inventoryItem => <InventoryItem
                    {...inventoryItem}
                    handleDouble={this.handleDouble}
                    changeEvent={this.handleChangeInventory}
                    key={`inventory-item-${inventoryItem._id}`}/> )
                }
                <tr>
                  <td></td>
                  <td>Ключ рожковый 27-32</td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
          </Row>
        </Container>
      </>
    );
  }
}

class InventoryItem extends Component {
  constructor(props) {
    super(props)
    const { name, number, mark } = props
    this.state = {
      name,
      number,
      mark
    }
  }

  render() {
    const { name, number, mark } = this.state
    return (
      <tr>
        <td>{number}</td>
        <td>{name}</td>
        <td>{mark}</td>
      </tr>
    )
  }
}

export default Inventory
