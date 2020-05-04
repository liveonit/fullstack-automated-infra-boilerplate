.PHONY: dc_up dc_up_build dc_down build_api_prod

dc_up:
	cd deploy/docker-compose && docker-compose up -d --force-recreate && cd -

dc_up_build:
	cd deploy/docker-compose && docker-compose up -d --build --force-recreate && cd -

dc_down:
	cd deploy/docker-compose && docker-compose down -v && cd -

build_api_prod:
	cd microservicios/api && npm run build && docker build -t ibarretorey/fs-api-production -f Dockerfile.production . && cd -