import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { Link } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'

class Header extends Component {
  render() {
    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand><Link to="/" style={{fontWeight: 900}}>DIY Мастер-Классы</Link></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="ml-auto"/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
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
              <Nav.Item>
                <Nav.Link href='https://diystudio.kz/'>Внешний сайт</Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default Header;