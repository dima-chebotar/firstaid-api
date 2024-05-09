build: docker-build \
	   docker-up

up: docker-up

down: docker-down

restart: down up

docker-build:
	 docker-compose build

docker-up:
	 docker-compose up -d

docker-stop:
	 docker-compose stop

docker-down:
	 docker-compose down

docker-rmi:
	docker image prune -a

docker-rm:
	docker container prune

docker-rmv:
	docker volume prune

