import React, { Component } from "react";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
  }

  onChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  onSubmit = e => {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    this.props.registerUser(newUser, this.props.history);
  };

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
  //   if(prevProps.auth.isAuthenticated){
  //     this.props.history.push("/dashboard");
  //   }
  // }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your DevConnector account
              </p>
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup
                  onChange={this.onChange}
                  value={this.state.name}
                  name="name"
                  placeholder="Name"
                  error={errors.name}
                />
                <TextFieldGroup
                  onChange={this.onChange}
                  value={this.state.email}
                  name="email"
                  type="email"
                  error={errors.email}
                  placeholder="Email Address"
                  info="This site uses Gravatar so if you want a profile image, use
                    a Gravatar email"
                />

                <TextFieldGroup
                  onChange={this.onChange}
                  value={this.state.password}
                  name="password"
                  type="password"
                  placeholder="Password"
                  error={errors.password}
                />
                <TextFieldGroup
                  onChange={this.onChange}
                  value={this.state.password2}
                  name="password2"
                  type="password"
                  error={errors.password2}
                  placeholder="Confirm Password"
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

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
