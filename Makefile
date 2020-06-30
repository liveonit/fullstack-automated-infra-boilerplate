include .env

create_config:
	docker-compose up -d templates

build_api_prodduction:
	cd microservicios/api && npm run build && docker build -t ibarretorey/fs-api:production . && cd -

build_api_staging:
	cd microservicios/api && npm run build && docker build -t ibarretorey/fs-api:staging . && cd -

k8s_create_update_envs:
	kubectl create configmap general-env-vars --from-file=./.env -o yaml --dry-run=client | kubectl replace -f - | true

minikube_db_up:
	make k8s_create_update_envs
	kubectl apply -f k8s/db/galera-etcd-cluster.yaml
	kubectl apply -f k8s/db/mariadb-pvc.yaml
	kubectl apply -f k8s/db/mariadb-pv.yaml
	kubectl apply -f k8s/db/mariadb-ss.yaml

minikube_db_down:
	kubectl delete -f k8s/db/mariadb-ss.yaml
	kubectl delete -f k8s/db/mariadb-pvc.yaml
	kubectl delete -f k8s/db/mariadb-pv.yaml
	kubectl delete -f k8s/db/galera-etcd-cluster.yaml

minikube_api_up:
	make k8s_create_update_envs
	kubectl apply -f k8s/api/deploy.yaml
	kubectl apply -f k8s/api/service.yaml
	kubectl apply -f k8s/api/ingress.yaml

minikube_api_down:
	kubectl delete -f k8s/api/deploy.yaml
	kubectl delete -f k8s/api/service.yaml
	kubectl delete -f k8s/api/ingress.yaml

build_db:
	cd microservicios/db && docker build -t ibarretorey/mariadb:latest . && cd -

minikube_db_run_migrations:
	make k8s_create_update_envs
	cd ./microservicios/db && DB_HOST=${SERVICE_URL} DB_PORT=${EXTERNAL_DB_PORT} DB_USER=${DB_USER} DB_PASSWORD=${DB_PASSWORD} API_DB_NAME=${API_DB_NAME} npm run typeorm migration:run && cd -

develop_db_run_migrations:
	cd ./microservicios/db && DB_HOST=${SERVICE_URL} DB_PORT=${EXTERNAL_DB_PORT} DB_USER=${DB_USER} DB_PASSWORD=${DB_PASSWORD} API_DB_NAME=${API_DB_NAME} npm run typeorm migration:run && cd -

test_env:
	echo "${REACT_APP_API_URL}"

# TODO: k8s_keycloak_up:

# TODO: k8s_keycloak_down:

# TODO: k8s_dashboard_up:

# TODO: k8s_dashboard_down:

# TODO: k8s_up:

# TODO: k8s_down:

minikube_deploy:
	minikube start && minikube addons enable ingress

minikube_tear_down:
	minikube stop && minikube delete