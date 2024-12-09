document.getElementById('save-outfit').addEventListener('click', function() {
    const outfit = []; // Collect the outfit data from the page
    document.querySelectorAll('.clothing-item').forEach(item => {
        outfit.push({
            image: item.querySelector('img').src,
            category: item.querySelector('.item-details p:nth-child(1)').textContent.split(': ')[1],
            season: item.querySelector('.item-details p:nth-child(2)').textContent.split(': ')[1]
        });
    });

    fetch('/favorites/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ outfit })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Error saving outfit:', error);
    });
});