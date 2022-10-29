# !/bin/bash
sudo rm /origin/package.json
sudo cp /app/package.json /origin

while read -r line
do
   npm install @chlamydbot/$line
done < /app/files/plugin.txt