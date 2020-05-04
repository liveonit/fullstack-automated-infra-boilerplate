.PHONY: dc_up dc_up_build dc_down

dc_up:
	cd deploy/docker-compose && docker-compose up -d --force-recreate && cd ..

dc_up_build:
	cd deploy/docker-compose && docker-compose up -d --build --force-recreate && cd ..

dc_down:
	cd deploy/docker-compose && docker-compose down -d --build --force-recreate && cd ..
