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

# Installation
There is a happy little script called `install-all.sh` that you can run, which will
use the `minikube` and `kubectl` CLIs to install all necessary components into a
local minikube cluster.  The install script can optionally create/initialize the
minikube cluster for you, or you can simply let it install into the existing 
cluster.

# Usage
Once everything is installed and running, the following applications will be available:

* [Keycloak](http://keycloak.local)
* [Apicurio API Designer](http://designer.local)
* [Apicurio Registry](http://registry.local)
* [Microcks](http://microcks.local)
* [Lifecycle Hub](http://lifeycle-hub.local)

The best starting point is the [Lifecycle Hub](http://lifecycle-hub.local).  Happy API'ing!

Note: the default admin credentials for Keycloak are `admin/admin`.
Note: a non-admin user is available with credentials `user/user`.
