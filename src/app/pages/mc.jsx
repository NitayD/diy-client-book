import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import { toast } from 'react-toastify'

import config from '../../api-config'
import PatternedDate from '../includes/date'

import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Spinner from 'react-bootstrap/Spinner'

import CreateMemberForm from '../includes/forms/create_member'


function sendNotif(text) {
  toast.info(text, {
    position: "top-right",
    autoClose: 2500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })
}

class MasterClass extends Component {
  constructor(props) {
    super(props)
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.state = {
      show: false,
      isLoading: true,
      isError: false,
      maxMembers: 0,
      price: false,
      date: 0,
      project: {
        name: ''
      },
      toEdit: {},
      members: [],
      handleCancel: () => { },
      handleConfirm: () => { },
      modalRemoveShow: false,
      toRemoveDate: { parent: { fio: '' }, child: { fio: '', age: 0 } },
      mcid: window.location.parseHash().mcid
    }
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.modalHide = this.modalHide.bind(this)
    this.removeMember = this.removeMember.bind(this)
    this.refreshMembers = this.refreshMembers.bind(this)
  }
  componentDidMount(update) {
    axios.get(`${config.apiaddress}/mc/get/${this.state.mcid}`)
    .then((result) => {
      const { status, data, favorites } = result.data
      if (status) {
        const { members, maxMembers, price, date, project } = data
        this.setState({ members, maxMembers, price, date, project, isLoading: false, clients: favorites.data },
          () => update && sendNotif('Обновленно'))
      } else {
        this.setState({ isLoading: false, isError: true })
      }
    })
    .catch((error) => {
      console.log(error)
      this.setState({ isLoading: false, isError: true })
    })
  }
  modalShow(member) {
    return new Promise((resolve, reject) => {
      this.setState({
        modalRemoveShow: true,
        toRemoveDate: member,
        handleConfirm: resolve,
        handleCancel: reject
      })
    })
  }
  modalHide() {
    this.setState({
      modalRemoveShow: false,
      toRemoveDate: {parent: {fio: ''}, child: {fio: '', age: 0}},
      handleConfirm: () => { },
      handleCancel: () => { }
    })
  }
  refreshMembers() {
    this.handleClose()
    this.modalHide()
    sendNotif('Обновляем список участников...')
    this.setState({isLoading: true})
    this.componentDidMount()
  }
  async removeMember(memberIndex) {
    let members = [...this.state.members]
    try { await this.modalShow(members[memberIndex]) }
    catch (err) {
      this.modalHide()
      return sendNotif("Вы отменили удаление создание мастер-класса")
    }
    delete members[memberIndex]
    members = members.filter(item => !!item)
    members = members.map(item => {
      item.parent = item.parent._id
      item.child = item.child._id
      return item
    })
    const result = await axios.put(`${config.apiaddress}/mc/update`, { members, id: this.state.mcid })
    const { status, data } = result
    if (status >= 200 && status < 300) {
      if (!data.status) {sendNotif('Ошибка при обновлении...') }
      else { this.refreshMembers(members) }
    } else {
      sendNotif('Ошибка при удалении')
    }
  }
  handleShow(toEdit) { this.setState({ show: true, toEdit: toEdit || {} }) }
  handleClose() { this.setState({ show: false, toEdit: {} }) }
  render() {
    const { project, maxMembers, price, date, members, isLoading, isError, mcid, toRemoveDate, clients, toEdit } = this.state
    return (
      <>
        <Breadcrumb>
          <Container>
            <Row>
              <Link to='/' className='breadcrumb-item'>Мастер-Классы</Link>
              <Breadcrumb.Item active>Изменить Мастер-Класс {project.name}</Breadcrumb.Item>
            </Row>
          </Container>
        </Breadcrumb>
          {
            isLoading
            ? <Container style={{ marginTop: '2rem' }}><Row>Загрузка данных...<Spinner animation="border" size="sm" /></Row></Container>
              : isError
              ? <Container style={{ marginTop: '2rem' }}><Row>Ошибка данных</Row></Container>
              :
              <>
              <Container style={{ marginTop: '2rem' }}>
                <Row>
                  <Col>
                    <h3>{project.name}</h3>
                    <h5><PatternedDate date={date} /> Цена: <b>{price}тг.</b></h5><br />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Взрослый</th>
                          <th>Ребёнок</th>
                          <th>Контактный телефон</th>
                          <th>Оплата</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          members.map((props, index) => (
                            <MasterClassMember
                              price={price}
                              number={index + 1}
                              {...props}
                              key={`member-number-${index}`}
                              onRemove={this.removeMember}
                              mcid={mcid}
                              onSuccess={this.refreshMembers}
                              members={members}/>
                          ))
                        }
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {
                      members.length < maxMembers
                        ? <Button variant="outline-dark" onClick={() => this.handleShow()}>+Добавить Участника</Button>
                        : 'Лимит участников достигнут. Если необходимо добавить ещё участника, измените параметры мастер-класса'
                    }
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p/>
                    <p>
                      <Link to={`/print/mc#mcid=${mcid}`} className='btn btn-outline-dark'>Распечатать Мастер-Класс</Link>
                    </p>
                    <FavoritesToMC data={clients} handleAdd={this.handleShow}/>
                  </Col>
                </Row>
              </Container>
              <Modal
                show={this.state.show}
                onHide={this.handleClose}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Добавить новых Участников</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <CreateMemberForm mcid={mcid} members={members} onSuccess={this.refreshMembers} toEdit={toEdit}/>
                </Modal.Body>
              </Modal>

              <Modal
                show={this.state.modalRemoveShow}
                onHide={this.modalHide}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                  <Modal.Title>Вы уверены, что хотите удалить этих участников с Мастер-Класса?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>
                    Родитель: {toRemoveDate.parent.fio}<br />
                    Ребёнок: {toRemoveDate.child.fio} {toRemoveDate.child.age} лет
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant='secondary' onClick={this.state.handleCancel}>Отмена</Button>
                  <Button variant='danger' onClick={this.state.handleConfirm}>Удалить</Button>
                </Modal.Footer>
              </Modal>
              </>
          }

      </>
    );
  }
}


class MasterClassMember extends Component {
  constructor(props) {
    super(props)
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.state = { show: false }
  }
  shouldComponentUpdate(nextProps, nextState) {
    let result = false
    const { number, parent, child, pay, mcid, price, onRemove } = this.props
    if (
      number !== nextProps.number ||
      parent !== nextProps.parent ||
      child !== nextProps.child ||
      pay !== nextProps.pay ||
      mcid !== nextProps.mcid ||
      price !== nextProps.price ||
      onRemove !== nextProps.onRemove
    ) result = true
    if (this.state.show !== nextState.show) result = true
    return result
  }

  handleClose() { this.setState({ show: false }) }
  handleShow() { this.setState({ show: true }) }
  getPayMethod(method) {
    switch (method) {
      case '': return
      case 'beznal': return 'Безнал'
      case 'nal': return 'Нал'
      default: return
    }
  }

  render() {
    const { number, parent, child, pay, price, onRemove, members, mcid, onSuccess } = this.props
    return (
      <>
        <tr>
          <td>{ number }</td>
          <td>{ typeof parent !== 'undefined' && parent.fio ? parent.fio : '' }</td>
          <td>{ child && child.empty ? child.fio : child.fio ? `${child.fio} ${child.age} лет` : ''}</td>
          <td>{ typeof parent !== 'undefined' ? parent.empty ? '-' : parent.phone ? parent.phone : '' : '' }</td>
          <td>{ pay && pay.status ? `${this.getPayMethod(pay.method)} ${price}тг.` : 'Нет' }</td>
          <td className='control_btns'>
            <ButtonToolbar>
              <Button variant="outline-secondary" onClick={this.handleShow}>Изменить</Button>
              <Button variant="outline-danger" onClick={() => onRemove(number - 1)}>Удалить</Button>
            </ButtonToolbar>
          </td>
        </tr>
        <MasterClassMemberModal
          mcid={mcid}
          onSuccess={() => {
            this.handleClose()
            onSuccess()
          }}
          members={members}
          show={this.state.show}
          handleClose={this.handleClose}
          toEdit={this.props}/>
      </>
    )
  }
}

function MasterClassMemberModal({ show, handleClose, mcid, toEdit, members, onSuccess }) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Изменить Участника</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CreateMemberForm mcid={mcid} onSuccess={onSuccess} edit={true} toEdit={toEdit} members={members}/>
      </Modal.Body>
    </Modal>
  )
}

function FavoritesToMC({ data, handleAdd}) {
  return (
    <div>
      <p />
      {
        data.length
          ?
          <>
            <p>Всего желающих посетить данный Мастер-Класс - <b>{data.length}</b></p>
            <p>Список желающих попасть на выбранный Мастер-Класс:</p>
            <Table style={{ fontSize: '1.25rem' }} responsive>
              <tbody>
                {
                  data.map(client => <tr key={`client-${client._id}`}>
                    <td>{client.fio}</td>
                    <td align='center'>{client.phone}</td>
                    <td align='right'><Button variant='outline-success' onClick={() => handleAdd({parent: client})}>Записать</Button></td>
                  </tr>)
                }
              </tbody>
            </Table>
          </>
          :
          <p>
            Желающих посетить данный Мастер-Класс <b>нет</b>
          </p>
      }
    </div>
  )
}

export default MasterClass
