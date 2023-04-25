#!/bin/sh
if [ $# -eq 0 ]
then
    echo "Using default profile: dev"
    cp .env.dev .env
else
    cp .env.$1 .env
fi

if [ $? -ne 0 ]
then
    echo "No suitable profile found for: '$1'"
    exit
fi

echo "Active Profile: $1"
npm run dev
