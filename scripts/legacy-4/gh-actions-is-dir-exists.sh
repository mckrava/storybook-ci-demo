#!/bin/bash

DIR=$1

if [ -d "$DIR" ]; then
  echo true
else
  echo false
fi