#!/bin/bash
#본 프로그램은 DB를 백업하기 위한 프로그램 입니다.
#다음과 같이 백업됩니다.
#/백업디렉토리/날짜/DB명/테이블명.sql
## crontab -e
#03 00 * * * su - root -c '/home/backup/db_backup.sh &> /dev/null'

#백업디렉토리
backup_dir=/home/backup/db

find $backup_dir -ctime +7 -exec rm -rf {} \;

#보관수 (day)
backup_cnt=7

#DB root 비밀번호
db_root_pw="Meta20@)$HOSTNAME"



## get today
today="`date '+%Y.%m.%d.%H'`"


### delete old data
old_backup_dir="`ls -t $backup_dir 2>/dev/null`"
i=0
for dir in $old_backup_dir ; do
  i=$((i+1))
  if [ "$i" -gt "$backup_cnt" ] ; then
    echo "rm -rf $backup_dir/$dir"
    rm -rf $backup_dir/$dir
  fi
done



## create backup dir
mkdir -p $backup_dir/$today/

############# 링크를 만들어 준다.####
#rm -f /backup/$today
#ln -s $backup_dir/$today /$backup_dir/today


## get database list
db_list=`echo "show databases;" | mysql -uroot -p"$db_root_pw" | grep -v "Database"`

## get tables in each databaes
 for db in $db_list ;do
  # create backup dir db
  mkdir -p $backup_dir/$today/$db/
  table_list=`echo "show tables" | mysql -uroot -p"$db_root_pw" $db | grep -v "Tables_in"`
  for table in $table_list ; do
    echo "Backup \"$db\" Databse \"$table\" Table"
    mysqldump --quick --single-transaction --max_allowed_packet=1000M -uroot -p"$db_root_pw" $db $table > $backup_dir/$today/$db/${table}.sql
    echo "mysql -uroot -p\"$db_root_pw\" $db < $table.sql" >> $backup_dir/$today/$db/restore.sh
done
    chmod 700 $backup_dir/$today/$db/restore.sh
done
