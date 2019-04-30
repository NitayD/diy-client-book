import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import config from '../../../api-config'

import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import { toast } from 'react-toastify'

import CreateClient from './create_client'
import CreateChild from './create_child'

import {
  createNewMember,
  creatingNewMember,
  createResetMember
} from '../../../actions/member'


class CreateMemberForm extends Component {
  constructor(props) {
    super(props)
    this.state ={
      parentid: '',
      parentName: '',
      childid: '',
      childName: '',
      parentQuery: '',
      childQuery: '',
      parents: [],
      childrens: [],
      pay: {
        method: '',
        status: false
      },
      show: {
        createClient: false,
        createChild: false
      },
      modalConfirmShow: false,
      handleCancel: () => { },
      handleConfirm: () => { },
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleClose() { this.setState({ show: false }) }
  handleShow() { this.setState({ show: true }) }
  modalShow() {
    return new Promise((resolve, reject) => {
      this.setState({
        modalConfirmShow: true,
        handleConfirm: resolve,
        handleCancel: reject
      })
    })
  }
  modalHide() { this.setState({ modalConfirmShow: false, handleConfirm: () => { }, handleCancel: () => { } }) }
  async componentDidMount(only, cb) {
    switch (only) {
      case 'parents':
        return this.setState({
          parents: (await axios.get(`${config.apiaddress}/clients`)).data.data
        }, cb)
      case 'childs':
        return this.setState({
          childrens: (await axios.get(`${config.apiaddress}/childrens`)).data.data
        }, cb)
      default:
        this.sendNotif('Загружаем списки родителей и детей')
        this.props.createNewMember()
        const { edit, toEdit } = this.props
        return this.setState({
          parents: (await axios.get(`${config.apiaddress}/clients`)).data.data,
          childrens: (await axios.get(`${config.apiaddress}/childrens`)).data.data
        }, () => {
          if (edit) {
            this.setState({
              parentName: toEdit.parent.fio,
              childName: `${toEdit.child.fio} ${toEdit.child.age} лет`,
              parentid: toEdit.parent._id,
              childid: toEdit.child._id
            })
          } else if (!edit && !!toEdit && Object.keys(toEdit).length) {
            console.log(toEdit)
            this.setState({
              parentName: toEdit.parent.fio,
              parentid: toEdit.parent._id
            })
          }
          this.sendNotif('Загружено')
        })
    }
  }
  componentWillUpdate(props) { if (!props.status) this.props.createNewMember() }
  componentWillUnmount() { this.props.createResetMember() }
  handleChange(attr, { value }, name) {
    switch (attr) {
      case 'parentid': return this.setState({ parentid: value, parentName: name })
      case 'childid': return this.setState({ childid: value, childName: name })
      case 'parent': return this.setState({ parentQuery: value })
      case 'child': return this.setState({ childQuery: value })
      case 'pay': return this.setState({ pay: { method: value, status: value.length !== 0 } })
      default: return
    }
  }
  toggleModal(modal, status = false) {
    switch (modal) {
      case 'client': return this.setState((oldState) => ({ show: { ...oldState, createClient: status } }))
      case 'child': return this.setState((oldState) => ({ show: { ...oldState, createChild: status } }))
      case 'confirm': return this.setState((oldState) => ({ show: { ...oldState, confirm: status } }))
      case 'add': return this.setState({ modalConfirmShow: status })
      default: return
    }
  }
  sendNotif(text) {
    toast.info(text, {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  async handleSubmit(e) {
    e.preventDefault()
    const { parentid, childid, pay } = this.state
    if (typeof parentid !== 'string') return this.sendNotif('Некорректный id взрослого')
    if (parentid.length !== 24) return this.sendNotif('Некорректный id взрослого')
    if (typeof childid !== 'string') return this.sendNotif('Некорректный id ребёнка')
    if (childid.length !== 24) return this.sendNotif('Некорректный id ребёнка')
    try { await this.modalShow() }
    catch {
      this.modalHide()
      return this.sendNotif("Вы отменили создание")
    }
    this.modalHide()
    this.sendNotif("Запрос на сервер...")
    const { edit, toEdit, members } = this.props
    let result = members.map(member => {
      if (edit && toEdit._id === member._id) {
        member.parent = parentid
        member.child = childid
        member.pay = pay
      } else {
        member.parent = member.parent._id ? member.parent._id : '000000000000000000000000'
        member.child = member.child._id ? member.child._id : '000000000000000000000000'
      }
      return member
    })
    if (!edit) {
      result.push({
        parent: parentid,
        child: childid
      })
    }
    this.props.creatingNewMember({
      members: result,
      id: this.props.mcid
    }, this.props.onSuccess)
  }

  render() {
    const {
      parents,
      childrens,
      parentid,
      childid,
      parentQuery,
      childQuery,
      show,
      modalConfirmShow,
      parentName,
      childName,
      pay
     } = this.state
     const { edit } = this.props
    return (
      <>
      <Form onSubmit={this.handleSubmit}>
        {
          edit
            ?
              <Form.Group>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>Оплата</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    as="select"
                    value={pay.method}
                    onChange={({ target }) => this.handleChange('pay', target)}>
                    <option value=''>Не оплачено</option>
                    <option value='beznal'>Безналичный рассчёт</option>
                    <option value='nal'>Наличный рассчёт</option>
                  </Form.Control>
                </InputGroup>
              </Form.Group>
            : null
        }
        <Form.Group>
          <Form.Label>Найдите или Создайте нового родителя</Form.Label>
          <InputGroup>
            <Form.Control
              placeholder="Начните вводить имя или фамилию родителя..."
              value={parentQuery}
              onChange={(({ target }) => this.handleChange('parent', target))}
            />
            <Form.Control as="select"
              value={parentid}
              onChange={({ target }) => {
                this.handleChange('parentid', target, target.querySelector(`[value="${target.value}"]`).innerText)
              }}>
              <FilteredList data={parents} query={parentQuery}/>
            </Form.Control>
          </InputGroup>
          <Button style={{marginTop: '15px'}} variant="outline-dark" onClick={() => this.toggleModal('client', true)}>+Добавить нового взрослого</Button>
        </Form.Group>
        <Form.Group>
          <Form.Label>Найдите или Создайте нового ребёнка</Form.Label>
          <InputGroup>
            <Form.Control
              placeholder="Начните вводить имя или фамилию ребёнка..."
              value={childQuery}
              onChange={(({ target }) => this.handleChange('child', target))}
              />
            <Form.Control as="select"
              value={childid}
              onChange={(({ target }) => this.handleChange('childid', target, target.querySelector(`[value="${target.value}"]`).innerText))}>
              <FilteredList data={childrens} query={childQuery} type='childrens' parentid={parentid}/>
            </Form.Control>
          </InputGroup>
          <Button style={{marginTop: '15px'}} variant="outline-dark" onClick={() => this.toggleModal('child', true)}>+Добавить нового ребёнка</Button>
        </Form.Group>
        <Form.Group>
          <Button variant="success" type="submit" style={{marginLeft: 'auto'}} className='d-block'>
            {edit ? 'Изменить' : 'Добавить'} пару Взрослый+Ребёнок
          </Button>
        </Form.Group>
      </Form>


        <Modal
          show={show.createClient}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={() => this.toggleModal('client')}>
          <Modal.Header closeButton>
            <Modal.Title>Добавление нового взрослого</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CreateClient onSuccess={async (id, name) => {
              this.toggleModal('client')
              this.sendNotif('Обновляем список родителей')
              this.componentDidMount('parents', () => {
                this.sendNotif('Обновлено')
                this.handleChange('parentid', { value: id }, name)
              })
            }} />
          </Modal.Body>
        </Modal>

        <Modal
          show={show.createChild}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={() => this.toggleModal('child')}>
          <Modal.Header closeButton>
            <Modal.Title>Добавление нового ребёнка</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CreateChild onSuccess={async (id, name) => {
              this.toggleModal('child')
              this.sendNotif('Обновляем список детей')
              this.componentDidMount('childs', () => {
                this.sendNotif('Обновлено')
                this.handleChange('childid', { value: id }, name)
              })
            }} />
          </Modal.Body>
        </Modal>

        <Modal
          show={modalConfirmShow}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={() => this.toggleModal('add')}>
          <Modal.Header closeButton>
            <Modal.Title>Подтвердите правильность введённых вами данных</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Родитель: <b>{parentName}</b><br />
              Ребёнок: <b>{childName}</b><br />
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.state.handleCancel}>
              Отмена
            </Button>
            <Button variant="success" onClick={this.state.handleConfirm}>
              { edit ? 'Изменить' : 'Добавить' } пару
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

function ListItem({val, text}) {
  return (
    <option value={val}>{text}</option>
  )
}

function ListBindParent({ data, parentid = '' }) {
  const childrens = parentid.length > 0 ? data.filter(child => child.parents.includes(parentid)) : []
  return (
    <>
      {childrens.length && <option value='' disabled>-- Прикреплённые к родителю дети --</option>}
      {childrens.map(child => <ListItem val={child._id} text={`${child.fio} ${child.age} лет`} key={`binded-childrens-${child._id}`}/>)}
      <option value='' disabled>-- Все дети--</option>
    </>
  )
}

function sortAlpfavite(a, b) {
  const nameA = a.fio.toLowerCase()
  const nameB = b.fio.toLowerCase()
  if (nameA > nameB) return 1
  if (nameA < nameB) return -1
  return 0
}

function FilteredList({ data = [], query, type, parentid }) {
  const reg = new RegExp(query, 'i')
  const list = query.length > 0 ? data.filter(item => ~item.fio.search(reg)).sort(sortAlpfavite) : data.sort(sortAlpfavite)
  switch (type) {
    case 'childrens':
      return (
        <>
          <option className='d-none' value='' disabled></option>
          <ListBindParent data={data} parentid={parentid} />
          {list.map(child => <ListItem val={child._id} text={`${child.fio} ${child.age} лет`} key={`child-${child._id}`} />) }
        </>
        )
    default: return (
        <>
          <option className='d-none' value='' disabled></option>
          {list.map(item => <ListItem val={item._id} text={`${item.fio}`} key={item._id} />)}
        </>
      )
  }
}

const mapStateToProps = ({ member }) => ({
  ...member
})

export default connect(mapStateToProps, {
  createNewMember,
  creatingNewMember,
  createResetMember
})(CreateMemberForm)
