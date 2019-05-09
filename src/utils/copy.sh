#!/bin/sh
d
cd D:/FE/Nodejs/node-blog/logs 
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log