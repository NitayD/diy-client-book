import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'

import {
  createNewClient,
  creatingNewClient,
  createResetClient,
} from '../../../actions/client'

class CreateClientForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fio: '',
      phone: '',
      modalConfirmShow: false,
      handleConfirm: () => { },
      handleCancel: () => { }
    }
    this.modalShow = this.modalShow.bind(this)
    this.modalHide = this.modalHide.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount() { this.props.createNewClient() }
  componentWillUpdate(props) { if (!props.status) this.props.createNewClient() }
  componentWillUnmount() { this.props.createResetClient() }

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
      case 'phone':
        if (val.length) {
          if ((String(val)).replace(/\D/g, '').length > 10) return
          else if (!Number.isNaN(+val[val.length - 1]) || /(-|\.|\(|\)| )/.test(val[val.length - 1])) return this.setState({ phone: this.formatPhoneNumber(val) })
        } else {
          return this.setState({ phone: '' })
        }
        return
      default: return
    }
  }

  formatPhoneNumber(s) {
    const s2 = (String(s)).replace(/\D/g, '')
    const m = s2.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/)
    return (!m) ? s : `(${m[1]}) ${m[2]}-${m[3]}-${m[4]}`
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

  async handleSubmit(e) {
    e.preventDefault()
    if (this.props.status !== 'start_creating') return this.sendNotification('warning', "Сейчас добавить нового взрослого невозможно...")
    const { fio, phone } = this.state
    if (fio.length < 3) return this.sendNotification('warning', "Имя слишком короткое")
    if (fio.length > 30) return this.sendNotification('warning', "Имя слишком длинное")
    if ((String(phone)).replace(/\D/g, '').length !== 10) return this.sendNotification('warning', "Телефон не соответствует формату\n+7 (XXX) XXX-XX-XX")
    try { await this.modalShow() }
    catch {
      this.modalHide()
      return this.sendNotification('info', "Вы отменили создание нового взрослого")
    }
    this.modalHide()
    const result = { fio, phone: `+7 ${phone}` }    
    this.sendNotification('info', "Запрос на сервер...")
    this.props.creatingNewClient(result, this.props.onSuccess)
  }

  render() {
    const { fio, phone } = this.state
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Имя и фамилия взрослого*</Form.Label>
            <Form.Control
              required
              value={fio}
              onChange={({ target }) => this.handleChange('fio', target.value)}
              type="text"
              placeholder="Вводите фамилию и имя..." />
            <Form.Text className="text-muted">
              Например "Иванов Григорий"
            </Form.Text>
          </Form.Group>
          
          <Form.Group>
            <Form.Label>Сотовый номер*</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id="kz-number">+7</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                aria-describedby="kz-number"
                required
                value={phone}
                onChange={({ target }) => this.handleChange('phone', target.value)}
                type="text"
                placeholder="Вводите номер..." />
            </InputGroup>
            <Form.Text className="text-muted">
              Например "+7 (777) 777-77-77"
            </Form.Text>
          </Form.Group>
          <Button variant="success" type="submit">
            Добавить Взрослого
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
              Номер : <b>+7 {phone}"</b><br />
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button autoFocus variant="secondary" onClick={this.state.handleCancel}>
              Отмена
            </Button>
            <form onSubmit={this.state.handleConfirm}>
              <Button type='submit' variant="success" onClick={this.state.handleConfirm}>
                Добавить Проект
              </Button>
            </form>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = ({ client }) => {
  const { status } = client
  return {
    status
  }
}

export default connect(mapStateToProps, {
  createNewClient,
  creatingNewClient,
  createResetClient,
})(CreateClientForm)
