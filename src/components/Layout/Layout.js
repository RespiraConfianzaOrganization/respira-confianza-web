import { React } from "react";
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
    Typography,
    Toolbar,
} from "@material-ui/core";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
    Home as HomeIcon,
    Menu as MenuIcon,
    People as PeopleIcon,
    AccountCircle as AccountCircleIcon,
    QuestionAnswer as QuestionAnswerIcon,
    VideoLibrary as VideoLibraryIcon,
    FileCopy as FileCopyIcon,
    MenuBook as MenuBookIcon,
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
        zIndex: "1",
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        top: "48px",
        backgroundColor: "#FFFFFF",
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
        backgroundColor: "#FFFFFF",
        boxShadow: "5px 0px 4px -1px rgb(0 0 0 / 20%)",
    },
    customerToolbar: {
        display: "flex",
        alignItems: "center",
        paddingLeft: "20px",
        minHeight: 48,
        height: "48px !important",
        background: theme.colorTema,
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
        color: theme.colorTema,
        textDecoration: "none",
        marginBottom: "20px",
    },
    iconDrawner: {
        color: theme.colorTema,
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
    const { logout, classLink, usuario, classLinksContainer } = props;
    const history = useHistory();
    function handleClick() {
        history.push("/perfil/");
    }
    return (
        <div className={classLinksContainer}>
            <Typography
                variant="body1"
                className={classLink}
                onClick={() => handleClick()}
            >
                {usuario.primer_nombre + " " + usuario.apellido_paterno}
            </Typography>
            <Typography variant="body1" onClick={logout} className={classLink}>
                Cerrar Sesión
      </Typography>
        </div>
    );
}

function LogedOutView(props) {
    return null;
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
                    { text: "Inicio", Icon: HomeIcon, url: "/" },
                    {
                        text: "Biblioteca Docente",
                        Icon: FileCopyIcon,
                        url: "/biblioteca-docente/",
                    },
                    { text: "Manuales", Icon: MenuBookIcon, url: "/manuales/" },
                    { text: "Cápsulas", Icon: VideoLibraryIcon, url: "/capsulas/" },
                    { text: "Foro", Icon: QuestionAnswerIcon, url: "/foro/" },
                    { text: "Comunidad Docente", Icon: PeopleIcon, url: "/comunidad/" },
                    {
                        text: "Bibiblioteca Académica",
                        Icon: FileCopyIcon,
                        url: "/biblioteca-academica/",
                    },
                    { text: "Perfil", Icon: AccountCircleIcon, url: "/perfil/" },
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
    const { isAuthenticated, usuario } = props.auth;
    const { logout, open, setOpen } = props;

    const authLinks = (
        <LogedInView
            usuario={usuario}
            logout={logout}
            classLink={classes.link}
            classLinksContainer={classes.linksContainer}
        />
    );
    const guestLinks = <LogedOutView />;

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