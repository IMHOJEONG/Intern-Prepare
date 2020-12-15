package main

import (
	mysqlclient "github.kakaocorp.com/cloud/kube-mysql/pkg/generated/clientset/versioned"
	mysqlv1 "github.kakaocorp.com/cloud/kube-mysql/pkg/mysql/v1"
	"k8s.io/client-go/kubernetes"
	"strconv"
	"time"

	//runner "github.kakaocorp.com/cloud/kube-mysql/pkg/common/runner"
	//"k8s.io/client-go/tools/cache"
	//"net/http"
	//"net/http/httputil"
	//"net/url"

	"flag"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/util/homedir"
	"path/filepath"
)

type totalData struct {
	TotalInstanceset int
	TotalInstance int
	TotalBackup int
	TotalLocalPVSize string
	AbnormalLocalPV int
	AbnormalInstance int
	AbnormalBackup int
	RunningBackup int
}

func instanceCall(mysqlClientset *mysqlclient.Clientset, namespace string) []mysqlv1.Instance{

	var instancesLists *mysqlv1.InstanceList
	if namespace == "/" {
		instancesLists, _ = mysqlClientset.MySQLV1().Instances(metav1.NamespaceAll).List(metav1.ListOptions{})
	} else {
		instancesLists, _ = mysqlClientset.MySQLV1().Instances(namespace).List(metav1.ListOptions{})
	}

	return instancesLists.Items

}

func instancesetCall(mysqlClientset *mysqlclient.Clientset, namespace string) []mysqlv1.InstanceSet {

	var instancesetLists *mysqlv1.InstanceSetList
	if namespace == "/" {
		instancesetLists, _ = mysqlClientset.MySQLV1().InstanceSets(metav1.NamespaceAll).List(metav1.ListOptions{})
	} else {
		instancesetLists, _ = mysqlClientset.MySQLV1().InstanceSets(namespace).List(metav1.ListOptions{})
	}

	return instancesetLists.Items

}

func haconfigcall(mysqlClientset *mysqlclient.Clientset, namespace string) []mysqlv1.HAConfig{

	var haconfigLists *mysqlv1.HAConfigList
	if namespace == "/" {
		haconfigLists, _ = mysqlClientset.MySQLV1().HAConfigs(metav1.NamespaceAll).List(metav1.ListOptions{})
	} else {
		haconfigLists, _ = mysqlClientset.MySQLV1().HAConfigs(namespace).List(metav1.ListOptions{})
	}

	return haconfigLists.Items

}

func backupcall(mysqlClientset *mysqlclient.Clientset, namespace string ) []mysqlv1.Backup{

	var backupLists *mysqlv1.BackupList
	if namespace == "/" {
		backupLists, _ = mysqlClientset.MySQLV1().Backups(metav1.NamespaceAll).List(metav1.ListOptions{})
	} else {
		backupLists, _ = mysqlClientset.MySQLV1().Backups(namespace).List(metav1.ListOptions{})
	}

	return backupLists.Items
}

func totaldatacall(mysqlClientset *mysqlclient.Clientset, kubeClientset *kubernetes.Clientset) totalData{

	totalData:= totalData{}
	totaldataInstanceset, _ := mysqlClientset.MySQLV1().InstanceSets(metav1.NamespaceAll).List(metav1.ListOptions{})

	totaldataInstance, _ := mysqlClientset.MySQLV1().Instances(metav1.NamespaceAll).List(metav1.ListOptions{})

	totalbackup, _ := mysqlClientset.MySQLV1().Backups(metav1.NamespaceAll).List(metav1.ListOptions{})

	pvs, _:= kubeClientset.CoreV1().PersistentVolumes().List(metav1.ListOptions{})

	totalData.TotalInstanceset = len(totaldataInstanceset.Items)
	totalData.TotalInstance = len(totaldataInstance.Items)
	totalData.TotalBackup = len(totalbackup.Items)


	abnormalInstances := 0
	for _, num := range totaldataInstance.Items {
		if num.Spec.Enabled != true {
			abnormalInstances++
		}
	}

	totalData.AbnormalInstance = abnormalInstances

	sumPV := int64(0)
	abnormalPV := 0
	pvsArr := pvs.Items

	for _, num := range pvsArr {
		quantity := num.Spec.Capacity["storage"]
		if num.Status.Phase != "Bound" {
			abnormalPV++
		}

		sumPV += quantity.Value() / 1000000000
	}

	totalData.TotalLocalPVSize = strconv.FormatInt(sumPV, 10)+"Gi"
	totalData.AbnormalLocalPV = abnormalPV

	abnormalBackup := 0
	runningBackup := 0

	for _, back := range totalbackup.Items {
		if back.Status.Phase == "Succeeded" {

		} else if back.Status.Phase == "Running" {
			runningBackup++
		} else {
			abnormalBackup++
		}

	}

	totalData.RunningBackup = runningBackup
	totalData.AbnormalBackup = abnormalBackup

	return totalData
}


func main() {

	var kubeconfig *string
	if home := homedir.HomeDir(); home != "" {
		kubeconfig = flag.String("kubeconfig", filepath.Join(home, ".kube", "config"), "(optional) absolute path to the kubeconfig file")
	} else {
		kubeconfig = flag.String("kubeconfig", "", "absolute path to the kubeconfig file")
	}
	flag.Parse()

	// use the current context in kubeconfig
	config, err := clientcmd.BuildConfigFromFlags("", *kubeconfig)
	if err != nil {
		panic(err.Error())
	}

	kubeClientset, err := kubernetes.NewForConfig(config)

    if err != nil {
        panic(err.Error())
    }

	mysqlClientset := mysqlclient.NewForConfigOrDie(config)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowMethods: []string{"PUT", "PATCH", "GET", "POST", "OPTIONS"},
		AllowHeaders: []string{"Origin"},
		ExposeHeaders: []string{"Content-Length"},
		AllowAllOrigins: true,
		AllowCredentials: true,
		AllowWildcard: true,

		MaxAge: 12 * time.Hour,
	}))

	customeresouce := r.Group("/customresource")
	{
		customeresouce.GET("/instanceset/*namespace", func(c *gin.Context) {

			namespace := c.Params.ByName("namespace")
			c.JSON(200, instancesetCall(mysqlClientset, namespace))
		})

		customeresouce.GET("/instance/*namespace", func(c *gin.Context) {

			namespace := c.Params.ByName("namespace")
			c.JSON(200, instanceCall(mysqlClientset, namespace))
		})

		customeresouce.GET("/haconfig/*namespace", func(c *gin.Context) {
			namespace := c.Params.ByName("namespace")
			c.JSON(200, haconfigcall(mysqlClientset, namespace))
		})

		customeresouce.GET("/backup/*namespace", func(c *gin.Context) {
			namespace := c.Params.ByName("namespace")
			c.JSON(200, backupcall(mysqlClientset, namespace))
		})

	}

	r.GET("/all", func(c *gin.Context){

		c.JSON(200, totaldatacall(mysqlClientset, kubeClientset))

	})


	r.GET("/namespace", func(c *gin.Context){

		test, _ := kubeClientset.CoreV1().Namespaces().List(metav1.ListOptions{})

		var namespaces []string

		for _, namespace := range test.Items {
			namespaces = append(namespaces, namespace.Name)
		}

		c.JSON(200, namespaces)
	})

	r.Run("127.0.0.1:8080")
}