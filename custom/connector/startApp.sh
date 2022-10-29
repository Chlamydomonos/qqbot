# !/bin/bash
rm /origin/package.json
cp /app/package.json /origin

while read -r line
do
   npm install @chlamydbot/$line
done < /app/files/plugin.txt

node /app/dist/main.js