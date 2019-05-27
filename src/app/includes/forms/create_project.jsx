import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import Figure from 'react-bootstrap/Figure'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'

import {
  createNewProject,
  creatingNewProject,
  createResetProject,
} from '../../../actions/projects'

async function imageExists(url) {
  try {
    let promise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject({
        message: 'Превышено время ожидания изображения',
        status: false
      }), 4000);
      const img = new Image()
      img.onload = () => {
        clearTimeout(timeout)
        resolve({ status: true })
      }
      img.onerror = () => {
        clearTimeout(timeout)
        reject({
          message: 'Не корректная ссылка на Изображение',
          status: false
        })
      }
      img.src = url
    })
    return await promise
  } catch (err) {
    return err
  }
}

class CreateProjectForm extends Component {
  constructor() {
    super()
    this.state = {
      name: '',
      imageLink: '',
      modalConfirmShow: false,
      handleConfirm: () => {},
      handleCancel: () => {}
    }
    this.modalShow = this.modalShow.bind(this)
    this.modalHide = this.modalHide.bind(this)

    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleChangeImageLink = this.handleChangeImageLink.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount() { this.props.createNewProject() }
  componentWillUpdate(props, state) { if (!props.status) this.props.createNewProject() }
  componentWillUnmount() { this.props.createResetProject() }

  modalShow() {
    return new Promise((resolve, reject) => {
      this.setState({
        modalConfirmShow: true,
        handleConfirm: resolve,
        handleCancel: reject
      })
    })
  }
  modalHide() { this.setState( { modalConfirmShow: false, handleConfirm: () => {}, handleCancel: () => {} } ) }

  handleChangeName({ target }) {
    const { value } = target
    this.setState({ name: value })
  }
  handleChangeImageLink({ target }) {
    const { value } = target
    this.setState({ imageLink: value })
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
    if (this.props.status !== 'start_creating') return this.sendNotification('warning', "Сейчас создание нового проекта невозможно...")
    try { await this.modalShow() }
    catch {
      this.modalHide()
      return this.sendNotification('info', "Вы отменили создание Проекта")
    }
    this.modalHide()
    const result = {}
    const { name, imageLink } = this.state

    if (name.length < 3) return this.sendNotification('warning', "Название Проекта слишком короткое")
    if (name.length > 30) return this.sendNotification('warning', "Название Проекта слишком длинное")
    result.name = name
    if (imageLink.length > 0) {
      const imgResult = await imageExists(imageLink)
      if (!imgResult.status)
        return this.sendNotification('warning', imgResult.message)
    }
    result.imageLink = imageLink
    this.sendNotification('info', "Запрос на сервер...")
    this.props.creatingNewProject(result, this.props.onSuccess)
  }

  render() {
    const { name, imageLink } = this.state
    return (
      <>
        <Form onSubmit={ this.handleSubmit }>
          <Form.Group controlId="name">
            <Form.Label>Название Проекта*</Form.Label>
            <Form.Control
              required
              value={name}
              onChange={this.handleChangeName}
              type="text"
              placeholder="Вводите название..."/>
            <Form.Text className="text-muted">
              Например "Скворечник"
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="imageLink">
            <Form.Label>Ссылка на Изображение</Form.Label>
            <Form.Control
              value={imageLink}
              onChange={this.handleChangeImageLink}
              type="text"
              placeholder="Вводите ссылку... (Необязательно)"/>
            <Form.Text className="text-muted">
              Ссылка должна быть прямой до изображения (загрузка на сервер ещё не реализованна)
            </Form.Text>
          </Form.Group>
          <Button variant="success" type="submit">
            Добавить Проект
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
              Название проекта: <b>"{ this.state.name }"</b>
            </p>
            {
              this.state.imageLink.length > 0
              ? <>
                  <b>Ссылка на изображение:</b><br/>
                  <Figure>
                    <Figure.Image
                      alt={this.state.imageLink}
                      src={this.state.imageLink}
                    />
                  </Figure>
                </>
              : <b>Вы не добавляли изображение</b>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.state.handleCancel}>
              Отмена
            </Button>
            <Button variant="success" onClick={this.state.handleConfirm}>
              Добавить Проект
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = ({ projects }) => {
  const { status } = projects
  return {
    status
  }
}

export default connect(mapStateToProps, {
  createNewProject,
  creatingNewProject,
  createResetProject,
})(CreateProjectForm)
