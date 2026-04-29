CREATE TABLE refresh_tokens (
                                id SERIAL PRIMARY KEY,
                                user_id INTEGER REFERENCES users(id),
                                token TEXT NOT NULL,
                                expiry_date TIMESTAMP,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);