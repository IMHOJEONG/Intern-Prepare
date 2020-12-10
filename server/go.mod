module github.kakaocorp.com/cloud/kube-mysql-console

go 1.12

require github.kakaocorp.com/cloud/kube-common v0.0.0-20201125073825-7e2007b6686d

require github.com/go-sql-driver/mysql v1.5.0

require github.com/jmoiron/sqlx v1.2.0

require github.com/gin-gonic/gin v1.6.3

require github.com/swaggo/gin-swagger v1.2.0

require github.com/swaggo/swag v1.6.7

require github.com/alecthomas/template v0.0.0-20190718012654-fb15b899a751

replace github.kakaocorp.com/cloud/kube-mysql => ../../kube-mysql

replace github.kakaocorp.com/cloud/kube-common => ../../kube-common

require k8s.io/kubernetes v0.0.0

replace k8s.io/kubernetes => ../../kube-mysql/kubernetes-1.15.8/kubernetes

require k8s.io/api v0.0.0

replace k8s.io/api => ../../kube-mysql/kubernetes-1.15.8/api

require k8s.io/apiextensions-apiserver v0.0.0

replace k8s.io/apiextensions-apiserver => ../../kube-mysql/kubernetes-1.15.8/apiextensions-apiserver

require k8s.io/apimachinery v0.0.0

replace k8s.io/apimachinery => ../../kube-mysql/kubernetes-1.15.8/apimachinery

require k8s.io/apiserver v0.0.0

replace k8s.io/apiserver => ../../kube-mysql/kubernetes-1.15.8/apiserver

require k8s.io/cli-runtime v0.0.0

replace k8s.io/cli-runtime => ../../kube-mysql/kubernetes-1.15.8/cli-runtime

require k8s.io/client-go v0.0.0

replace k8s.io/client-go => ../../kube-mysql/kubernetes-1.15.8/client-go

require k8s.io/cloud-provider v0.0.0

replace k8s.io/cloud-provider => ../../kube-mysql/kubernetes-1.15.8/cloud-provider

require k8s.io/cluster-bootstrap v0.0.0

replace k8s.io/cluster-bootstrap => ../../kube-mysql/kubernetes-1.15.8/cluster-bootstrap

require k8s.io/code-generator v0.0.0

replace k8s.io/code-generator => ../../kube-mysql/kubernetes-1.15.8/code-generator

require k8s.io/component-base v0.0.0

replace k8s.io/component-base => ../../kube-mysql/kubernetes-1.15.8/component-base

require k8s.io/cri-api v0.0.0

replace k8s.io/cri-api => ../../kube-mysql/kubernetes-1.15.8/cri-api

require k8s.io/csi-translation-lib v0.0.0

replace k8s.io/csi-translation-lib => ../../kube-mysql/kubernetes-1.15.8/csi-translation-lib

require k8s.io/gengo v0.0.0

replace k8s.io/gengo => ../../kube-mysql/kubernetes-1.15.8/gengo

require k8s.io/heapster v1.2.0-beta.1

replace k8s.io/heapster => ../../kube-mysql/kubernetes-1.15.8/heapster

require k8s.io/klog v0.3.1

replace k8s.io/klog => ../../kube-mysql/kubernetes-1.15.8/klog

require k8s.io/kube-aggregator v0.0.0

replace k8s.io/kube-aggregator => ../../kube-mysql/kubernetes-1.15.8/kube-aggregator

require k8s.io/kube-controller-manager v0.0.0

replace k8s.io/kube-controller-manager => ../../kube-mysql/kubernetes-1.15.8/kube-controller-manager

require k8s.io/kube-openapi v0.0.0

replace k8s.io/kube-openapi => ../../kube-mysql/kubernetes-1.15.8/kube-openapi

require k8s.io/kube-proxy v0.0.0

replace k8s.io/kube-proxy => ../../kube-mysql/kubernetes-1.15.8/kube-proxy

require k8s.io/kube-scheduler v0.0.0

replace k8s.io/kube-scheduler => ../../kube-mysql/kubernetes-1.15.8/kube-scheduler

require k8s.io/kubectl v0.0.0

replace k8s.io/kubectl => ../../kube-mysql/kubernetes-1.15.8/kubectl

require k8s.io/kubelet v0.0.0

replace k8s.io/kubelet => ../../kube-mysql/kubernetes-1.15.8/kubelet

require k8s.io/legacy-cloud-providers v0.0.0

replace k8s.io/legacy-cloud-providers => ../../kube-mysql/kubernetes-1.15.8/legacy-cloud-providers

require k8s.io/metrics v0.0.0

replace k8s.io/metrics => ../../kube-mysql/kubernetes-1.15.8/metrics

require k8s.io/node-api v0.0.0

replace k8s.io/node-api => ../../kube-mysql/kubernetes-1.15.8/node-api

require k8s.io/repo-infra v0.0.0

replace k8s.io/repo-infra => ../../kube-mysql/kubernetes-1.15.8/repo-infra

require k8s.io/sample-apiserver v0.0.0

replace k8s.io/sample-apiserver => ../../kube-mysql/kubernetes-1.15.8/sample-apiserver

require k8s.io/sample-cli-plugin v0.0.0

replace k8s.io/sample-cli-plugin => ../../kube-mysql/kubernetes-1.15.8/sample-cli-plugin

require k8s.io/sample-controller v0.0.0

replace k8s.io/sample-controller => ../../kube-mysql/kubernetes-1.15.8/sample-controller

require (
	github.com/gin-contrib/cors v1.3.1 // indirect
	github.com/prometheus/client_golang v0.9.2
	github.com/prometheus/client_model v0.0.0-20180712105110-5c3871d89910
	github.com/sirupsen/logrus v1.7.0
	github.com/spf13/cobra v0.0.0-20180319062004-c439c4fa0937
	github.com/stretchr/testify v1.4.0
	github.kakaocorp.com/cloud/kube-mysql v0.0.0-00010101000000-000000000000
	gopkg.in/square/go-jose.v2 v2.0.0-20180411045311-89060dee6a84
	k8s.io/utils v0.0.0
)

replace k8s.io/utils => ../../kube-mysql/kubernetes-1.15.8/utils
