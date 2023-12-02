-- demo users table
create table users(
    user_id serial primary key,
    email varchar(255) unique not null,
    password varchar(255) not null,
    phone varchar(20) unique not null,
    address varchar(100) not null,
    created_at date default current_date
);

-- Donators
CREATE TABLE donators(
    donator_id serial primary key,
    email varchar(255) unique not null,
    password varchar(255) not null,
    name varchar(20) not null,
    phone varchar(20) unique not null,
    address varchar(100) not null,
    created_at date default current_date
);


-- Embassador

CREATE TABLE Embassadors (
    embassador_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE,
    country VARCHAR(50),
    nationality VARCHAR(50),
    description TEXT,
    resume VARCHAR(200),
    self_intro_video VARCHAR(200), -- Assuming a link or reference to the video
    embassador_type VARCHAR(20) CHECK (embassador_type IN ('Country Embassador', 'Student Embassador'))
);

-- Blogs

CREATE TABLE Blogs (
    blog_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT NOT NULL,
    tags TEXT[], -- Using PostgreSQL array type for storing tags
    image_url VARCHAR(255), -- Storing URL to the image
    video_url VARCHAR(255) -- Optional field for video URL
);


-- Events

CREATE TABLE Events (
    event_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255),
    video_url VARCHAR(255),
    google_form_link VARCHAR(255)
);


-- Campaigns

CREATE TABLE Campaigns (
    campaign_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    short_description TEXT,
    long_description TEXT,
    video_url VARCHAR(255),
    department VARCHAR(50) CHECK (department IN ('Department A', 'Department B', 'Department C')), -- Option set as requested
    featured_image_url VARCHAR(255),
    gallery_images TEXT[], -- Storing URLs to multiple images in an array
    target_fund_dollars DECIMAL(15, 2),
    target_fund_rupees DECIMAL(15, 2),
    achieved_fund DECIMAL(15, 2),
    start_date DATE,
    end_date DATE
);


--  tinkeringlabprojects

CREATE TABLE TinkeringLabProjects (
    project_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    team_members TEXT[] NOT NULL,
    images TEXT[] NOT NULL,
    featured_image_url VARCHAR(255) NOT NULL,
    mentor VARCHAR(100) NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('completed', 'in progress', 'not started', 'overdue', 'on hold'))
);
