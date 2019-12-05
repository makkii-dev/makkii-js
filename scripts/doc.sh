#!/bin/bash

set -e

cd ../..
PATH=$(yarn bin):$PATH
cd -
documentation readme --shallow src/** --section=API