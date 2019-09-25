# Deploy Shopping Application as Cloud-native Microservices

The shopping example started early versions as a monolithic application. It has
been refactored and improved over time to make the application modular. The
source code is now hosted as a lerna monorepo with two packages:

- shopping (loopback4-example-shopping)
- recommender (loopback4-example-recommender)

In addition, two resources are required for the application:

- A MongoDB database for users and orders
- A Redis registry for shopping cart items

There are a few options used to run or test the application.

1. Use `recommender` as a development dependency for `shopping` and invoke
   recommender service in the same process.
2. Use [concurrently](https://github.com/kimmobrunfeldt/concurrently) to start
   `recommender` and `shopping` as two local processes. The communication
   between `shopping` and `recommender` is over REST or gRPC.

Similarly, we can start `mongodb` and `redis` in different ways:

1. Install `mongodb` and `redis` locally and start them as local processes
2. Use `travis` services for `mongodb` and `redis` for the CI
3. Use `docker` to start `mongodb` and `redis` containers.

You may start to wonder what's the best practice to deploy a composite
application like the shopping example that consists of multiple microservices,
especially to cloud environments. To answer such questions, we did some
experiment to explore how to bundle and deploy the shopping application as a
Kubernetes cluster. That leads to the introduction of Kubernetes based
deployment to remove inconsistencies and promote cloud-native microservices.

# Kubernetes based deployment

The shopping example application consists of multiple microservices that are
deployed as Docker containers managed by a kubernetes cluster.

This `kubernetes` directory contains the script and helm chart for the shopping
application.

![shopping-app cluster](k8s-shopping-cluster.png)

## Enable gRPC communication between shopping and recommender

## Integrate with cloud-native observability

- Health
- Metrics
- Distributed tracing

## Build docker images

We leverage multi-stage build to create docker images for `shopping` and
`recommender` microservices.

- Stage 1: Build deployable packages using lerna

  - Dockerfile.monorepo

- State 2: Copy `shopping` and `recommender` packages into their own images
  - Dockerfile.shopping
  - Dockerfile.recommender

```sh
npm run docker:build
```

## Organize deployment as an Helm chart

Instead of deploying each docker images by hand, we use `Helm` chart to describe
the composition of the application using Kubernetes artifacts. The chart is
described in `shopping-app`.

As illustrated above, the chart includes two deployments and corresponding
services:

- shopping (exposing REST endpoints)
- recommender (exposing REST and gRPC endpoints)

The chart depends on two other charts for the databases:

- [mongodb](https://github.com/helm/charts/tree/master/stable/mongodb)
- [redis](https://github.com/helm/charts/tree/master/stable/redis)

## Try it out

### Prerequisites

- [Docker](https://www.docker.com/)
- [Kubernetes](https://kubernetes.io/)
- [Minikube](https://github.com/kubernetes/minikube)
- [Helm](https://helm.sh/)

### Run the demo

```
cd loopback4-example-shopping
npm i
npm run build
./kubernetes/create-k8s.sh
```

## Future work

- [istio](https://istio.io/) integration
