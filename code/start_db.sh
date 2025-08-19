#!/bin/bash

echo "[start_db.sh] Starting MongoDB..."
sudo systemctl start mongod

echo "[start_db.sh] MongoDB is ready."