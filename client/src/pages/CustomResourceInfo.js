import {makeStyles} from "@material-ui/core/styles";
import React, { useState, useEffect} from "react";
import Container from "@material-ui/core/Container";
import {Typography} from "@material-ui/core";
import {ArgumentAxis, BarSeries, Chart, LineSeries, ValueAxis} from "@devexpress/dx-react-chart-material-ui";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import styled from "styled-components";

import axios from 'axios';

const customresources = {
    "TotalInstanceset": "InstanceSet",
    "TotalInstance": "Instances",
    "TotalBackup": "Backup",
    "TotalLocalPVSize": "Total Local PV Size",

}

const Abnormalsources = {
    "AbnormalLocalPV": "Abnormal Local PV",
    "AbnormalInstance": "Abnormal Instance",
    "AbnormalBackup": "Abnoraml Backup",
    "RunningBackup": "Running Backup"
}


const StyledCardContent = styled(CardContent)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-contents: center;
`;


const generatedata = (n) => {
    const ret = [];
    let y = 0;
    for (let i = 0; i < n; i += 1) {
        y += Math.round(Math.random() * 10 - 5);
        ret.push({ x: i, y });
    }
    return ret;
};

const test_data = generatedata(100)

const useStyles = makeStyles((theme) => ({
    card: {
        // marginTop: "10em",
        marginBottom: "2em",
        marginRight: "2em",
        // marginLeft: "8em",
        border: "1px solid black",
        width: "20em",
    },
    container: {
        width: "100%",
        paddingLeft: "20em",
        // paddingTop: "10em",
        paddingRight: "0px",
        // position: "static",
        display: "flex",
        // flexDirection: "column",
        // marginRight: "6em"
    },

    resourceTable: {
        width: "12em",
        // marginRight: "2em"
    },
    usage: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around"
    }
}))



function CustomResourceInfo() {

    const classes = useStyles();

    const [ datas, setDatas ] = useState([])

    useEffect(()=>{
        const getData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/all")
                console.log(response)
                setDatas(response.data)
            } catch(e){
                console.log(e);
            }
        }
        getData()
    },[])

    return <>
            <Container className={classes.container} maxWidth={false}
                style={{
                    paddingTop: "10em"
                }}
            >

            {
                Object.entries(customresources).map((e, index)=>{
                    return <Card className={classes.card} key={e}>
                        <StyledCardContent>
                            <Typography variant={"h6"}>
                                {e[1]}
                            </Typography>
                            <Typography variant={"h5"}>
                                {datas[e[0]]}
                            </Typography>
                        </StyledCardContent>
                    </Card>
                })
            }
            </Container>
            <Container className={classes.container} maxWidth={false}
            >

                {
                    Object.entries(Abnormalsources).map((e, index)=>{
                        return <Card className={classes.card} key={e}>
                            <StyledCardContent>
                                <Typography variant={"h6"}>
                                    {e[1]}
                                </Typography>
                                <Typography variant={"h5"}>
                                    {datas[e[0]]}
                                </Typography>
                            </StyledCardContent>
                        </Card>
                    })
                }
            </Container>

        </>

}

export default CustomResourceInfo;