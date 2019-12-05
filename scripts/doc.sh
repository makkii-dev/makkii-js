#!/bin/bash

set -e

cd ../..
PATH=$(yarn bin):$PATH
cd -
documentation readme --shallow src/** src/**/*.ts --section=API