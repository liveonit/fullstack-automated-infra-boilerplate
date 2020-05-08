.PHONY: dc_up dc_up_build dc_down build_api_prod

dc_up:
	cd deploy/docker-compose && docker-compose up -d --force-recreate && cd -

dc_up_build:
	cd deploy/docker-compose && docker-compose up -d --build --force-recreate && cd -

dc_down:
	cd deploy/docker-compose && docker-compose down -v && cd -

build_api_prod:
	cd microservicios/api && npm run build && docker build -t ibarretorey/fs-api-production -f Dockerfile.production . && cd -

k8s_db_up:
	kubectl apply -f deploy/k8s/db/galera-etcd-cluster.yaml
	kubectl apply -f deploy/k8s/db/mariadb-pvc.yaml
	kubectl apply -f deploy/k8s/db/mariadb-pv.yaml
	kubectl apply -f deploy/k8s/db/mariadb-ss.yaml	
k8s_db_down:
	kubectl delete -f deploy/k8s/db/mariadb-ss.yaml
	kubectl delete -f deploy/k8s/db/mariadb-pvc.yaml
	kubectl delete -f deploy/k8s/db/mariadb-pv.yaml
	kubectl delete -f deploy/k8s/db/galera-etd-cluster.yaml

k8s_api_up:
	kubectl apply -f deploy/k8s/api/api.yaml

k8s_api_down:
	kubectl delete -f deploy/k8s/api/api.yaml

# TODO: k8s_keycloak_up:

# TODO: k8s_keycloak_down:

# TODO: k8s_dashboard_up:

# TODO: k8s_dashboard_down:

# TODO: k8s_up:

# TODO: k8s_down:
