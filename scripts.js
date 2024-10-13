// Hide modal when the page loads
window.onload = function () {
    document.getElementById('modal').style.display = 'none';
};

document.getElementById('movieForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const year = document.getElementById('year').value || ''; // Year is optional, default to empty string
    const rating = document.getElementById('rating').value;
    const genre = document.getElementById('genre').value;

    // Use backticks for string interpolation
    console.log(`Sending request with year: ${year || 'No Year'}, rating: ${rating}, genre: ${genre}`);
    console.log({ year, rating, genre });  // Check if the form data is correct

    // Send a request to the backend
    fetch('http://localhost:3000/recommend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ year, rating, genre }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data received:', data);

        const modal = document.getElementById('modal');
        const recommendationsDiv = document.getElementById('recommendations');
        recommendationsDiv.innerHTML = ''; // Clear previous recommendations

        if (data.movies && data.movies.length > 0) {
            data.movies.forEach(movie => {
                // Use backticks for HTML string interpolation
                recommendationsDiv.innerHTML += `<p>${movie.title} (${movie.year}) - IMDb: ${movie.rating}</p>`;
            });
        } else {
            recommendationsDiv.innerHTML = '<p>No movies found for the selected criteria.</p>';
        }

        // Show the modal after the recommendations are loaded
        modal.style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Close the modal when the user clicks the close button
document.querySelector('.close').addEventListener('click', function () {
    document.getElementById('modal').style.display = 'none';
});

// Close the modal if the user clicks outside of it
window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
