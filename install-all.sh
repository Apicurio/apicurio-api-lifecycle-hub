#!/bin/sh

read -p "Reset/clean/restart minikube? [n] " SHOULD_RESET

if [ -z "$SHOULD_RESET" ]
then
    SHOULD_RESET="n"
fi

if [[ $SHOULD_RESET = "y" ]]
then
    echo "Resetting you minikube environment."
    minikube stop
    minikube delete
    minikube start --driver=docker --memory 16384 --cpus 4
    minikube addons enable ingress
    echo "Minikube installed, please wait..."
    sleep 20
fi

# Install keycloak
echo "--"
echo "Installing Keycloak"
kubectl create namespace keycloak --dry-run=client -o yaml | kubectl apply -f -
kubectl create configmap keycloak-realm-config --from-file=deployments/keycloak/config/keycloak-realm-full.json -n keycloak
kubectl apply -f ./deployments/keycloak/database.yaml -n keycloak
sleep 5
kubectl apply -f ./deployments/keycloak/application.yaml -n keycloak
sleep 20

# Install Apicurio API Designer
echo "--"
echo "Installing Apicurio API Designer"
kubectl create namespace designer --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -f ./deployments/apicurio/api-designer/database.yaml -n designer
sleep 5
kubectl apply -f ./deployments/apicurio/api-designer/application.yaml -n designer
kubectl apply -f ./deployments/apicurio/api-designer/ui.yaml -n designer
sleep 1

# Install Apicurio Registry
echo "--"
echo "Installing Apicurio Registry"
kubectl create namespace registry --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -f ./deployments/apicurio/api-registry/database.yaml -n registry
sleep 5
kubectl apply -f ./deployments/apicurio/api-registry/application.yaml -n registry
kubectl apply -f ./deployments/apicurio/api-registry/ui.yaml -n registry
sleep 1

# Install Microcks
echo "--"
echo "Installing Microcks"
kubectl create namespace microcks --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -f ./deployments/microcks/mongo.yaml -n microcks
sleep 5
kubectl apply -f ./deployments/microcks/postman.yaml -n microcks
kubectl apply -f ./deployments/microcks/application.yaml -n microcks
sleep 1

# Install Apicurio API Lifecycle Components
echo "--"
echo "Installing Lifecycle Hub Components"
kubectl create namespace lifecycle-hub --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -f ./deployments/apicurio/validator/application.yaml -n lifecycle-hub


# Summary
MINIKUBE_IP=`minikube ip`

echo "Installation completed.  Make sure you have the following in your /etc/hosts:"
echo ""
echo "$MINIKUBE_IP keycloak.local"
echo "$MINIKUBE_IP designer.local"
echo "$MINIKUBE_IP designer-api.local"
echo "$MINIKUBE_IP registry.local"
echo "$MINIKUBE_IP registry-api.local"
echo "$MINIKUBE_IP validator.local"
echo "$MINIKUBE_IP lifecycle-hub.local"
echo ""

echo "After that is done, point your browser here:"
echo ""
echo "  http://lifecycle-hub.local"
echo ""
echo "You can log in with:"
echo ""
echo "  username: user"
echo "  password: user"
echo ""
echo "You will be prompted to change your password.  Enjoy!"
