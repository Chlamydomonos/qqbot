#!/bin/bash
rm /origin/package.json
cp /app/package.json /origin

echo "Installing plugins..."
while read line
do
    echo `Installing plugin $line...`
    npm install @chlamydbot/$line
done < /app/files/plugin.txt

echo "Starting App..."

node /app/dist/main.js &
pid="$!"

stopApp() {
    node /app/files/closeApp.js
    wait $pid
    exit 0
}

trap stopApp SIGTERM
wait