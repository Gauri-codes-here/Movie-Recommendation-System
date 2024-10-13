const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');  // Use path to resolve file paths correctly
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

let movies = [];

// Load the movie data from the CSV file
const csvFilePath = path.join(__dirname, 'movies.csv');  // Ensure the file path is correct
fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }
    const rows = data.split('\n');
    
    // Skip the header and map rows to movie objects
    movies = rows.slice(1).map(row => {
        const [title, year, rating, genre] = row.split(',');

        // Ensure the row is valid before converting to an object
        if (title && year && rating && genre) {
            return { 
                title, 
                year: parseInt(year.trim()), 
                rating: parseFloat(rating.trim()), 
                genre: genre.trim() 
            };
        }
        return null;  // Return null for invalid rows
    }).filter(movie => movie !== null);  // Filter out invalid rows

    console.log('Movies data loaded.');
});

// POST endpoint for recommendations
app.post('/recommend', (req, res) => {
    const { year, rating, genre } = req.body;
    console.log(req.body); 

    let filteredMovies = movies;

    // Only filter by year if a valid year is provided (non-empty and non-null)
    if (year && year.trim() !== '') {
        filteredMovies = filteredMovies.filter(movie => movie.year === parseInt(year.trim()));
    }

    // Always filter by rating if provided
    if (rating) {
        filteredMovies = filteredMovies.filter(movie => movie.rating >= parseFloat(rating.trim()));
    }

    // Always filter by genre if provided
    if (genre && genre.trim() !== '') {
        filteredMovies = filteredMovies.filter(movie => movie.genre.toLowerCase() === genre.toLowerCase().trim());
    }

    // Send back the filtered list of movies, or a message if no movies found
    if (filteredMovies.length > 0) {
        res.json({ movies: filteredMovies });
    } else {
        res.json({ message: 'No movies found for the selected criteria.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
