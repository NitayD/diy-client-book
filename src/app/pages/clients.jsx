import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../../api-config'
import { toast } from 'react-toastify'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import InputGroup from 'react-bootstrap/InputGroup'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Modal from 'react-bootstrap/Modal'

const diff = function (a1, a2) {
  return a1.filter(i => !a2.includes(i))
    .concat(a2.filter(i => !a1.includes(i)))
}

function sendNotification(type = 'info', text = '') {
  try {
    toast[type](text, {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  } catch (err) { console.error(err) }
}

class Clients extends Component {
  constructor() {
    super()
    this.state = {
      all: [],
      data: [],
      queryName: '',
      queryPhone: '',
      isLoading: true,
      isError: false,
      handleCancel: () => { },
      handleConfirm: () => { },
      modalRemoveShow: false,
      removeDate: {
        id: '',
        fio: ''
      },
    }
    this.remove = this.remove.bind(this)
    this.refresh = this.refresh.bind(this)
    this.modalHide = this.modalHide.bind(this)
  }

  componentDidMount(showModal) {
    axios.get(`${config.apiaddress}/clients`)
      .then(({ status, data }) => {
        if (status >= 200 && status < 300) {
          const id = window.location.parseHash().id
          const sorted = data.data.sort(function (a, b) {
            const nameA = a.fio.toLowerCase()
            const nameB = b.fio.toLowerCase()
            if (nameA > nameB) return 1
            if (nameA < nameB) return -1
            return 0
          })
          this.setState({
            isLoading: false, all: data.data, data: sorted, modalShow: !!id && !showModal, showDate: !showModal ? sorted.find(item => item._id === id) : {} })
        } else {
          this.setState({ isLoading: false, isError: true })
        }
      })
      .catch((err) => {
        console.error(err)
        this.setState({ isLoading: false, isError: true })
      })
  }
  modalShow(type, data) {
    switch (type) {
      case 'info':
        return new Promise((resolve, reject) => {
          this.setState({
            modalShow: true,
            showDate: data,
            handleConfirm: resolve,
            handleCancel: reject
          })
        })
      case 'remove': return new Promise((resolve, reject) => {
        this.setState({
          modalRemoveShow: true,
          showDate: data,
          handleConfirm: resolve,
          handleCancel: reject
        })
      })
      default: return
    }
  }
  modalHide() {
    this.setState({
      modalShow: false,
      modalRemoveShow: false,
      toRemoveDate: {},
      showDate: {},
      handleConfirm: () => {},
      handleCancel: () => {}
    })
  }

  async remove({ _id, fio }, index) {
    try { await this.modalShow({ _id, fio }) }
    catch {
      this.modalHide()
      return sendNotification('info', `Вы отменили удаление ${fio}`)
    }
    this.modalHide()
    try {
      const result = await axios.delete(`${config.apiaddress}/clients/delete/${_id}`)
      const { status } = result
      if (status >= 200 && status < 300) {
        sendNotification('success', `Вы успешно удалили ${fio}`)
        let newData = [...this.state.data]
        delete newData[index]
        newData = newData.filter(it => !!it)
        console.log(newData, this.state.data, index)
        this.setState({ date: newData }, console.log(this.state))
      } else {
        sendNotification('danger', `Ошибка при удалении ${fio}`)
      }
    } catch (error) {
      sendNotification('danger', `Ошибка при удалении ${fio}`)
      console.error(error)
    }
  }

  findBy(type, val) {
    switch (type) {
      case 'name': return this.setState({ queryName: val })
      case 'phone': return this.setState({ queryPhone: val })
      default: return
    }
  }

  refresh(type, data) {
    switch (type) {
      case 'local': return this.setState({ all: data, data: data }, () => console.log(this.state))
      case 'reload': return this.componentDidMount(true)
      default: return true
    }
  }

  render() {
    const { data, isLoading, isError, removeDate, queryName, queryPhone } = this.state
    return (
      <>
        <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <Row>
            <Col>
              <Form.Control
                placeholder="Начните вводить имя или фамилию..."
                value={queryName}
                onChange={(({ target }) => this.findBy('name', target.value))}
              />
              <br/>
              <Form.Control
                placeholder="Начните вводить номер..."
                value={queryPhone}
                onChange={(({ target }) => this.findBy('phone', target.value))}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Table striped bordered hover style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                <thead>
                  <tr>
                    <th>ФИО</th>
                    <th>Телефон</th>
                    <th>Связанные дети</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isLoading
                      ? <tr><td>Загрузка</td></tr>
                      : isError
                        ? <tr><td>Произошла ошибка при загрузке данных</td></tr>
                        : data
                          .filter(item => ~item.fio.search(new RegExp(queryName, 'i')) &&
                            ~item.phone.search(new RegExp(queryPhone, 'i')))
                          .map((client, ind) =>
                          <ClientItem
                            index={ind}
                            refresh={this.refresh}
                            onRemove={this.remove}
                            key={`mc-${client.fio}-${ind}`}
                            all={data}
                            data={client}/>)
                  }
                </tbody>
              </Table>
            </Col>
          </Row>

          <Row>
            <Col>
              <Button variant="outline-dark">+Добавить Взрослого</Button>
            </Col>
          </Row>
        </Container>

        <Modal
          show={this.state.modalRemoveShow}
          onHide={this.modalHide}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered>
          <Modal.Header closeButton>
            <Modal.Title>Вы уверены, что хотите удалить данного Взрослого?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <b>ВНИМАНИЕ!</b><br />
              На всех мастерклассах, на которых учавствовал {removeDate.fio}, вместо него в списке будет отображаться текст "Взрослый удалён, или не существует"
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={this.state.handleCancel}>Отмена</Button>
            <Button variant='danger' onClick={this.state.handleConfirm}>Удалить</Button>
          </Modal.Footer>
        </Modal>


      </>
    );
  }
}

class ClientItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isChange: false
    }
    this.saveClient = this.saveClient.bind(this)
  }
  handleChange(type, val) {
    switch (type) {
      case 'modal': return this.setState((oldState, oldProps) => ({ isChange: !oldState.isChange }))
      default: return
    }
  }
  saveClient(newData) {
    const all = this.props.all.map(client => {
      if (client._id === this.props.data._id) {
        return { ...client, ...newData }
      } else {
        return client
      }
    })
    this.props.refresh('local', all)
  }
  render() {
    const { onRemove, data, index } = this.props
    const { childrens, _id, fio, phone } = data
    const { isChange } = this.state
    return (
      <tr>
        <td>{fio}</td>
        <td>{phone}</td>
        <td>{childrens.map((child, order) => (
          <Fragment key={`child-${order}-${index}`}>{child.fio} {child.age} лет<br /></Fragment>
        ))}</td>
        <td className='control_btns'>
          <ButtonToolbar>
            <Link
              to={`/clients#id=${_id}`}
              className='btn btn-outline-success'
              onClick={() => this.handleChange('modal', true)}>
              Открыть
            </Link>
            <Button variant="outline-danger" onClick={() => onRemove(this.props.data, index)}>Удалить</Button>
          </ButtonToolbar>
          {isChange ? <ClientInfoModal show={true} onHide={() => this.handleChange('modal')} data={this.props.data} save={this.saveClient}/> : null }
        </td>
      </tr>
    )
  }
}

class ClientInfoModal extends Component {
  constructor(props) {
    super(props)
    const { fio = '', phone = '', childrens = [], family = [], favoritesMC = [], completeMC = [], _id } = props.data
    this.state = {
      _id,
      fio,
      phone: phone.slice(3),
      childrens,
      family,
      favoritesMC,
      completeMC
    }
    this.handleSave = this.handleSave.bind(this)
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { fio = '', phone = '', childrens = [], family = [], favoritesMC = [], completeMC = [], _id } = nextProps.data
    const { state } = this
    let update = false
    if (fio !== state.fio ||
      phone.slice(3) !== state.phone ||
      diff(childrens, state.childrens).length ||
      diff(family, state.family).length ||
      diff(favoritesMC, state.favoritesMC).length ||
      diff(completeMC, state.completeMC).length ||
      _id !== state._id) update = true
    if (state.fio !== nextState.fio ||
      state.phone !== nextState.phone) update = true
    return update
  }
  componentWillUpdate(nextProps, nextState) {
    const { fio = '', phone = '', childrens = [], family = [], favoritesMC = [], completeMC = [], _id } = nextProps.data
    if (nextProps.data.fio !== this.props.data.fio ||
      nextProps.data.phone !== this.props.data.phone ||
      diff(nextProps.data.childrens, this.props.data.childrens).length ||
      diff(nextProps.data.family, this.props.data.family).length ||
      diff(nextProps.data.favoritesMC, this.props.data.favoritesMC).length ||
      diff(nextProps.data.completeMC, this.props.data.completeMC).length ||
      nextProps.data._id !== this.props.data._id) this.setState({
        _id,
        fio,
        phone: phone.slice(3),
        childrens,
        family,
        favoritesMC,
        completeMC
      })
    
  }
  formatPhoneNumber(s) {
    const s2 = (String(s)).replace(/\D/g, '')
    const m = s2.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/)
    return (!m) ? s : `(${m[1]}) ${m[2]}-${m[3]}-${m[4]}`
  }
  handleChange(type, val) {
    switch (type) {
      case 'modal': return this.setState((oldState, oldProps) => ({ isChange: !oldState.isChange }))
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
  handleRemove(id) {
    const { favoritesMC, _id } = this.state
    const favoritesFiltered = favoritesMC.filter(mc => mc._id !== id)
    const toServer = favoritesFiltered.map(mc => mc._id)
    axios.put(`${config.apiaddress}/clients/update`, { _id: _id, favoritesMC: toServer })
      .then(() => {
        this.props.save({ _id: _id, favoritesMC: favoritesFiltered })
        sendNotification('success', 'Пожелание успешло удалено')
      })
      .catch(() => {
        sendNotification('warning', 'Произошла ошибка при удалении пожелания')
      })
  }
  handleSave() {
    const { phone, fio, _id } = this.state
    if (fio.length <= 3) return sendNotification('warning', "Слишком короткое ФИО")
    if (fio.length >= 30) return sendNotification('warning', "Слишком длинное ФИО")
    if ((String(phone)).replace(/\D/g, '').length !== 10) return sendNotification('warning', "Телефон не соответствует формату\n+7 (XXX) XXX-XX-XX")
    sendNotification('info', "Отправка данных на сервер...")
    axios.put(`${config.apiaddress}/clients/update`, { _id: _id, phone: `+7 ${phone}`, fio })
      .then(() => {
        this.props.save({ ...this.state, phone: `+7 ${phone}` })
        sendNotification('success', `Данные ${fio} успешно обновленны`)
      })
      .catch(() => {
        sendNotification('warning', 'Произошла ошибка при обновлении данных')
      })
  }
  render() {
    const { onHide, save } = this.props
    const { fio, phone, childrens, family, favoritesMC, completeMC, _id } = this.state
    return (
      <Modal
        show={true}
        onHide={onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Данные о {fio}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>ФИО: </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control value={fio} onChange={({ target }) => this.handleChange('fio', target.value)}/>
            </InputGroup>
            <br/>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Телефон: </InputGroup.Text>
              </InputGroup.Prepend>
              <InputGroup.Prepend>
                <InputGroup.Text>+7 </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control value={phone} onChange={({ target }) => this.handleChange('phone', target.value)}/>
            </InputGroup>
            Связанные дети: {childrens.length > 0 ? childrens.map(child => child) : 'Нет прикрепленных детей'}<br />
            Связанные взрослые: {family.length > 0 ? family.map(parent => parent) : 'Нет прикрепленных взрослых'}
            <hr />
            Желает посетить: 
              <Table className='proj-table'>
              <style>{`
                  .proj-table tbody {
                    max-height: 300px;
                    overflow-y: auto;
                    display: block;
                  }
                  .proj-table td:first-child {
                    min-width: 150px;
                    display: block;
                  }
                `}</style>
                <tbody>
                  {
                    favoritesMC.length > 0
                      ? favoritesMC.map((mc, ind) =>
                        <tr key={`mc-id-${mc._id}-${ind}`}>
                          <td>{mc.name}</td>
                          <td>
                            <button type="button" className="close" onClick={() => this.handleRemove(mc._id)}>
                              <span aria-hidden="true">×</span>
                              <span className="sr-only">Удалить</span>
                            </button>
                          </td>
                        </tr>)
                      : <tr><td>Данный клиент ещё не оставлял своих пожеланий</td></tr>
                  }
                </tbody>
              </Table>
            <br /><br />
            <ProjectList clientid={_id} favorites={favoritesMC} save={save}/>
            <hr />
            Посещённые мастер-классы: {completeMC.length > 0 ? completeMC.map((mc, ind) => <Fragment key={`mc-id-${mc._id}-${ind}`}><br />{mc.name}</Fragment>) : 'Данный клиент ещё не посещал никаких мастер-классов'}
            <hr/>
            <div>Чтобы записать этого человека на мастер-класс, выполните следующие действия:
              <br /><br />
              <ol>
                <li>Откройте <Link to='/' className='alert-link'>список мастер-классов⤴</Link></li>
                <li>Выберите нужный вам МК</li>
                <li>Нажмите кнопку "Добавить Участника"</li>
                <li>Выберите из списка взрослых этого взрослого (Можно найти его в поиске)</li>
              </ol>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={onHide}>Отмена</Button>
          <Button variant='success' onClick={this.handleSave}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

class ProjectList extends Component {
  constructor (props) {
    super()
    this.state = {
      isLoading: true,
      isError: false,
      projects: [],
      currentProj: ''
    }
    this.handleAdd = this.handleAdd.bind(this)
  }
  componentDidMount() {
    axios.get(`${config.apiaddress}/projects`)
      .then(({ data }) => {
        this.setState({ isLoading: false, projects: data })
      })
      .catch((err) => {
        this.setState({ isLoading: false, isError: true })
      })
  }
  handleAdd() {
    const { currentProj, projects } = this.state
    const { clientid, favorites } = this.props
    if (currentProj.length !== 24) return sendNotification('warning', 'Некорректный ID проекта')
    if (clientid.length !== 24) return sendNotification('warning', 'Некорректный ID взрослого')
    const favoritesFiltered = favorites.map(mc => mc._id)
    const fv = [...favoritesFiltered, currentProj]
    axios.put(`${config.apiaddress}/clients/update`, { _id: clientid, favoritesMC: fv })
      .then(() => {
        this.props.save({ _id: clientid, favoritesMC: [...favorites, projects.find(proj => proj._id === currentProj)] })
        sendNotification('success', 'Пожелание успешло добавленно')
      })
      .catch(() => {
        sendNotification('warning', 'Произошла ошибка при добавлении пожелания')
      })
  }
  render() {
    const { currentProj, isLoading, isError, projects } = this.state
    const filteredProjects = projects.filter(proj => {
      return !this.props.favorites.find(pr => {
        return pr._id === proj._id
      })
    })
    return (
      <>
        {
          isLoading
            ? <><Spinner animation="border" size="sm"/>  Подгружаем список проектов...</>
            : isError
              ? 'При загрузке проектов произошла ошибка'
              : <InputGroup>
                  <Form.Control as='select' value={currentProj} onChange={({ target }) => this.setState({currentProj: target.value})}>
                    <option value='' className='d-none'>-- Выберите проект --</option>
                  {filteredProjects.length === 0 && <option value=''>-- Все существующие проекты уже добалены в список пожеланий --</option>}
                  {filteredProjects.map(project => <option value={project._id} key={`project-key-${project._id}`}>{ project.name }</option> ) }
                  </Form.Control>
                  <InputGroup.Append>
                    <Button variant='primary' onClick={this.handleAdd}>Добавить Пожелание</Button>
                  </InputGroup.Append>
                </InputGroup>
        }
      </>
    )
  }
}

export default Clients
