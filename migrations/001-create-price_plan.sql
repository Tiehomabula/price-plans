create table if not EXISTS price_plan (
    id integer primary key AUTOINCREMENT,
    plan_name text,
    sms_price real,
    call_price real
);

insert into price_plan (plan_name, sms_price, call_price) values ('sms 101', 2.35, 0.37);
insert into price_plan (plan_name, sms_price, call_price) values ('call 101', 1.75, 0.65);
insert into price_plan (plan_name, sms_price, call_price) values ('call 201', 1.85, 0.85);


