const request = require('supertest');
const express = require('express');
const cors = require('cors');
// Mocking app for isolation or we could require the real one if we exported it
// But since index.js runs server on import, it's better to create a test app or refactor index.js
// For this quick check, I will try to hit the running local server if possible, or just build a test case
// Actually, let's use the running server URL effectively.

// Wait, I can't hit the running server easily from Jest without axios.
// Let's create a script that uses fetch/axios to hit the locally running server.

const axios = require('axios');

const testLogin = async () => {
    try {
        console.log("Attempting login...");
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@kean.edu',
            password: 'adminPassword123!'
        });

        console.log("Login Successful!");
        console.log("Status:", response.status);
        console.log("Data:", response.data);
    } catch (error) {
        if (error.response) {
            console.error("Login Failed:", error.response.status, error.response.data);
        } else {
            console.error("Error:", error.message);
        }
    }
};

testLogin();
