#!/bin/bash
echo 'start java process for math equation visual checking'
java -jar mathequinspect-0.0.1-SNAPSHOT.jar --inspection.source.directory=/home/xy00/batch/ --inspection.image.server=http://72.93.93.61:9000/ &
