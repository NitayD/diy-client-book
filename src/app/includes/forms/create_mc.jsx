import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'

import { toast } from 'react-toastify'
import DatePicker from 'react-datetime-picker'

import CreateProjectForm from './create_project'
import {
  createNewMC,
  creatingNewMC,
  createMCReset
} from '../../../actions/mc'
import config from '../../../api-config'

import PatternedDate from '../date'

class CreateMCForm extends Component {
  constructor(props) {
    super(props)
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.onChangeDate = this.onChangeDate.bind(this)
    this.modalHide = this.modalHide.bind(this)
    this.handleChangePrice = this.handleChangePrice.bind(this)
    this.handleChangeMaxMembers = this.handleChangeMaxMembers.bind(this)
    this.handleChangeProject = this.handleChangeProject.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    const today = new Date()
    today.setMinutes(0)
    today.setSeconds(0)
    today.setMilliseconds(0)
    this.state = {
      errors: [],
      modalConfirmShow: false,
      show: false,
      isLoading: true,
      isError: false,
      currentProject: {_id: ''},
      date: today,
      price: 2000,
      maxMembers: 15,
      handleCancel: () => {},
      handleConfirm: () => {},
      projects: [],
      clients: []
    };
  }
  componentDidMount() {
    this.props.createNewMC()
    this.modalHide()
    this.sendNotification('info', "Подгружаем список проектов...")
    axios.get(`${config.apiaddress}/projects/with_favorites`)
    .then(({ data }) => {
      if (!!this.props.mcid) {
        const { mcid } = this.props
        axios.get(`${config.apiaddress}/mc/get/${mcid}`)
          .then((result) => {
            if (!result.data.status) throw new Error('Ошибка на сервере')
            const { maxMembers, price, date, project } = result.data.data
            this.setState({
              isLoading: false,
              projects: data.projects,
              clients: data.clients,
              currentProject: project,
              price,
              maxMembers,
              date: new Date(date)
            })
            this.sendNotification('info', "Проекты загруженны")
          })
          .catch((err) => {
            console.log(err)
            this.sendNotification('warning', "Произошла ошибка во время загрузки данных Мастер-Класса")
            this.setState({ isLoading: false, isError: true })
          })
      } else {
        this.setState({ isLoading: false, projects: data.projects, clients: data.clients })
      }
    })
    .catch((err) => {
      this.sendNotification('warning', "Произошла ошибка во время загрузки списка проектов с сервера")
      this.sendNotification('info', "Обновите страницу")
      this.setState({ isLoading: false, isError: true })
    })
  }
  componentWillUpdate(props) { if (!props.status) this.props.createNewMC() }
  componentWillUnmount() { this.props.createMCReset() }

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
  onChangeDate(date) {
    this.setState({ date: date })
  }
  handleChangePrice({ target }) {
    const { value } = target
    const reg = /^\d+$/
    if (value.length > 0) {
      if (reg.test(value)) this.setState( { price: value[0] === '0' ? Number(value.substr(1)) : +value } )
      else return
    } else { this.setState( { price: 0 } ) }
  }
  handleChangeMaxMembers({ target }) {
    const { value } = target
    const reg = /^\d+$/
    if (value.length > 0) {
      if (reg.test(value)) this.setState( { maxMembers: value[0] === '0' ? Number(value.substr(1)) : +value } )
      else return
    } else { this.setState( { maxMembers: 0 } ) }
  }
  handleChangeProject({ target }) {
    const { value } = target
    this.setState( { currentProject: this.state.projects.find( project => project._id === value ) } )
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
    } catch (err) { console.error(err) }
  }
  
  async handleSubmit(e) {
    e.preventDefault()
    if (this.props.status !== 'start_creating') return this.sendNotification('warning', "Сейчас создание нового мастер-класса невозможно...")
    const { date, price, maxMembers, currentProject } = this.state
    if (currentProject.length === 0) return this.sendNotification('warning', "Вы не выбрали Проект")
    if (!date) return this.sendNotification('warning', "Вы не указали дату МК")
    if (typeof price !== 'number') return this.sendNotification('warning', "Ошибка в цене")
    if (typeof maxMembers !== 'number') return this.sendNotification('warning', "Ошибка в максимальном количестве участников")
    try { await this.modalShow() }
    catch {
      this.modalHide()
      return this.sendNotification('info', "Вы отменили создание мастер-класса")
    }
    this.modalHide()
    const result = {}
    result.date = date
    result.price = price
    result.project = currentProject
    result.maxMembers = maxMembers
    this.sendNotification('info', "Запрос на сервер...")
    if (!!this.props.mcid) {
      result.id = this.props.mcid
      try {
        const newMC = await axios.put(`${config.apiaddress}/mc/update`, result)
        if (newMC.status >= 200 && newMC.status < 300) {
          this.sendNotification('info', "Мастер-Класс обновлён")
        } else {
          this.sendNotification('danger', "Ошибка при обновлении Мастер-Класса")
        }
      } catch (error) {
        console.error(error)
      }
    } else {
      this.props.creatingNewMC(result)
    }
  }

  render() {
    const { projects, price, maxMembers, date, modalConfirmShow, currentProject, isLoading, isError, clients } = this.state
    const favorites = clients.filter(client => !!client.favoritesMC.find(i => i === currentProject._id))
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Label>Проект</Form.Label>
            <Form.Row>
              <Col>
                <Form.Control as="select" value={currentProject._id} onChange={this.handleChangeProject} disabled={isLoading}>
                  { !isLoading && <option style={{display:'none'}} value=''></option> }
                  {
                    isLoading
                      ? <option value=''>Загрузка данных с сервера...</option>
                      : isError
                        ? null
                        : projects.map(project => <ProjectsToMC {...project} key={`project-id=${project._id}`} />)
                  }
                </Form.Control>
              </Col>
              <Col xs='auto'>
                <Button
                  variant="outline-success"
                  onClick={this.handleShow}>
                  Добавить Проект
                </Button>
              </Col>
            </Form.Row>            
          </Form.Group>

          <Form.Group>
            <Form.Label>Цена</Form.Label>
            <Form.Control value={price} onChange={this.handleChangePrice} disabled={isLoading}/>
          </Form.Group>

          <Form.Group>
            <Form.Label>Максимум участников</Form.Label>
            <Form.Control value={maxMembers} onChange={this.handleChangeMaxMembers} disabled={isLoading}/>
          </Form.Group>

          <Form.Group>
            <Form.Label>Дата проведения</Form.Label>
            <Form.Row>
              <Col>
                <DatePicker
                  disabled={isLoading}
                  locale="kz-KZ"
                  maxDate={new Date(Date.now() * 2)}
                  onChange={this.onChangeDate}
                  value={date} />
              </Col>
              <style>{`
                .react-datetime-picker {
                  display: block;
                  height: calc(1.5em + .75rem + 2px);
                  padding: .375rem .75rem;
                  font-size: 1rem;
                  font-weight: 400;
                  line-height: 1.5;
                  color: #495057;
                  background-color: #fff;
                  background-clip: padding-box;
                  border: 1px solid #ced4da;
                  border-radius: .25rem;
                  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
                }
                .react-datetime-picker__wrapper { border: none; }
              `}
              </style>
            </Form.Row>
          </Form.Group>
          <Button variant="success" type="submit" disabled={isLoading}>
            { this.props.mcid ? 'Изменить' : 'Добавить' } Мастер-Класс
          </Button>
          { currentProject._id.length === 24 && <FavoritesToMC data={favorites}/> }
        </Form>

        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Добавить новый Проект</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CreateProjectForm onSuccess={this.componentDidMount.bind(this)}/>
          </Modal.Body>
        </Modal>


        <Modal
          show={modalConfirmShow}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={this.state.handleCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Подтвердите правильность введённых вами данных</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Выбранный проект: <b>{currentProject.name}</b><br />
              Дата проведения: <PatternedDate date={date} /><br />
              Максимальное количество участников: <b>{maxMembers}</b> человек<br />
              Цена <b>{price}тг.</b><br />
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.state.handleCancel}>
              Отмена
            </Button>
            <Button variant="success" onClick={this.state.handleConfirm}>
              {this.props.mcid ? 'Изменить' : 'Добавить'} Проект
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}

function ProjectsToMC({ name, _id }) {
  return (
    <option value={_id}>{name}</option>
  )
}

function FavoritesToMC({ data }) {
  return (
    <div>
      <p />
      {
        data.length
        ?
        <>
          <p>Всего желающих посетить данный Мастер-Класс - <b>{data.length}</b></p>
          <p>Этот список будет отображаться на странице этого Мастер-Класса, после его создания</p>
          <p>Список желающих попасть на выбранный Мастер-Класс:</p>
          <Table>
            <tbody>
              {
                data.map(client => <tr key={`client-${client._id}`}>
                  <td>{client.fio}</td>
                  <td>{client.phone}</td>
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

function mapStateToProps({ mc }) {
  return { ...mc }
}

export default connect(mapStateToProps, {
  createNewMC,
  creatingNewMC,
  createMCReset
})(CreateMCForm)
