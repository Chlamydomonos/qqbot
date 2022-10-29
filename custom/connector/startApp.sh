#!/bin/bash
rm /origin/package.json
cp /app/package.json /origin
chmod 666 /origin/package.json

echo "Installing plugins..."
while read line
do
    echo "Installing plugin $line..."
    npm install @chlamydbot/$line
done < /app/files/plugin.txt

echo "Updating plugins..."
npm update

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