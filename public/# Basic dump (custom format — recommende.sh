# Basic dump (custom format — recommended)
pg_dump -Fc --no-acl --no-owner -d $(heroku config:get "postgres://u9eqkf650vh9fb:pb0a75feb03b029656c812329dd129b277737fe201ffbac99befecef63062768a@c4c161t4pf58h3.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/dclsepibjsvlim" -a oecs-reporting) > mydb.dump

# Or set the URL as a variable first
DATABASE_URL=$(heroku config:get DATABASE_URL -a your-app-name)
pg_dump -Fc --no-acl --no-owner -d "$DATABASE_URL" > mydb.dump