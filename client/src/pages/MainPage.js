import Header from "../components/header/Header";
import Navigation from "../components/navigation/Navigation";
import React from "react";
import styled from "styled-components";
import makeStyles from "@material-ui/core/styles/makeStyles";
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


    function switchComponent(breadcrumb) {
        switch (breadcrumb) {
            case "":
            case "커스텀 리소스,DashBoard":
                return <CustomResourceInfo />
            case "커스텀 리소스,Instanceset":
                return <DetailsPage resource={"instanceset"}/>
            case "커스텀 리소스,Instances":
                return <DetailsPage resource={"instance"}/>
            case "커스텀 리소스,haconfigs":
                return <DetailsPage resource={"haconfig"}/>
            case "커스텀 리소스,backup":
                return <DetailsPage resource={"backup"}/>
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
