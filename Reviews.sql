USE game_reviews;

create table reviews (
	review_id varchar(255) primary key not null,
    app_id int not null,
    review_text text,
    recommended boolean not null,
    playtime_hours decimal(10,2),
    playtime_at_review_hours decimal(10,2),
    helpful_votes int default 0
	
);

show tables;

select * from reviews;