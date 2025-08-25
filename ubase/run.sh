#!/bin/bash

if [[ ! -d "/apps/main" ]] || [[ "$rebuild" == "true" ]]; then
    # echo "Cloning github token:${githubtoken}"

    git clone ${giturl} /apps/main

    # cp -r /apps/linux/node /apps/main/node_modules

    sleep 1

    cd /apps/main

    sleep 1

    echo 'Building'

    bun run buildlinux

    sleep 1
fi

cd /apps/main

bun run startlinux

echo 'Nextjs crashed :-('

node -e "setInterval(()=>{},1000)"
