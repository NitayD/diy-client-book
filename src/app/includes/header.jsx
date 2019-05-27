import React, { PureComponent } from 'react'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { Link } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'

class Header extends PureComponent {
  constructor() {
    super()
    this.state = { expanded: false }
    this.hadleClose = this.hadleClose.bind(this)
    this.hadleToggle = this.hadleToggle.bind(this)
  }
  hadleClose() {
    this.setState({ expanded: false })
  }
  hadleToggle() {
    this.setState((state) => ({ expanded: !state.expanded }))
  }
  render() {
    return (
      <Navbar bg="dark" defaultExpanded={false} variant="dark" {...this.state} expand="lg" onToggle={()=>{}}>
        <Container>
          <Navbar.Brand><Link to="/" style={{fontWeight: 900}}>DIY Мастер-Классы</Link></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="ml-auto" onClick={this.hadleToggle}/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <Nav.Item>
                <Link to="/" className="nav-link" onClick={this.hadleClose}>Главная</Link>
              </Nav.Item>
              <NavDropdown title="Мастер-Классы">
                <Link to="/" className="dropdown-item" onClick={this.hadleClose}>Предстоящие МК</Link>
                <Link to="/mc/old" className="dropdown-item" onClick={this.hadleClose}>Прошедшие МК</Link>
              </NavDropdown>
              <NavDropdown title="+Добавить ...">
                <Link to="/create/mc" className="dropdown-item" onClick={this.hadleClose}>Мастер-Класс</Link>
                <Link to="/create/project" className="dropdown-item" onClick={this.hadleClose}>Проект</Link>
              </NavDropdown>
              <Nav.Item>
                <Link to="/create/inventory" className="nav-link" onClick={this.hadleClose}>Инвентаризационный учёт</Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/clients" className="nav-link" onClick={this.hadleClose}>Список взрослых</Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href='https://diystudio.kz/' onClick={this.hadleClose}>Внешний сайт</Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default Header;