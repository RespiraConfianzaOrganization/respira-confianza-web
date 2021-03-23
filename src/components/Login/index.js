import React from "react";
import './Login.css';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom"
import { login } from "../../actions/auth";
import { Button, Grid, TextField } from "@material-ui/core"

export class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            form: {
                username: '',
                password: ''
            },
            errors: {
                username: '',
                password: '',
            },
            errorLogin: ''
        }
    }

    static propTypes = {
        login: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        error: PropTypes.string,
    };

    onChange = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value,
            },
        });
    };

    onSubmit = async (e) => {
        e.preventDefault()
        let errors = {
            username: '',
            password: ''
        }
        if (!this.state.form.username) {
            errors.username = "Debe ingresar usuario"
        }
        if (!this.state.form.password) {
            errors.password = "Debe ingresar contraseña"
        }
        this.setState({
            errors
        })
        if (!errors.username && !errors.password) {
            await this.props.login(this.state.form.username, this.state.form.password);
            if (this.props.error) {
                this.setState({
                    errorLogin: this.props.error,
                });
            }
        }
    }
    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/admin" />;
        }
        return (
            <div className="login-container">
                <h3 className="login-title">Respira Confianza</h3>
                <form className="login-form" onSubmit={this.onSubmit}>
                    <div className="login-errors">
                        <span>{this.state.errors.username} </span>
                        <span>{this.state.errors.password} </span>
                    </div>
                    <Grid container spacing={1} >
                        <Grid item xs={12}>
                            <TextField
                                className="white-textfield"
                                variant="outlined"
                                size="small"
                                name="username"
                                placeholder="Usuario"
                                onChange={this.onChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                className="white-textfield"
                                variant="outlined"
                                size="small"
                                name="password"
                                placeholder="Contraseña"
                                onChange={this.onChange}
                            />
                        </Grid>
                        <Grid item xs={12} >
                            <Button
                                type="submit"
                                className="submit-login-button"
                                variant="outlined"
                                onClick={this.onSubmit}>
                                Ingresar
                            </Button>
                        </Grid>

                        <Grid item xs={12} >
                            <Link to="/ingresar/recuperar-contraseña" className="link"> He olvidado contraseña</Link>
                        </Grid>
                    </Grid>
                </form>

            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.auth.error,
});

export default connect(mapStateToProps, { login })(Login);