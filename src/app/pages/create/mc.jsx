import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import CreateMCForm from '../../includes/forms/create_mc'


class CreateMC extends Component {
  render() {
    const mcid = window.location.parseHash().mcid
    return (
      <>
        <Breadcrumb>
          <Container>
            <Row>
              <Link to='/' className='breadcrumb-item'>Таблица Мастер-Классов</Link>
              <Breadcrumb.Item active>{ mcid ? 'Изменить' : 'Добавить' } Мастер-Класс</Breadcrumb.Item>
            </Row>
          </Container>
        </Breadcrumb>
        <Container>
          <Row>
            <CreateMCForm mcid={ mcid ? mcid : false }/>
          </Row>
        </Container>
      </>
    );
  }
}

export default CreateMC
