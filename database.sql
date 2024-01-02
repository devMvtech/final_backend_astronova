
-- Define the User table with a foreign key to Role

CREATE TABLE User (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,  -- Added last_name
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,  -- Increased length for address
    role VARCHAR(50) CHECK (role IN ('Donor', 'Coordinator', 'Ambassador', 'Admin')) NOT NULL,
    google_id VARCHAR(255),  -- Added google_id for Google authentication
    google_token TEXT,        -- Added google_token for Google authentication
    insta_url VARCHAR(255),
    postal_code VARCHAR(20),
    state VARCHAR(255),
    country VARCHAR(255),
    twitter_url VARCHAR(255)
);



-- Define the Ambassador table with a foreign key to User
CREATE TABLE Ambassador (
    ambassador_id INT PRIMARY KEY REFERENCES "User"(user_id),
    email VARCHAR(255) NOT NULL,
    donors INT[] REFERENCES "User"(user_id), 
    ambassador_type VARCHAR(20) CHECK (ambassador_type IN ('Country Ambassador', 'Student Ambassador')) NOT NULL
);

-- Define the Payment table with a foreign key to Campaigns
CREATE TABLE Payment (
    payment_id SERIAL PRIMARY KEY,
    campaign_id INT REFERENCES Campaigns(campaign_id),
    donor_id INT REFERENCES "User"(user_id),
    amount_paid DECIMAL,
    payment_date DATE,
    -- Add other attributes as needed
);

CREATE TABLE AmbassadorRequest (
    request_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    dob DATE NOT NULL,
    country VARCHAR(100) NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    description TEXT,
    resume VARCHAR(255), 
    self_intro_video VARCHAR(255), 
    ambassador_type VARCHAR(20) CHECK (ambassador_type IN ('Country Ambassador', 'Student Ambassador')) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Approved', 'Rejected', 'Pending')) NOT NULL,
    user_id INT REFERENCES "User"(user_id)
);



-- Define the Events table with a foreign key to Coordinator
CREATE TABLE Events (
    event_id SERIAL PRIMARY KEY,
    coordinator_id INT REFERENCES "User"(user_id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    video VARCHAR(255),
    google_form_link VARCHAR(255)
    
);

-- Define the Blogs table with a foreign key to Coordinator
CREATE TABLE Blogs (
    blog_id SERIAL PRIMARY KEY,
    coordinator_id INT REFERENCES "User"(user_id),
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    tags VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],
    image VARCHAR(255),
    video VARCHAR(255)
);

-- Define the Campaigns table with foreign keys to Coordinator and Admin
CREATE TABLE Campaigns (
    campaign_id SERIAL PRIMARY KEY,
    coordinator_id INT REFERENCES "User"(user_id),
    admin_id INT REFERENCES "User"(user_id),
    title VARCHAR(255) NOT NULL,
    short_description TEXT,
    long_description TEXT,
    video VARCHAR(255),
    department VARCHAR(20) CHECK (department IN ('Subsidiaries', 'Innovation', 'Infrastructure')),
    featured_image VARCHAR(255),
    gallery_images VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],
    target_fund_dollars DECIMAL,
    target_fund_rupees DECIMAL,
    achieved_fund DECIMAL,
    start_date DATE,
    end_date DATE,
    -- Add other attributes as needed
);

-- Define the TinkeringLabProjects table with foreign keys to Admin
CREATE TABLE TinkeringLabProjects (
    project_id SERIAL PRIMARY KEY,
    admin_id INT REFERENCES "User"(user_id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description TEXT,
    team_members VARCHAR[][] DEFAULT ARRAY[]::VARCHAR[][],
    images VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],
    featured_image_url VARCHAR(255),
    mentor VARCHAR(255),
    priority VARCHAR(255) CHECK (priority IN ('high', 'medium', 'low')),
    status VARCHAR(255) CHECK (status IN ('approved', 'pending', 'rejected')),
);


CREATE TABLE invoices (
    invoice_id SERIAL PRIMARY KEY,
    coordinator_id INT REFERENCES "User"(user_id),
    title VARCHAR(255),
    email VARCHAR(255),
    mode_of_payment VARCHAR(50) CHECK (mode_of_payment IN ('cash', 'digital')),
    address VARCHAR(255),
    description TEXT,
    quantity INT,
    rate DECIMAL(10, 2),
    amount DECIMAL(10, 2),
    tax_id VARCHAR(20),
    invoice_date DATE,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE testimonials(
    testimonial_id SERIAL PRIMARY KEY,
    coordinator_id INT REFERENCES "User"(user_id),
    name VARCHAR(255) NOT NULL,
    campaign_name VARCHAR(255) NOT NULL,
    image_url VARCHAR(255), -- Assuming you store the image URL
    description TEXT NOT NULL
);

-- You can add any additional constraints or indexes as needed.
-- Define a composite type for team member
CREATE TYPE team_member_type AS (
    name VARCHAR(100),
    profile_img VARCHAR(255),
    position VARCHAR(100)
);

-- Create the project table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    cover_img VARCHAR(255) NOT NULL,
    title VARCHAR(100) NOT NULL,
    subtitle VARCHAR(255),
    short_description TEXT,
    long_description TEXT,
    team_members JSONB[],
    product_img VARCHAR[],
    status VARCHAR(255) CHECK (status IN ('approved', 'pending', 'rejected', 'ongoing')),
    admin_id INT REFERENCES "User"(user_id)
);

CREATE TABLE members (
    member_id SERIAL PRIMARY KEY,
    profile_img VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL
);
