document.addEventListener("DOMContentLoaded", function() {
    // Fetch weather data
    fetch('/api/weather') 
        .then(response => response.json())
        .then(data => {
            const temperature = data.temperature; 
            document.querySelector('.weather-info').innerHTML = `
                <p>Temperature: ${temperature} °F</p>
            `;

            // Fetch outfit suggestions based on temperature
            return fetch(`/suggestOutfits?temperature=${temperature}`);
        })
        .then(response => response.json())
        .then(outfits => {
            const outfitContainer = document.querySelector('.outfit-container');
            outfitContainer.innerHTML = ''; 

            if (outfits.length > 0) {
                outfits.forEach(outfit => {
                    outfitContainer.innerHTML += `
                        <div class="clothing-item">
                            <img src="${outfit.image}" alt="${outfit.category}" />
                            <div class="item-details">
                                <p>Category: ${outfit.category}</p>
                                <p>Season: ${outfit.season.join(', ')}</p>
                            </div>
                        </div>
                    `;
                });
            } else {
                outfitContainer.innerHTML = '<p>No outfits available for today.</p>';
            }
        })
        .catch(err => console.error('Error fetching data:', err));
});