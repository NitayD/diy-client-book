import React, { Component } from 'react'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import CreateProjectForm from '../../includes/forms/create_project'


class CreateMC extends Component {
  render() {
    return (
      <>
        <Breadcrumb>
          <Container>
            <Row>
              <Breadcrumb.Item active>Добавить Проект</Breadcrumb.Item>
            </Row>
          </Container>
        </Breadcrumb>
        <Container>
          <Row>
            <CreateProjectForm/>
          </Row>
        </Container>
      </>
    );
  }
}

export default CreateMC
