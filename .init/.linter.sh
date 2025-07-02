#!/bin/bash
cd /home/kavia/workspace/code-generation/taskmanager-118376-1ee7941d/todo_app_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

