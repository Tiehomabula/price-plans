
create table if not EXISTS plan_total (
    id integer primary key AUTOINCREMENT,
    total real,
    plan_name text,
    FOREIGN KEY  (plan_name) REFERENCES  price_plan (plan_name)
);


-- INSERT INTO plan_total (total, plan_name) values(100, 'sms 101')

-- delete from plan_total where id < 5

select SUM(total) from plan_total where plan_name = "call 201";