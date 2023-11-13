# API Lifecycle Hub

An attempt at an opinionated API Lifecycle management application.  This project
pulls together a number of open source solutions into a single integrated way to
build, deploy, and manage API applications.

The following projects are included in the API Lifecycle solution:

1. Apicurio API Designer (Design)
2. Apicurio Registry (Registration)
3. Microcks (Mocking)
4. Quarkus (Development)
5. Kubernetes (Deploy)
6. Apiman (Management)

# Requirements

Ultimately the goal of this project is to bring together the above projects into
a single solution to the API Lifecycle problem.  Due to the complexity of the 
problem and the number of projects involved (with likely more to come in the future),
there is a hard requirement on a kubernetes cluster to deploy all of the components.
Initial work on this project has been done using `minikube`, with the eventual goal
of a smooth transition to production kubernetes environments.

* minikube
* kubectl
* docker

# Reset minikube (fresh installation)

Before installing all of the components in minikube, you might want to reset your 
cluster with the following commands:

    minikube stop
    minikube delete

# Installation

    minikube start --driver=docker --memory 16384 --cpus 4
    minikube addons enable ingress

## Update your /etc/hosts file

There are multiple ingresses needed for the configuration.  For the ingresses to work 
nicely in minikube, you will need to add the following mappings to your `/etc/hosts`
file:

    MINIKUBE_IP keycloak.local
    MINIKUBE_IP designer.local
    MINIKUBE_IP designer-api.local
    MINIKUBE_IP registry.local
    MINIKUBE_IP registry-api.local

Replace the `MINIKUBE_IP` above with the IP address of your minikube cluster.  You can
find that by doing this:

    minikube ip

## Keycloak

    kubectl create namespace keycloak
    kubectl create configmap keycloak-realm-config --from-file=deployments/keycloak/config/keycloak-realm-full.json -n keycloak
    kubectl apply -f ./deployments/keycloak/database.yaml -n keycloak
    kubectl apply -f ./deployments/keycloak/application.yaml -n keycloak

Note: the default admin credentials are `admin/admin`.

Note: a non-admin user is also created with credentials `user/password`.

## Apicurio API Designer

    kubectl create namespace api-designer
    kubectl apply -f ./deployments/apicurio/api-designer/database.yaml -n api-designer
    kubectl apply -f ./deployments/apicurio/api-designer/application.yaml -n api-designer
    kubectl apply -f ./deployments/apicurio/api-designer/ui.yaml -n api-designer

## Apicurio Registry

    kubectl create namespace api-registry
    kubectl apply -f ./deployments/apicurio/api-registry/database.yaml -n api-registry
    kubectl apply -f ./deployments/apicurio/api-registry/application.yaml -n api-registry
    kubectl apply -f ./deployments/apicurio/api-registry/ui.yaml -n api-registry

## Microcks

    kubectl create namespace microcks
    kubectl apply -f ./deployments/microcks/mongo.yaml -n microcks
    kubectl apply -f ./deployments/microcks/postman.yaml -n microcks
    kubectl apply -f ./deployments/microcks/application.yaml -n microcks

## Apicurio API Lifecycle Components

    kubectl create namespace api-lifecycle
    kubectl apply -f ./deployments/apicurio/validator/application.yaml -n api-lifecycle

## Echo Test Applications

    kubectl create namespace echo-1
    kubectl apply -f ./deployments/testing/echo-1/application.yaml -n echo-1
    kubectl create namespace echo-2
    kubectl apply -f ./deployments/testing/echo-2/application.yaml -n echo-2
