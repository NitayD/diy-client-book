import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../../api-config'
import { toast } from 'react-toastify'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'

import PatternedDate from '../includes/date'

const getWeek = function (date) {
  let dt = new Date(date)
  var onejan = new Date(dt.getFullYear(), 0, 1)
  return Math.ceil((((dt - onejan) / 86400000) + onejan.getDay() + 1) / 7)
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

class Main extends Component {
  constructor() {
    super()
    this.state = {
      data: [],
      isLoading: true,
      isError: false,
      handleCancel: () => { },
      handleConfirm: () => { },
      modalRemoveShow: false,
      toRemoveDate: {}
    }
    this.removeMC = this.removeMC.bind(this)
  }

  componentDidMount() {
    axios.get(`${config.apiaddress}/mc/old`)
      .then(({ status, data }) => {
        if (status >= 200 && status < 300) {
          this.setState({ isLoading: false, data: this.filterMasterClasses(data.data) })
        } else {
          this.setState({ isLoading: false, isError: true })
        }
      })
      .catch((err) => {
        console.error(err)
        this.setState({ isLoading: false, isError: true })
      })
  }
  modalShow(project, date) {
    return new Promise((resolve, reject) => {
      this.setState({
        modalRemoveShow: true,
        toRemoveDate: {
          project, date
        },
        handleConfirm: resolve,
        handleCancel: reject
      })
    })
  }
  modalHide() {
    this.setState({
      modalRemoveShow: false,
      toRemoveDate: {},
      handleConfirm: () => { },
      handleCancel: () => { }
    })
  }

  filterMasterClasses(unSortedData) {
    const result = {}
    const data = unSortedData.sort(this.sortByDate)
    data.forEach(mc => {
      const date = new Date(mc.date)
      const shortDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
      const dateWeek = `${getWeek(date)}-${date.getFullYear()}`
      result[dateWeek] = result[dateWeek] ? result[dateWeek] : {}
      result[dateWeek][shortDate] = result[dateWeek][shortDate] ? [...result[dateWeek][shortDate], mc] : [mc]
    })
    return result
  }

  sortByDate(time1, time2) {
    const time1ms = new Date(time1.date).getTime()
    const time2ms = new Date(time2.date).getTime()
    if (time1ms > time2ms) return 1
    else if (time1ms < time2ms) return -1
    else return 0
  }

  async removeMC(id, { name }, date) {
    try { await this.modalShow(name, date) }
    catch {
      this.modalHide()
      return sendNotification('info', "Вы отменили удаление создание мастер-класса")
    }
    this.modalHide()
    try {
      const result = await axios.delete(`${config.apiaddress}/mc/delete/${id}`)
      const { status } = result
      if (status >= 200 && status < 300) {
        sendNotification('success', `Вы успешно удалили ${name}`)
        const removedDate = new Date(date)
        const shortDate = `${removedDate.getDate()}-${removedDate.getMonth()}-${removedDate.getFullYear()}`
        const dateWeek = `${getWeek(removedDate)}-${removedDate.getFullYear()}`
        let mcs = { ...this.state.data }
        const indexItem = mcs[dateWeek][shortDate].findIndex(mc => mc._id === id)
        delete mcs[dateWeek][shortDate][indexItem]
        mcs[dateWeek][shortDate] = mcs[dateWeek][shortDate].filter(item => !!item)
        if (mcs[dateWeek][shortDate].length === 0) delete mcs[dateWeek][shortDate]
        if (Object.keys(mcs[dateWeek]).length === 0) delete mcs[dateWeek]
        this.setState({ date: mcs })
      } else {
        sendNotification('danger', `Ошибка при удалении ${name}`)
      }
    } catch (error) {
      sendNotification('danger', `Ошибка при удалении ${name}`)
      console.error(error)
    }
  }

  render() {
    const { data, isLoading, isError, toRemoveDate } = this.state
    return (
      <>
        <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <Row>
            <Col>
              <Link to='/create/mc' className='btn btn-outline-dark'>+Добавить Мастер-Класс</Link>
            </Col>
          </Row>
          {
            isLoading
              ? <Spinner animation="border" />
              : isError
                ? 'Произошла ошибка при загрузке данных'
                : Object.keys(data).map((week, ind) => <div key={`mc-${week}-${ind}`}>
                  {
                    Object.keys(data[week]).map((day, ind2) =>
                      <MasterClassDay
                        onRemove={this.removeMC}
                        key={`mc-${data[week][day].date}-${ind2}`}
                        data={data[week][day]}
                        date={data[week][day][0].date} />)
                  }
                  {
                    Object.keys(data).length - 1 !== ind
                      ?
                      <>
                        <hr />
                        <hr />
                        <hr />
                      </>
                      : null
                  }
                </div>)
          }
          <Row>
            <Col>
              <Link to='/create/mc' className='btn btn-outline-dark'>+Добавить Мастер-Класс</Link>
            </Col>
          </Row>
        </Container>


        <Modal
          show={this.state.modalRemoveShow}
          onHide={this.handleClose}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered>
          <Modal.Header closeButton>
            <Modal.Title>Вы уверены, что хотите удалить данный Мастер-Класс?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Проект: {toRemoveDate.project}<br />
              Дата: <PatternedDate date={toRemoveDate.date} />
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

class MasterClassDay extends Component {
  render() {
    const { data, date, onRemove } = this.props
    return (
      <Row>
        <Col>
          <h5 style={{ marginTop: '2vh' }}><PatternedDate date={date} format='short' /></h5>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Проект</th>
                <th>Время</th>
                <th>Участников/Максимум</th>
                <th>Цена</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {
                data.map(mc => <MasterClassItem {...mc} key={`master-class-${mc._id}`} onRemove={onRemove} />)
              }
            </tbody>
          </Table>
        </Col>
      </Row>
    )
  }
}

class MasterClassItem extends Component {
  render() {
    const { project, date, members, maxMembers, price, _id, onRemove } = this.props
    return (
      <tr>
        <td>{project.name}</td>
        <td><PatternedDate date={date} format='time' /></td>
        <td>{members.length} / {maxMembers}{members.length >= maxMembers ? ' Max' : null}</td>
        <td>{price}тг.</td>
        <td className=' control_btns'>
          <ButtonToolbar>
            <Link to={`/mc#mcid=${_id}`} className='btn btn-outline-success'>Открыть</Link>
            <Link to={`/edit/mc#mcid=${_id}`} className='btn btn-outline-secondary'>Изменить</Link>
            <Button variant="outline-danger" onClick={() => onRemove(_id, project, date)}>Удалить</Button>
          </ButtonToolbar>
        </td>
      </tr>
    )
  }
}

export default Main;
