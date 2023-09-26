#!/bin/bash

source ../.env

#deploy token
./deployToken.sh

#deploy game
./deployGame.sh

#deploy app
./deployApp.sh