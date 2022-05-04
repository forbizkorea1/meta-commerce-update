#!/bin/bash
echo "03 00 * * * su - root -c '/home/backup/db_backup.sh &> /dev/null'" > ./cron.cmd
crontab ./cron.cmd
rm -f ./cron.cmd
