import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { logout } from "../../actions/auth";
import {
    AppBar,
    Drawer,
    IconButton,
    ListItem,
    List,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
} from "@material-ui/core";
import clsx from "clsx";
import { makeStyles, } from "@material-ui/core/styles";
import {
    Home as HomeIcon,
    Menu as MenuIcon,
    AccountCircle,
    SupervisorAccount as AdminIcon,
    Equalizer as Umbrals,
    Storage as Readings,
    SettingsRemote as Station,
    Cloud as Pollutant
} from "@material-ui/icons";

import { connect } from "react-redux";

const drawerWidth = 270;
const useStyles = makeStyles((theme) => ({
    root: {
        display: "block",
    },
    appBar: {},
    menuButton: {
        marginRight: 0,
    },
    hide: {
        display: "none",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        position: "absolute",
        left: "0px",
        top: "0px",
        zIndex: "1250",
        backgroundColor: theme.colorTheme
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        top: "48px",
        backgroundColor: theme.colorTheme,
        boxShadow: "5px 0px 4px -1px rgb(0 0 0 / 20%)",
    },
    drawerClose: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: "hidden",
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing(7) + 1,
        },
        top: "48px",
        backgroundColor: theme.colorTheme,
        boxShadow: "5px 0px 4px -1px rgb(0 0 0 / 20%)",
    },
    customerToolbar: {
        display: "flex",
        alignItems: "center",
        paddingLeft: "20px",
        minHeight: 48,
        height: "48px !important",
        background: theme.colorTheme,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    title: {
        flexGrow: 1,
        width: "auto",
        paddingLeft: 12,
    },
    link: {
        color: "white",
        textDecoration: "none",
        margin: 10,
        "&:hover": {
            color: "#EEEEEE",
            cursor: "pointer",
        },
    },
    itemDrawner: {
        color: "#ffff",
        textDecoration: "none",
        marginBottom: "10px",
    },
    iconDrawner: {
        color: "#ffff",
        fontSize: "25px",
    },
    linksContainer: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "flex-end",
    },
    logo: {
        height: "40px",
    },
    "@media (max-width:480px)": {
        // eslint-disable-line no-useless-computed-key
        itemDrawner: {
            marginBottom: "10px",
        },
    },
}));

function LogedInView(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { logout, classLinksContainer } = props;
    const history = useHistory();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const handleClick = () => {
        history.push("/admin/perfil/");
    }

    return (
        <div className={classLinksContainer}>
            <div>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClick}>Mi cuenta</MenuItem>
                    <MenuItem onClick={logout}>Cerrar Sesión</MenuItem>
                </Menu>
            </div>
        </div>
    );
}

function LogedOutView(props) {
    const history = useHistory();
    const { classLinksContainer } = props;

    const handleClick = () => {
        history.push("/ingresar");
    }
    return <div className={classLinksContainer} onClick={handleClick}>Ingresar</div>;
}

function Drawner(props) {
    const classes = useStyles();
    const { isAuthenticated } = props.auth;
    const { open } = props;
    const { setOpen } = props;

    return isAuthenticated ? (
        <Drawer
            open={open}
            variant="permanent"
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
            })}
            classes={{
                paper: clsx({
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                }),
            }}
            anchor="left"
        >
            {/* <Divider /> */}
            <List>
                {[
                    { text: "Inicio", Icon: HomeIcon, url: "/admin" },
                    { text: "Administradores", Icon: AdminIcon, url: "/admin/administradores" },
                    { text: "Estaciones", Icon: Station, url: "/admin/estaciones" },
                    { text: "Contaminantes", Icon: Pollutant, url: "/admin/contaminantes" },
                    { text: "Umbrales", Icon: Umbrals, url: "/admin/umbrales-contaminantes" },
                    { text: "Lecturas", Icon: Readings, url: "/admin/lecturas" },
                ].map((item) => {
                    const Icon = item.Icon;
                    return (
                        <Link
                            to={item.url}
                            className={classes.itemDrawner}
                            key={item.text}
                            onClick={() => (open ? setOpen(!open) : null)}
                        >
                            <ListItem
                                button
                                key={item.text}
                                className={classes.itemDrawner}
                            >
                                <ListItemIcon>
                                    <Icon className={classes.iconDrawner} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    style={{ display: "flex", flexWrap: "wrap" }}
                                />
                            </ListItem>
                        </Link>
                    );
                })}
            </List>
        </Drawer>
    ) : null;
}

function NavBar(props) {
    const classes = useStyles();
    const { isAuthenticated, user } = props.auth;
    const { logout, open, setOpen } = props;

    const authLinks = (
        <LogedInView
            user={user}
            logout={logout}
            classLinksContainer={classes.linksContainer}
        />
    );
    const guestLinks = <LogedOutView classLinksContainer={classes.linksContainer} />;

    const handleDrawerChange = () => {
        setOpen(!open);
    };

    return (
        <AppBar className={classes.appBar}>
            <Toolbar className={classes.customerToolbar}>
                {isAuthenticated ? (
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerChange}
                        edge="start"
                        className={clsx(classes.menuButton)}
                    >
                        <MenuIcon />
                    </IconButton>
                ) : (
                    // Este Botón es un botón invisible que sólo se ve en la vista de login, para que no se mueva el logo de FIC en la Navbar
                    <IconButton
                        color="inherit"
                        aria-label="empty button"
                        edge="start"
                        className={clsx(classes.menuButton)}
                    >
                        <MenuIcon style={{ opacity: "0" }} />
                    </IconButton>
                )}

                <Link to="/" className={classes.link}>
                    Respira Confianza
                </Link>

                {isAuthenticated ? authLinks : guestLinks}
            </Toolbar>
        </AppBar>
    );
}

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export var DrawnerCustumer = connect(mapStateToProps)(Drawner);
export var NavBarCustumer = connect(mapStateToProps, { logout })(NavBar);