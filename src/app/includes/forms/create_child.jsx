import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'

import {
  createNewChild,
  creatingNewChild,
  createResetChild,
} from '../../../actions/children'

class CreateClientForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fio: '',
      age: 7,
      modalConfirmShow: false,
      handleConfirm: () => { },
      handleCancel: () => { }
    }
    this.modalShow = this.modalShow.bind(this)
    this.modalHide = this.modalHide.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount() { this.props.createNewChild() }
  componentWillUpdate(props) { if (!props.status) this.props.createNewChild() }
  componentWillUnmount() { this.props.createResetChild() }

  modalShow() {
    return new Promise((resolve, reject) => {
      this.setState({
        modalConfirmShow: true,
        handleConfirm: (e) => {
          e.preventDefault()
          resolve()
        },
        handleCancel: reject
      })
    })
  }
  modalHide() { this.setState({ modalConfirmShow: false, handleConfirm: () => { }, handleCancel: () => { } }) }

  handleChange(attr, val) {
    switch (attr) {
      case 'fio': return this.setState({ fio: val })
      case 'age': return !Number.isNaN(+val) ? this.setState({ age: +val }) : null
      default: return
    }
  }

  sendNotification(type = 'info', text = '') {
    try {
      toast[type](text, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error(err)
    }
  }

  async handleSubmit(e) {
    e.preventDefault()
    if (this.props.status !== 'start_creating') return this.sendNotification('warning', "Сейчас добавить нового ребёнка невозможно...")
    const { fio, age } = this.state
    if (fio.length < 3) return this.sendNotification('warning', "Имя слишком короткое")
    if (fio.length > 30) return this.sendNotification('warning', "Имя слишком длинное")
    try { await this.modalShow() }
    catch {
      this.modalHide()
      return this.sendNotification('info', "Вы отменили создание нового взрослого")
    }
    this.modalHide()
    const result = { fio, age }
    this.sendNotification('info', "Запрос на сервер...")
    this.props.creatingNewChild(result, this.props.onSuccess)
  }

  render() {
    const { fio, age } = this.state
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Имя и фамилия ребёнка*</Form.Label>
            <Form.Control
              required
              value={fio}
              onChange={({ target }) => this.handleChange('fio', target.value)}
              type="text"
              placeholder="Вводите фамилию и имя..." />
            <Form.Text className="text-muted">
              Например "Лёша"
            </Form.Text>
          </Form.Group>

          <Form.Group>
            <Form.Label>Возраст*</Form.Label>
            <Form.Control
              required
              value={age}
              onChange={({ target }) => this.handleChange('age', target.value)}
              type="number"
              placeholder="Вводите возраст..." />
          </Form.Group>
          <Button variant="success" type="submit">
            Добавить Ребёнка
          </Button>
        </Form>

        <Modal
          show={this.state.modalConfirmShow}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={this.state.handleCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Подтвердите правильность введённых вами данных</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Имя : <b>{fio}</b><br />
              Возраст : <b>{age}</b> лет<br />
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button autoFocus variant="secondary" onClick={this.state.handleCancel}>
              Отмена
            </Button>
            <form onSubmit={this.state.handleConfirm}>
              <Button type='submit' variant="success" onClick={this.state.handleConfirm}>
                Добавить Ребёнка
              </Button>
            </form>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = ({ children }) => {
  const { status } = children
  return {
    status
  }
}

export default connect(mapStateToProps, {
  createNewChild,
  creatingNewChild,
  createResetChild,
})(CreateClientForm)
