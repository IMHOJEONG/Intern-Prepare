package main

import (
	"fmt"
	mysqlclient "github.kakaocorp.com/cloud/kube-mysql/pkg/generated/clientset/versioned"
	"k8s.io/client-go/kubernetes"
	"math"
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

type InstanceSets struct {
	InstanceSets []InstanceSet
}

type InstanceSet struct {
	Namespace string
	Name string
	Replicas int
	Recent_Backup string
	Age string
}

type Instances struct {
	Instances []Instance
}

type Instance struct {
	Namespace string
	Name string
	Enabled bool
	Age string
}

type Haconfigs struct {
	Haconfigs []Haconfig
}

type Haconfig struct {
	Namespace string
	Name string
	Enabled bool
	Primary string
	Primary_Phase string
}

type Backups struct {
	Backups []Backup
}

type Backup struct {
	Namespace string
	Name string
	Phase string
	Age string
}

func instanceCall(mysqlClientset *mysqlclient.Clientset) Instances{

	instancesLists, _ := mysqlClientset.MySQLV1().Instances(metav1.NamespaceAll).List(metav1.ListOptions{})

	instancesResult := Instances{}

	for _, instanceObj := range instancesLists.Items {
		instanceResult := Instance{}
		instanceResult.Namespace = instanceObj.Namespace
		instanceResult.Name = instanceObj.Name
		instanceResult.Enabled = instanceObj.Spec.Enabled

		createTime := instanceObj.CreationTimestamp

		getDay := math.Floor(time.Now().Sub(createTime.Time).Hours() / 24.0)

		if getDay == 0 {
			instanceResult.Age = time.Now().Sub(createTime.Time).Round(time.Second).String()
			//fmt.Println(instancesetResult.Age)
		} else {
			instanceResult.Age = fmt.Sprintf("%.0f", getDay) + "d"
			//fmt.Println(instancesetResult.Age)
		}

		instancesResult.Instances = append(instancesResult.Instances, instanceResult)
	}

	return instancesResult

}



func instancesetCall(mysqlClientset *mysqlclient.Clientset) InstanceSets{

	instancesetLists, _ := mysqlClientset.MySQLV1().InstanceSets(metav1.NamespaceAll).List(metav1.ListOptions{})

	instanceSetsResult := InstanceSets{}

	for _, instancesetObj := range instancesetLists.Items {
		instancesetResult := InstanceSet{}
		instancesetResult.Namespace = instancesetObj.Namespace
		instancesetResult.Name = instancesetObj.Name
		instancesetResult.Replicas = instancesetObj.Spec.Replicas
		if instancesetObj.Spec.Template.Spec.BackupName == nil {
			instancesetResult.Recent_Backup = "No Value"
		} else {
			instancesetResult.Recent_Backup = *(instancesetObj.Spec.Template.Spec.BackupName)
		}

		createTime := instancesetObj.CreationTimestamp

		getDay := math.Floor(time.Now().Sub(createTime.Time).Hours() / 24.0)

		if getDay == 0 {
			instancesetResult.Age = time.Now().Sub(createTime.Time).Round(time.Second).String()
			//fmt.Println(instancesetResult.Age)
		} else {
			instancesetResult.Age = fmt.Sprintf("%.0f", getDay) + "d"
			//fmt.Println(instancesetResult.Age)
		}
		instanceSetsResult.InstanceSets = append(instanceSetsResult.InstanceSets, instancesetResult)
	}

	return instanceSetsResult
}

func haconfigcall(mysqlClientset *mysqlclient.Clientset) Haconfigs{

	haconfigLists, _ := mysqlClientset.MySQLV1().HAConfigs(metav1.NamespaceAll).List(metav1.ListOptions{})

	haconfigsResult := Haconfigs{}

	for _, haconfigObj := range haconfigLists.Items {
		haconfigResult := Haconfig{}
		haconfigResult.Namespace = haconfigObj.Namespace
		haconfigResult.Name = haconfigObj.Name
		haconfigResult.Enabled = haconfigObj.Spec.Enabled
		haconfigResult.Primary = haconfigObj.Spec.Topology.Name
		haconfigResult.Primary_Phase = string(haconfigObj.Spec.Topology.Phase)
		haconfigsResult.Haconfigs = append(haconfigsResult.Haconfigs, haconfigResult)
	}

	return haconfigsResult
}

func backupcall(mysqlClientset *mysqlclient.Clientset) Backups{

	backupLists, _ := mysqlClientset.MySQLV1().Backups(metav1.NamespaceAll).List(metav1.ListOptions{})

	backupsResult := Backups{}

	for _, backupObj := range backupLists.Items {
		backupResult := Backup{}
		backupResult.Namespace = backupObj.Namespace
		backupResult.Name = backupObj.Name
		backupResult.Phase = string(backupObj.Status.Phase)

		createTime := backupObj.CreationTimestamp

		getDay := math.Floor(time.Now().Sub(createTime.Time).Hours() / 24.0)

		if getDay == 0 {
			backupResult.Age = time.Now().Sub(createTime.Time).Round(time.Second).String()
			//fmt.Println(instancesetResult.Age)
		} else {
			backupResult.Age = fmt.Sprintf("%.0f", getDay) + "d"
			//fmt.Println(instancesetResult.Age)
		}
		backupsResult.Backups = append(backupsResult.Backups, backupResult)
	}

	return backupsResult
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
		//fmt.Println(quantity.AsDec())
		//fmt.Println(quantity.Value() / 1000000000)
		sumPV += quantity.Value() / 1000000000
	}

	totalData.TotalLocalPVSize = strconv.FormatInt(sumPV, 10)+"Gi"
	totalData.AbnormalLocalPV = abnormalPV

	abnormalBackup := 0
	//totalBackup := 0
	runningBackup := 0
	//
	for _, back := range totalbackup.Items {
		if back.Status.Phase == "Succeeded" {

		} else if back.Status.Phase == "Running" {
			runningBackup++
		} else {
			abnormalBackup++
		}
		//totalBackup++
	}

	//fmt.Println(totalBackup, runningBackup, abnormalBackup)
	//totalData.totalBackup = totalBackup
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

	// create the clientset
	kubeClientset, err := kubernetes.NewForConfig(config)

    if err != nil {
        panic(err.Error())
    }

	mysqlClientset := mysqlclient.NewForConfigOrDie(config)


	//totaldataInstanceset, _ := mysqlClientset.MySQLV1().InstanceSets(metav1.NamespaceAll).Watch(metav1.ListOptions{})
	//
	//totaldataInstance, _ := mysqlClientset.MySQLV1().Instances(metav1.NamespaceAll).Watch(metav1.ListOptions{})
	//
	//totalbackup, _ := mysqlClientset.MySQLV1().Backups(metav1.NamespaceAll).Watch(metav1.ListOptions{})
	//
	//totaldataInstanceset

	//instancesetListsJSON, _ := json.MarshalIndent(instancesetLists, "", " ")

	//fmt.Println(string(instancesetListsJSON))

	//pvsJSON, _ := json.MarshalIndent(pvs, "", " ")

	//fmt.Println(string(pvsJSON))

	//runner.NewKubeSharedInformerFactory()
	//runner.NewMysqlSharedInformerFactory().
	//listwatch := cache.NewListWatchFromClient()

	//instances, err := mysqlClientset.MySQLV1().Instances(poster_namespace).Get("instanceset-0", metav1.GetOptions{})

	//fmt.Println(instances.Spec)

	//for()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{"PUT", "PATCH", "GET", "POST", "OPTIONS"},
		AllowHeaders: []string{"Origin"},
		ExposeHeaders: []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "http://localhost"
		},
		MaxAge: 12 * time.Hour,
	}))

	r.GET("/ping", func(c *gin.Context) {


		c.JSON(200, gin.H{
			"message" : "pong",
		})
	})

	r.GET("/all", func(c *gin.Context){
		//instancesetList, _ := mysqlClientset.MySQLV1().InstanceSets(metav1.NamespaceAll).List(metav1.ListOptions{})
		//c.JSON(200, instancesetCall(mysqlClientset))
		//fmt.Println(totaldatacall(mysqlClientset, kubeClientset))
		c.JSON(200, totaldatacall(mysqlClientset, kubeClientset))
		//instancesList, _ := mysqlClientset.MySQLV1().Instances(metav1.NamespaceAll).List(metav1.ListOptions{})
		//haconfig, _ := mysqlClientset.MySQLV1().Backups(metav1.NamespaceAll).List(metav1.ListOptions{})
		//backup, _ := mysqlClientset.MySQLV1().Backups(metav1.NamespaceAll).List(metav1.ListOptions{})
		//kubeClientset.CoreV1().PersistentVolumes().List(metav1.ListOptions{})
	})

	r.GET("/instanceset", func(c *gin.Context) {

		//mysqlClientset.MySQLV1().RESTClient().
		c.JSON(200, instancesetCall(mysqlClientset))

	})

	r.GET("/instance", func(c *gin.Context) {
		c.JSON(200, instanceCall(mysqlClientset))
	})

	r.GET("/haconfig", func(c *gin.Context) {
		c.JSON(200, haconfigcall(mysqlClientset))
	})

	r.GET("/backup", func(c *gin.Context) {
		c.JSON(200, backupcall(mysqlClientset))
	})

	r.GET("/namespace", func(c *gin.Context){
		c.JSON(200, metav1.NamespaceAll)
	})

	r.Run("127.0.0.1:8080")
}