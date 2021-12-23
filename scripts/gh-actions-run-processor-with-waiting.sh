#!/bin/bash

chmod -R 777 ./gh-actions-wait-for-log-message.sh
. ./gh-actions-wait-for-log-message.sh

processor_logfile=$(mktemp)
yarn processor:start 2>&1 | tee "${processor_logfile}" &

message='Starting the event queue'
echo Processor run success triger message:: "$message"
wait_for_log_message "${processor_logfile}" "$message"

echo ">>> Processor has been launched successfully! >>>"
rm -f "${processor_logfile}"