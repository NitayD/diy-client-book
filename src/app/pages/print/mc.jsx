import React, { Component } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

import config from '../../../api-config'
import PatternedDate from '../../includes/date'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'

class MasterClass extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      isError: false,
      maxMembers: 0,
      price: false,
      date: 0,
      project: {
        name: ''
      },
      members: [],
      mcid: window.location.parseHash().mcid
    }
  }
  componentDidMount() {
    axios.get(`${config.apiaddress}/mc/get/${this.state.mcid}`)
      .then((result) => {
        const { status, data, favorites } = result.data
        if (status) {
          const { members, maxMembers, price, date, project } = data
          this.setState({ members, maxMembers, price, date, project, isLoading: false, clients: favorites.data })
        } else {
          this.setState({ isLoading: false, isError: true })
        }
      })
      .catch((error) => {
        console.log(error)
        this.setState({ isLoading: false, isError: true })
      })
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
  render() {
    const { project, maxMembers, price, date, members, isLoading, isError } = this.state
    return (
      <>
        <style>{`
        @page {
          size: landscape;
          margin: 0;
        }
        .table {
          white-space: nowrap;
        }
        .table td {
          padding: 7px 0.75rem;
          overflow: hidden;
          max-width: 200px;
          text-overflow: ellipsis;
        }
        `}</style>
        {
          isLoading
            ? <Container style={{ marginTop: '2rem' }}><Row>Загрузка данных...</Row></Container>
            : isError
              ? <Container style={{ marginTop: '2rem' }}><Row>Ошибка данных</Row></Container>
              :
              <>
                <Container style={{ marginTop: '2rem' }}>
                  <Row>
                    <Col>
                      <h3>{project.name}</h3>
                      <h5><PatternedDate date={date} /></h5><br />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Взрослый</th>
                            <th>Ребёнок</th>
                            <th>Контактный телефон</th>
                            <th>Ознакомлен(-а) с техникой безопасности</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            members.map((props, index) => (
                              <MasterClassMember
                                price={price}
                                number={index + 1}
                                {...props}
                                key={`member-number-${index}`}/>
                            ))
                          }
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </Container>
              </>
        }

      </>
    );
  }
}


class MasterClassMember extends Component {
  getPayMethod(method) {
    switch (method) {
      case '': return
      case 'beznal': return 'Безнал'
      case 'nal': return 'Нал'
      default: return
    }
  }
  render() {
    const { number, parent, child } = this.props
    return (
      <>
        <tr>
          <td>{number}</td>
          <td>{parent.fio}</td>
          <td>{`${child.fio} ${child.age} лет`}</td>
          <td>{parent.phone}</td>
          <td></td>
        </tr>
      </>
    )
  }
}

export default MasterClass
