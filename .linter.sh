#!/bin/bash
cd /home/kavia/workspace/code-generation/riverquest-the-strategic-crossing-94110-94117/main_container_for_riverquest
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

