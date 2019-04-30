import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { Link } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'

class Header extends Component {
  render() {
    return (
      <Navbar bg="dark" variant="dark">
        <Container>
          <Row>
            <Navbar.Brand><Link to="/" style={{fontWeight: 900}}>DIY Мастер-Классы</Link></Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Item>
                <Link to="/" className="nav-link">Главная</Link>
              </Nav.Item>
              <NavDropdown title="Мастер-Классы">
                <Link to="/" className="dropdown-item">Предстоящие МК</Link>
                <Link to="/mc/old" className="dropdown-item">Прошедшие МК</Link>
              </NavDropdown>
              <NavDropdown title="+Добавить ...">
                <Link to="/create/mc" className="dropdown-item">Мастер-Класс</Link>
                <Link to="/create/project" className="dropdown-item">Проект</Link>
              </NavDropdown>
              <Nav.Item>
                <Link to="/create/inventory" className="nav-link">Инвентаризационный учёт</Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/clients" className="nav-link">Список взрослых</Link>
              </Nav.Item>
            </Nav>
          </Row>
        </Container>
      </Navbar>
    );
  }
}

export default Header;