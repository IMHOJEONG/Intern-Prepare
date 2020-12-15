import React from "react";
import Drawer from "@material-ui/core/Drawer";
import {Toolbar} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import styled from "styled-components";


import NamespaceSVG from './cluster/ns.svg';
import NodeSVG from './cluster/node.svg';
import PersistentVolumeSVG from './cluster/pv.svg';
import RoleSVG from './cluster/role.svg';
import StorageClassSVG from './cluster/sc.svg';

import CronJobSVG from './workLoad/cronjob.svg';
import DaemonSetSVG from './workLoad/ds.svg';
import DeploymentSVG from './workLoad/deploy.svg';
import JobSVG from './workLoad/job.svg';
import PodSVG from './workLoad/pod.svg';
import ReplicaSetSVG from './workLoad/rs.svg';
import ReplicaControllerSVG from './workLoad/rs.svg';
import StatefulSetSVG from './workLoad/sts.svg';

import IngressSVG from './discoveryandloadbalancing/ing.svg';
import ServiceSVG from './discoveryandloadbalancing/svc.svg';

import ConfigMap from './settingsandstorage/cm.svg';
import PersistentVolumeClaimSVG from './settingsandstorage/pvc.svg';
import SecretSVG from './settingsandstorage/secret.svg';

import CustomResourceSVG from './customResource/crd.svg';
// import Box from "@material-ui/core/Box";
// import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const clusterImages = [
    NamespaceSVG, NodeSVG, PersistentVolumeSVG, RoleSVG, StorageClassSVG,
];

const workLoadImages = [
    CronJobSVG, DaemonSetSVG, DeploymentSVG, JobSVG, PodSVG, ReplicaSetSVG, ReplicaControllerSVG,
    StatefulSetSVG
]

const discoveryandloadbalancingImages = [
    IngressSVG, ServiceSVG
];

const settingandstorageImages = [
    ConfigMap, PersistentVolumeClaimSVG, SecretSVG
];

const customResourcesImages = [
    CustomResourceSVG, CustomResourceSVG, CustomResourceSVG, CustomResourceSVG
];

const iconImages = [
    clusterImages, workLoadImages, discoveryandloadbalancingImages, settingandstorageImages, customResourcesImages
]

const MiddleTopicName = [
    'Status','클러스터', '워크로드','디스커버리 및 로드 밸런싱', '설정 및 스토리지', '커스텀 리소스'
];

const TitleSet = [

];

const cluster = [
    "네임스페이스", "노드", "퍼시스턴트 볼륨", "롤", "스토리지 클래스"
];

const workLoad = [
    "크론 잡", "데몬 셋", "디플로이먼트", "잡", "파드(Pod)",
    "레플리카 셋", "레플리케이션 컨트롤러", "스테이트풀 셋"
];

const disCoveryAndLoadBalancing = [
    "인그레스", "서비스"
];

const settingAndStorage = [
    "컨피그 맵", "퍼시스턴트 볼륨 클레임", "시크릿"
];

const customresource = [
    'Instanceset', 'Instances', "haconfigs", "backup"
];

// function onClickTest () {
//     console.log("test");
// }

const StyledButton = styled(Button)`
    width: 100%;
`;




function navigation(prop) {

    const { setBreadcrumb, navopen } = prop;

    const changeHeader = (item, text) => {
        setBreadcrumb(`${item},${text}`);
    };


    return (
        <React.Fragment>
            {
                navopen === false ? <></> :
                    <Drawer
                        variant={"permanent"}
                        anchor={"left"}
                        position={"fixed"}
                        PaperProps={{
                            style: {
                                // marginTop: "4em"
                                paddingTop: "5em",
                                paddingLeft: "0em",
                                paddingRight: "0em"
                            }
                        }}
                    >
                        <Toolbar/>
                        <Container style={{
                            paddingLeft: "0em",
                            paddingRight: "0em"
                        }}>
                            <Divider />
                            <Typography>
                                <StyledButton>
                                    {MiddleTopicName[0]}
                                </StyledButton>
                            </Typography>
                            {
                                [cluster, workLoad, disCoveryAndLoadBalancing, settingAndStorage, customresource]
                                    .map((item, indexIcon)=>{

                                        return <React.Fragment key={indexIcon}>
                                            <Divider />
                                            <Typography>
                                                <StyledButton onClick={() => changeHeader(MiddleTopicName[indexIcon+1], "DashBoard")}>
                                                    {MiddleTopicName[indexIcon+1]}
                                                </StyledButton>
                                            </Typography>
                                            {
                                                <List style={{
                                                    paddingLeft: "0em",
                                                    paddingRight: "0em",
                                                    paddingTop: "0em",
                                                    paddingBottom: "0em"
                                                }}>
                                                    {
                                                        item.map((text, index) => {
                                                            return <React.Fragment key={index}>
                                                                <ListItem key={text} style={{
                                                                    paddingLeft: "0em", paddingRight: "0em",
                                                                    paddingTop: "0em", paddingBottom: "0em"
                                                                }}>

                                                                    <StyledButton onClick={() => changeHeader(MiddleTopicName[indexIcon+1], text)}>
                                                                        <ListItemIcon>
                                                                            <img src={iconImages[indexIcon][index]}/>
                                                                        </ListItemIcon>
                                                                        <ListItemText primary={
                                                                            text
                                                                        }/>
                                                                    </StyledButton>

                                                                </ListItem>
                                                            </React.Fragment>

                                                        })
                                                    }
                                                </List>
                                            }
                                        </React.Fragment>
                                    })
                            }
                        </Container>
                    </Drawer>
            }

    </React.Fragment>
    );
}

export default navigation;