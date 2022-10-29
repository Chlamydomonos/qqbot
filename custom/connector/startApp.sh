#!/bin/bash
rm /origin/package.json
cp /app/package.json /origin

while read -r line
do
   npm install @chlamydbot/$line
done < /app/files/plugin.txt

node /app/dist/main.js &
pid="$!"

stopApp() {
    node /app/files/closeApp.js
    wait $pid
    exit 0
}

trap stopApp SIGTERM
wait