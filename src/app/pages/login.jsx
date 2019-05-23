import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

import { loginIn } from '../../actions/login'

import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'

class Login extends PureComponent {
  constructor(props) {
    super()
    this.state = {
      email: '',
      password: ''
    }
    this.submit = this.submit.bind(this)
  }
  handleChange(prop, val) {
    switch (prop) {
      case 'email':
        return this.setState({ email: val })
      case 'password':
        return this.setState({ password: val })
      default: return
    }
  }
  submit(e) {
    e.preventDefault()
    this.props.loginIn({...this.state})
  }
  render() {
    const { email, password } = this.state
    if (!this.props.status || !this.props.token)
      return (
        <Container>
          <Alert show={!!this.props.error} variant="danger" style={{marginTop: 15}}>
            <Alert.Heading>Ошибка при авторизации!</Alert.Heading>
            <p>
              { this.props.error }
            </p>
          </Alert>
          <div className='d-flex justify-content-center align-items-center' style={{paddingTop: '15vh'}}>
            <Form style={{ minWidth: 290 }} onSubmit={this.submit}>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    value={email}
                    type='text'
                    onChange={({ target }) => this.handleChange('email', target.value)} />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    value={password}
                    type='password'
                    onChange={({ target }) => this.handleChange('password', target.value)} />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Button type='submit' variant='outline-success'>Войти</Button>
                </Form.Group>
              </Form.Row>
            </Form>
          </div>
          {
            this.props.status === 'login_in'
            ? <Spinner animation="border" role="status" className='d-block' style={{marginLeft: 'auto', marginRight: 'auto'}}>
              <span className="sr-only">Loading...</span>
            </Spinner>
            : ''
          }
        </Container>
      )
      else return (<Redirect to='/'/>)
  }
}

const mapStateToProps = ({ login }) => ({
  ...login
})

export default connect(mapStateToProps, {
  loginIn
})(Login)
