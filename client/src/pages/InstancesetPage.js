import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Container, FormControl, Typography} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InstancesetDetailsTable from "./InstancesetDetailsTable";

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


function InstancesetPage() {

    const classes = useStyles();

    const [age, setAge] =useState('');

    const handleChange = (event) =>{
      setAge(event.target.value)
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
                    value={age}
                    onChange={handleChange}
                    displayEmpty
                    className={classes.selectEmpty}
                    inputProps={{
                        'aria-label': 'Without label'
                    }}
                   >
                       <MenuItem value={10}>poster-im</MenuItem>
                       <MenuItem value={20}>poster-im2</MenuItem>
                       <MenuItem value={30}>poster-im3</MenuItem>
                   </Select>
               </FormControl>
           </Container>
            <Container className={classes.container} maxWidth={false}>
                {/*<Typography>*/}
                {/*    Details*/}
                {/*</Typography>*/}
                <InstancesetDetailsTable />
            </Container>

        </>
    )
}

export default InstancesetPage;