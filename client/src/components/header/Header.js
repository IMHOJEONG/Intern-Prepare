
import styled from "styled-components";
import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import {Toolbar} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Input from "@material-ui/core/Input";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import MenuIcon from '@material-ui/icons/Menu';
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";


// const StyledBox = styled(Box)`
//     margin: 0 auto;
// `;
//
// const StyledContainer = styled(Container)`
//     background-color: skyblue;
//     margin-left: 0px;
//     margin-right: 0px;
//
// `;
//

const handleClick = () => {
    return "Hello World"
}

const StyledAppBar = styled(AppBar)`
    background-color: #6778e5;
`;

const StyledToolbar = styled(Toolbar)`
    background-color: white;
`;

function Header(prop) {

    const { breadcrumb, isnavopen, navopen  } = prop;
    const breadcrumbs = breadcrumb.split(",");

    const handleNavOpen = () => {
        isnavopen(!navopen)
    }
    return <Paper>
                <StyledAppBar
                position={"fixed"}
                style={{
                position: "fixed",
                zIndex: 1201
                }}
                >
                <StyledToolbar>
                <IconButton>
                </IconButton>
                <Typography variant="h6" style={{ flex: 0.4, color: "black" }}>
                KM Console
                </Typography>
                <form style={{ flex: 0.5 }}>
                <Input placeholder="resource" inputProps={{ 'aria-label': 'description' }}></Input>
                </form>
                <Button style={{ flex: 0.1 }}>
                Login
                </Button>
                </StyledToolbar>

                <Toolbar style={{ display: "flex"}}>
                <IconButton edge="start" color="inherit" aria-label="menu"  style={{ display: "block" }}
                            onClick={handleNavOpen} >
                    <MenuIcon />
                </IconButton>
                <Breadcrumbs aria-label={"breadcrumb"}>
                {
                    breadcrumbs.map((item, index) => {
                        return <Link color="inherit" key={index}>
                            {item}
                        </Link>
                    })
                }
                {/*<Link color={"inherit"}>Test</Link>*/}
                {/*<Link color="inherit" >*/}
                {/*    Core*/}
                {/*</Link>*/}
                {/*<Typography color="textPrimary">Breadcrumb</Typography>*/}
                </Breadcrumbs>
                </Toolbar>

                </StyledAppBar>

                {/*    <Toolbar>*/}
                {/*        <IconButton edge="start" color="inherit" aria-label="menu">*/}
                {/*            <MenuIcon />*/}
                {/*        </IconButton>*/}

                {/*        <Breadcrumbs aria-label={"breadcrumb"}>*/}
                {/*            <Link color={"inherit"} href={"/"} ></Link>*/}
                {/*        </Breadcrumbs>*/}
                {/*    </Toolbar>*/}

                </Paper>


}

export default Header;
