import React, { Component } from 'react'
import axios from 'axios'
import config from '../../../api-config'
import { toast } from 'react-toastify'

import { Link } from 'react-router-dom'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Container from 'react-bootstrap/Container'
import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function getNumber(numberString) {
  const zeros = 5 - String(numberString).length
  let result = String(numberString)
  for (let i = 0; i < zeros; i++) { result = `0${result}` }
  return result
}

class Inventory extends Component {
  constructor() {
    super()
    this.state = {
      newNumber: 0,
      newName: '',
      newMark: '',
      isAllLoading: true,
      isError: false,
      isLoading: false,
      invent: []
    }
    this.addNewItem = this.addNewItem.bind(this)
    this.handleDouble = this.handleDouble.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleChangeInventory = this.handleChangeInventory.bind(this)
    this.handleDeleteInventory = this.handleDeleteInventory.bind(this)
    
  }

  componentDidMount() {
    axios.get(`${config.apiaddress}/inventory`)
    .then(({data}) => {
      this.setState({ invent: data, isAllLoading: false, newNumber: data.length + 1 })
    })
    .catch(() => {
      this.setState({ isAllLoading: false, isError: true })
    })
  }

  diff(obj1, obj2) {
    const keys1 = Object.keys(obj1).sort()
    const keys2 = Object.keys(obj2).sort()
    for (let i = 0; i < keys1.length; i++) {
      if (obj1[keys1[i]] !== obj2[keys2[i]]) return true
    }
    return false
  }

  handleChangeInventory(id, data) {
    const itemId = this.state.invent.findIndex(item => item._id === id)
    const result = [...this.state.invent]
    if (this.diff(result[itemId], data)) {
      result[itemId] = data
      this.setState({ invent: result })
    }
  }

  handleDeleteInventory(id) {
    const itemId = this.state.invent.findIndex(item => item._id === id)
    let result = [...this.state.invent]
    delete result[itemId]
    const res = result.filter(item => !!item)
    for (let i = itemId + 0; i <= res.length; i++) {
      if (res[i]) {
        let item = { ...res[i] }
        item.number -= 1
        res[i] = item
      } else { console.log(`not items before ${itemId} element, all ${res.length}`) }
    }
    this.setState({ invent: res, newNumber: this.state.newNumber - 1 })
  }

  handleChange(varible, val) {
    switch (varible) {
      case 'name': return this.setState({ newName: val })
      case 'number': return this.setState({ newNumber: val })
      case 'mark': return this.setState({ newMark: val })
      default: return
    }
  }
  sendNotification(type = 'info', text = '') {
    try {
      toast[type](text, {
        position: "top-right",
        autoClose: 7500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error(err)
    }
  }

  async addNewItem({ name, mark }) {
    const { newNumber } = this.state
    const newName = name || this.state.newName
    const newMark = mark || this.state.newMark

    if (newName.length < 3) return this.sendNotification('warning', 'Слишком короткое имя')
    if (newName.length > 40) return this.sendNotification('warning', 'Слишком длинное имя')
    if (newMark.length > 40) return this.sendNotification('warning', 'Слишком длинное марка/модель')
    if (isNaN(Number(newNumber))) return this.sendNotification('warning', 'Проверьте правильность введённого номера')

    this.setState({ isLoading: true })
    await axios.post(`${config.apiaddress}/inventory/new`, {
      number: newNumber,
      name: newName,
      mark: newMark
    }).then(({ data }) => {
      if (data.status) {
        const result = [...this.state.invent, {
          number: newNumber,
          name: newName,
          mark: newMark,
          _id: data.data._id
        }]
        this.setState({
          invent: result,
          newNumber: result.length + 1,
          newName: '',
          newMark: '',
          isLoading: false,
        })
      } else {
        alert('Ошибка при добавлении')
      }
    }).catch(() => alert('Ошибка 2'))
  }

  handleDouble(params) {
    this.addNewItem(params)
  }

  render() {
    const { invent, newNumber, newName, newMark, isLoading, isAllLoading, isError } = this.state
    return (
      <>
        <Breadcrumb>
          <Container>
            <Row>
              <Breadcrumb.Item active>Инвентаризационный учёт</Breadcrumb.Item>
            </Row>
          </Container>
        </Breadcrumb>
        <Container>
          <Row style={{paddingBottom: '100px'}}>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Номер</th>
                  <th>Название</th>
                  <th>Марка/Модель</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tfoot className='container'>
                {
                  isLoading
                    ?
                    <tr className='row'>
                      <td colSpan='3' className='col'/>
                      <td className='col-auto'><Spinner animation="border" /></td>
                    </tr>
                    :
                    <tr className='row'>
                      <td className='col-auto'>
                        {getNumber(newNumber)}
                        {/* <Form.Control
                        required
                        value={newNumber}
                        onChange={({ target }) => this.handleChange('number', target.value)} /> */}
                      </td>
                      <td colSpan='3' className='col'>
                        <Form onSubmit={this.addNewItem}>
                          <Form.Row>
                            <Col>
                              <Form.Control
                                autoFocus
                                required
                                value={newName}
                                onChange={({ target }) => this.handleChange('name', target.value)} />
                            </Col>
                            <Col>
                              <Form.Control
                                value={newMark}
                                onChange={({ target }) => this.handleChange('mark', target.value)} />
                            </Col>
                            <Col>
                              <div className='control_btns'>
                                <ButtonToolbar>
                                  <Button variant="outline-success" onClick={this.addNewItem} type='submit'>Добавить</Button>
                                  <Link to='/print/inventory' className='btn btn-outline-dark'>Печать страницы</Link>
                                  <Button variant="outline-dark" onClick={() => window.scrollBy({ top: document.body.offsetHeight, behavior: 'smooth' })}>Опустить страницу</Button>
                                </ButtonToolbar>
                              </div>
                            </Col>
                          </Form.Row>
                        </Form>
                      </td>
                    </tr>
                }
              </tfoot>
              <tbody style={{maxHeight: '70vh', overflow: 'scroll', paddingBottom: '200px'}}>
                {
                  isAllLoading
                  ? <tr>
                      <td colSpan='4'>Загрузка</td>
                    </tr>
                  : isError
                    ? <tr>
                        <td colSpan='4'>Ошибка при получении данных с сервера</td>
                      </tr>
                    : null
                }
                {
                  invent.map(inventoryItem => <InventoryItem
                    {...inventoryItem}
                    handleDouble={this.handleDouble}
                    changeEvent={this.handleChangeInventory}
                    deleteEvent={this.handleDeleteInventory}
                    key={`inventory-item-${inventoryItem._id}`}/> )
                }
              </tbody>
            </Table>
          </Row>
        </Container>
        <style>{`
          tfoot {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 20px;
            z-index: 1;
            background-color: #fff;
          }
        `}</style>
      </>
    );
  }
}

class InventoryItem extends Component {
  constructor(props) {
    super(props)
    const { name, number, mark, _id } = props
    this.state = {
      name,
      number,
      mark,
      _id,
      isChange: false,
      isLoading: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleStartChange = this.handleStartChange.bind(this)
    this.handleEndChange = this.handleEndChange.bind(this)
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { props, state } = this
    let toUpdate = false
    if (props.name !== nextProps.name ||
      props.number !== nextProps.number ||
      props.mark !== nextProps.mark ||
      props._id !== nextProps._id) toUpdate = true
    if (state.name !== nextState.name ||
      state.number !== nextState.number ||
      state.mark !== nextState.mark ||
      state._id !== nextState._id ||
      state.isChange !== nextState.isChange ||
      state.isLoading !== nextState.isLoading) toUpdate = true
    return toUpdate
  }
  componentWillUpdate({ name, number, mark }, newState) {
    const { state } = this
    const toState = {}
    if (state.number !== number) toState.number = number
    if (state.name !== name) toState.name = name
    if (state.mark !== mark) toState.mark = mark
    if (state.number !== newState.number) toState.number = newState.number
    if (state.name !== newState.name) toState.name = newState.name
    if (state.mark !== newState.mark) toState.mark = newState.mark
    if (Object.keys(toState).length) {
      this.setState({...toState})
    }
  }
  handleCancel() {
    const { name, number, mark } = this.props
    this.setState({
      name,
      number,
      mark,
      isChange: false
    })
  }
  handleChange(varible, val) {
    switch (varible) {
      case 'name': return this.setState({ name: val})
      case 'number': return this.setState({ number: val })
      case 'mark': return this.setState({ mark: val })
      default: return
    }
  }
  handleStartChange() { this.setState({ isChange: true }) }
  async handleEndChange() {
    this.setState({ isChange: false, isLoading: true })
    const { _id, name, number, mark } = this.state
    await axios.put(`${config.apiaddress}/inventory/update`, {
      _id,
      number,
      name,
      mark
    }).then((result) => {
      if (result.data.status) {
        this.setState({ isLoading: false })
        this.props.changeEvent(_id, { name, number, mark, _id })
      } else { alert('Ошибка при изменении 1') }
    }).catch(() => alert('Ошибка при изменении 2'))
  }

  async handleDelete() {
    this.setState({ isChange: false, isLoading: true })
    const { _id } = this.state
    await axios.delete(`${config.apiaddress}/inventory/delete/${_id}`)
    .then((result) => {
      if (result.data.status) {
        this.setState({ isLoading: false })
        this.props.deleteEvent(_id)
      } else { alert('Ошибка при изменении 1') }
    }).catch((err) => console.log(err))
  }

  render() {
    const { name, number, mark, isChange, isLoading } = this.state
    if (isChange)
      return (
        <tr>
          <td><Form.Control value={number} onChange={({ target }) => this.handleChange('number', target.value)} /></td>
          <td><Form.Control value={name} onChange={({ target }) => this.handleChange('name', target.value)} /></td>
          <td><Form.Control value={mark} onChange={({ target }) => this.handleChange('mark', target.value)} /></td>
          <td className=' control_btns'>
            <ButtonToolbar>
              <Button variant="outline-success" onClick={this.handleEndChange}>Готово</Button>
              <Button variant="outline-secondary" onClick={this.handleCancel.bind(this)}>Отмена</Button>
            </ButtonToolbar>
          </td>
        </tr>
      )
    else if (isLoading)
      return (
        <tr>
          <td />
          <td></td>
        </tr>
      )
    else
      return (
        <tr>
          <td>{getNumber(number)}</td>
          <td>{name}</td>
          <td>{mark}</td>
          <td className=' control_btns'>
            <ButtonToolbar>
              <Button variant="outline-secondary" onClick={this.handleStartChange}>Изменить</Button>
              <Button variant="outline-info" onClick={() => this.props.handleDouble({ name, mark })}>Дублировать</Button>
              <Button variant="outline-danger" onClick={this.handleDelete}>Удалить</Button>
            </ButtonToolbar>
          </td>
        </tr>
      )
  }
}

export default Inventory
