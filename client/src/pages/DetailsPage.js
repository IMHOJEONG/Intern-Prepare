import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Container, FormControl, Typography} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InstancesetDetailsTable from "./InstancesetDetailsTable";
import axios from 'axios';
import InstanceTable from "./InstanceTable";
import HaconfigTable from "./HaconfigTable";
import BackupTable from "./BackupTable";


const useStyles = makeStyles((theme)=>({
    container: {
        width: "100%",
        paddingLeft: "25em",
        // paddingTop: "10em",
        paddingRight: "0px",
        // position: "static",
        display: "flex",
    },
    formControl: {
        margin: theme.spacing(1),
        // minWidth: 120,
        display: "flex",
        flexDirection: "row"
    },
    selectEmpty: {
        // marginTop: theme.spacing(2),
        width: '8em',
        marginLeft: theme.spacing(3),
    },
}))


function DetailsPage(props) {

    const classes = useStyles();

    const { resource } = props;

    const [namespaces, setNamespaces] = useState([]);
    const [namespace, setNamespace] = useState("");

    function switchResource(resource){
        switch(resource){
            case "instanceset":
                return <InstancesetDetailsTable namespace={namespace}/>
            case 'instance':
                return <InstanceTable namespace={namespace} />
            case 'haconfig':
                return <HaconfigTable namespace={namespace} />
            case 'backup':
                return <BackupTable namespace={namespace} />
        }
    }


    useEffect(()=>{
        const callNamespace = async () => {
            try {
                const response = await axios.get("http://localhost:8080/namespace")
                // setNamespaces()
                // console.log(callNamespace)
                setNamespaces(response.data)
            }
            catch (e){
                console.log(e)
            }
        }

        callNamespace()
    }, [])

    const handleChange = (event) =>{
      setNamespace(event.target.value)
    };

    return (
        <>
           <Container className={classes.container} maxWidth={false} style={{
               paddingTop: "10em"
           }}>
               <FormControl className={classes.formControl} >
                   <Typography>
                       Namespace:
                   </Typography>
                   <Select
                    value={namespace}
                    onChange={handleChange}
                    displayEmpty
                    className={classes.selectEmpty}
                    inputProps={{
                        'aria-label': 'Without label'
                    }}
                   >
                       {
                           namespaces.map((e)=>{
                               return <MenuItem value={e}>{e}</MenuItem>
                           })
                       }
                   </Select>
               </FormControl>
           </Container>
            <Container className={classes.container} maxWidth={false}>
                {switchResource(resource)}
            </Container>

        </>
    )
}

export default DetailsPage;