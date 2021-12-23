#!/bin/bash

chmod -R 777 ./gh-actions-wait-for-log-message.sh
. ./gh-actions-wait-for-log-message.sh

test_logfile=$(mktemp)
yarn testnet:start 2>&1 | tee "${test_logfile}" &

message='POLKADOT LAUNCH COMPLETE'
echo Basilisk testnet run success triger message:: "$message"
wait_for_log_message "${test_logfile}" "$message"

echo ">>> Basilisk testnet has been launched successfully! >>>"
rm -f "${test_logfile}"