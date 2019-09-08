import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import { withRouter } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  // static getDerivedStateFromProps(props, state) {
  //   if (props.errors) {
  //     return {
  //       errors: props.errors
  //     };
  //   }
  //   return null;
  // }
  //
  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   if (this.props.auth.isAuthenticated) {
  //     this.props.history.push("/dashboard");
  //   }
  // }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.auth.isAuthenticated){
      this.props.history.push("/dashboard");
    }
    if(nextProps.errors){
      this.setState({errors:nextProps.errors});
    }
  }

  onChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };
  onSubmit = e => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData);
  };

  render() {
    const { errors } = this.state;
    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">
                Sign in to your DevConnector account
              </p>
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup
                    onChange={this.onChange}
                    value={this.state.email}
                    name="email"
                    placeholder="Email Address"
                    type="email"
                    error={errors.email}
                />
                <TextFieldGroup
                    onChange={this.onChange}
                    value={this.state.password}
                    name="password"
                    placeholder="Password"
                    type="password"
                    error={errors.password}
                />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(withRouter(Login));
