.PHONY: dc_up dc_up_build dc_down build_api_prod

dc_up:
	cd deploy/docker-compose && docker-compose up -d --force-recreate && cd -

dc_up_build:
	cd deploy/docker-compose && docker-compose up -d --build --force-recreate && cd -

dc_down:
	cd deploy/docker-compose && docker-compose down -v && cd -


build_api_prodduction:
	cd microservicios/api && npm run build && docker build -t ibarretorey/fs-api:production . && cd -

build_api_staging:
	cd microservicios/api && npm run build && docker build -t ibarretorey/fs-api:staging . && cd -


k8s_db:
	kubectl apply -f deploy/k8s/db/galera-etcd-cluster.yaml
	kubectl apply -f deploy/k8s/db/mariadb-pvc.yaml
	kubectl apply -f deploy/k8s/db/mariadb-pv.yaml
	kubectl apply -f deploy/k8s/db/mariadb-ss.yaml

k8s_db_down:
	kubectl delete -f deploy/k8s/db/mariadb-ss.yaml
	kubectl delete -f deploy/k8s/db/mariadb-pvc.yaml
	kubectl delete -f deploy/k8s/db/mariadb-pv.yaml
	kubectl delete -f deploy/k8s/db/galera-etd-cluster.yaml

k8s_db_run_migrations:
	cd ./microservicios/api && DB_HOST=fullstack.k8s.gql DB_PORT=30306 DB_USER=your_user DB_PASSWORD=your_pass DB_NAME=fullstack_db npm run typeorm migration:run && cd -

dc_db_run_migrations:
	cd ./microservicios/db && DB_HOST=fullstack.dc.gql DB_PORT=30306 DB_USER=your_user DB_PASSWORD=your_password DB_NAME=test_db npm run typeorm migration:run && cd -



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
