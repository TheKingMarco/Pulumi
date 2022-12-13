import * as pulumi from "@pulumi/pulumi";
import { resources, network , containerservice } from "@pulumi/azure-native";
//import * as azure from "@pulumi/azure";


//dichiarazione variabili
const config = new pulumi.Config("azure");
const location = config.get("location");
const env = config.get("enviroment");
const client = config.get("client");
const address_space = config.requireObject<string[]>("address_space");
const aks_subnet = config.get("aks_subnet");
const node_count = config.requireNumber("node_count");
const kubernetes_version = config.get("kubernetes_version");
const aks_dns_prefix = config.get("aks_dns_prefix");
const tags = {
    enviroment: `${env}`,
    client: `${client}`,
};

//create a resource group
const rg = new resources.ResourceGroup("rg-main", {
    resourceGroupName: `rg-${env}-${client}`,
    location: location,
    tags: tags,
});

//create a vnet
const vnet = new network.VirtualNetwork("vnet", {
    addressSpace: {
        addressPrefixes: address_space,
    },
    location: location,
    resourceGroupName: rg.name,
    virtualNetworkName: `vnet-${env}-${client}`,
    tags: tags,
});

//create a subnet
const subnet = new network.Subnet("subnet-aks", {
    addressPrefix: aks_subnet,
    resourceGroupName: rg.name,
    subnetName: `subnet-${env}-${client}`,
    virtualNetworkName: vnet.name,
});

/* //creazione AKS
new containerservice.ManagedCluster("aks", {
addonProfiles: {},
    agentPoolProfiles: [{
        count: node_count,
        mode: "System",
        name: "nodepool1",
        osType: "Linux",
        type: "VirtualMachineScaleSets",
        vmSize: "Standard_DS2_v2",
        enableAutoScaling: true,
        maxCount: 3,
        minCount: 1,
    }],
    apiServerAccessProfile: {
        enablePrivateCluster: true,
    },
    dnsPrefix: aks_dns_prefix,
    enableRBAC: true,
    kubernetesVersion: kubernetes_version,
    location: location,
    resourceGroupName: rg.name,
    resourceName: `aks-${env}-${client}`,
    servicePrincipalProfile: {
        clientId: "0b744301-1796-4f48-b20b-5583cb08b158",
        secret: "Sv38Q~1sS2URAoAUuNNA7h3jhqugK-kGQ5Geicf9",
    },
    tags: tags
});
 */
/* //Utilizzo API Azure-Classic (Terraform) per la creazione di uno storage account per il backend
const rgBackend = new azure.core.ResourceGroup("rg-backend", {
    name: `rg-backend-${env}-${client}`,
    location: "West Europe",
});
const StorageAccountBackend = new azure.storage.Account("StorageAccountBackend", {
    resourceGroupName: rgBackend.name,
    location: location,
    accountTier: "Standard",
    accountReplicationType: "LRS",
    tags: tags,
});
const ContainerBackend = new azure.storage.Container("ContainerBackend", {
    storageAccountName: StorageAccountBackend.name,
    containerAccessType: "private",
});
 */