echo "Waiting for containers to be up..."
        while : ; do
          if [[ "$(docker compose -f docker-compose.sdk.yml ps --services --filter "status=running" | wc -l)" == "$(docker compose -f docker-compose.sdk.yml config --services | wc -l)" ]]; then
            echo "All containers are up!"
            docker ps
            break
          fi
          echo "Not all containers are up. Waiting..."
          sleep 10
        done
