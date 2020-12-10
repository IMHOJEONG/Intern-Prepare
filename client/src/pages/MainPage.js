import Header from "../components/header/Header";
import Navigation from "../components/navigation/Navigation";
import React from "react";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";
import Box from "@material-ui/core/Box";
import {Grid} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Divider from "@material-ui/core/Divider";
import CustomResourceInfo from "./CustomResourceInfo";
import DetailsPage from "./DetailsPage";

const ContainerFragment = styled.div`
    display: flex;
    flex-direction: column;
`;

const useStyles = makeStyles(theme => ({
    margin: {
        margin: theme.spacing(100),
    }
}));


function MainPage() {

    const classes = useStyles();
    const [breadcrumb, setBreadcrumb] = React.useState('');
    const [navopen, isNavOpen] = React.useState(true);
    const [change, onchange] = React.useState();

    console.log(breadcrumb)

    function switchComponent(breadcrumb) {
        switch (breadcrumb) {
            case "":
                return <CustomResourceInfo />
            case "커스텀 리소스,Instanceset":
                return <DetailsPage />
            case "커스텀 리소스,Instances":
                return <CustomResourceInfo />
            case "커스텀 리소스,haconfigs":
                return <CustomResourceInfo />
            case "커스텀 리소스,backup":
                return <CustomResourceInfo />
            default:
                return <></>
        }
    }


    return <>
            <Header breadcrumb={breadcrumb} isnavopen={isNavOpen} navopen={navopen}></Header>
            <Navigation setBreadcrumb={setBreadcrumb} navopen={navopen}></Navigation>
            {
               switchComponent(breadcrumb)
            }
    </>
}

export default MainPage;
