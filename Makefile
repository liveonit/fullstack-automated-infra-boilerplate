.Phony: template develop_db_run_api_migrations

include .env

template:
	docker-compose up templating

up_dev: template
	docker-compose up -d db
	sleep 30
	make develop_db_run_api_migrations
	docker-compose up -d --build --force-recreate

down_dev:
	docker-compose down

tear_down_dev:
	docker-compose down -v
	sudo rm -rf config_files

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
	cd ./microservicios/db && DB_HOST=${DOMAIN} DB_PORT=${EXTERNAL_DB_PORT} DB_USER=${DB_USER} DB_PASSWORD=${DB_PASSWORD} API_DB_NAME=${API_DB_NAME} npm run typeorm migration:run && cd -

develop_db_run_api_migrations:
	cd ./microservicios/db && \
	npm install && \
	DB_HOST=${DOMAIN} DB_PORT=${EXTERNAL_DB_PORT} \
	API_DB_USER=${API_DB_USER} API_DB_PASSWORD=${API_DB_PASSWORD} \
	API_DB_NAME=${API_DB_NAME} npm run typeorm migration:run && \
	cd -


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