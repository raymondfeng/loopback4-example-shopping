#!/bin/bash

BASE_DIR=`dirname "$0"`

# Use a custom cluster name
CLUSTER_NAME=shopping-cluster

# Start minikube
minikube start -p ${CLUSTER_NAME}

# Build docker images for shopping and recommender for the minikube cluster
pushd "${BASE_DIR}/.."
eval $(minikube -p ${CLUSTER_NAME} docker-env)
npx lerna run docker:build
popd

kubectl config use-context ${CLUSTER_NAME}

# Set up helm
kubectl create serviceaccount --namespace kube-system tiller
kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller
helm init --service-account tiller

# Install the shopping app
helm install --name shopping-app --debug "${BASE_DIR}/shopping-app"

# Start dashboard
minikube dashboard -p ${CLUSTER_NAME} &

# Open shopping-app
minikube service shopping-app -p ${CLUSTER_NAME}

