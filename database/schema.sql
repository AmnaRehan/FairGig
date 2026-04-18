CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT,
    city TEXT,
    zone TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE earnings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    platform TEXT,
    date DATE,
    hours FLOAT,
    gross FLOAT,
    deductions FLOAT,
    net FLOAT,
    verification_status TEXT,
    screenshot_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE complaints (
    id SERIAL PRIMARY KEY,
    user_id INT,
    platform TEXT,
    category TEXT,
    description TEXT,
    status TEXT,
    tags TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);