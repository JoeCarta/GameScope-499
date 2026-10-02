-- ============================================================
-- DATABASE
-- ============================================================

create database if not exists game_reviews
    character set utf8mb4 collate utf8mb4_general_ci;

use game_reviews;

-- ============================================================
-- GAMES
-- ============================================================

create table if not exists games(
    game_id int unsigned auto_increment not null,
    app_id int unsigned not null,
    game_name varchar(255) not null,
    game_release_date date not null,
    game_description text,
    game_developer varchar(255) not null,
    game_publisher varchar(255) not null,
    game_price decimal(10,2) not null,

    primary key (game_id),
) ENGINE = InnoDB;


-- ============================================================
-- REVIEWS
-- ============================================================

create table if not exists reviews(
    game_id int unsigned not null,
	review_id varchar(255) not null,
    review_text text,
    recommended boolean not null,
    playtime_hours decimal(10,2),
    playtime_at_review_hours decimal(10,2),
    helpful_votes int not null default 0,
    language varchar(50),

    primary key (review_id),
    foreign key (game_id) 
    references games(game_id)
    on update cascade
    on delete cascade

    constraint chek_revs_help_vote
        check (helpful_votes >= 0)

    constraint chek_revs_play_time
        check (playtime_hours >= 0 and playtime_hours is null)
    
        constraint chek_revs_play_time_at_rev
        check (playtime_at_review_hours >= 0 and playtime_at_review_hours is null)

) ENGINE = InnoDB;


-- ============================================================
-- IMPORTING_REVIEWS
-- ============================================================

create table if not exists reviews_import(
    import_id int unsigned auto_increment not null,
    game_id int unsigned not null,
    source_filename varchar(255) not null,
    import_started_at timestamp not null default current_timestamp,
    import_completed_at timestamp null default null,
    reviews_in_file int unsigned not null default 0,
    reviews_imported int unsigned not null default 0,
    reviews_skipped int unsigned not null default 0,

    status enum (
        'Started',
        'Completed',
        'Failed'
    ) not null default 'Started',

    error_message text null default null,
    primary key (import_id),

    constraint fk_imports_game_id
        foreign key (game_id)
        references games(game_id)
        on update cascade
        on delete cascade
) ENGINE = InnoDB;


show tables;

describe reviews;

select * from reviews;