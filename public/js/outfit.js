document.getElementById('save-outfit').addEventListener('click', function() {
    const outfit = []; // Collect the outfit data from the page
    const outfitItems = document.querySelectorAll('.outfit-item');

    outfitItems.forEach(item => {
        const imageElement = item.querySelector('img');
        

        if (imageElement) {
            outfit.push({
                image: imageElement.src,
                
            });
        }
    });

    if (outfit.length === 0) {
        alert('No outfit data found to save.');
        return;
    }

    fetch('/favorites/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ outfit })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
        } else {
            alert('Failed to save outfit.');
        }
    })
    .catch(error => {
        console.error('Error saving outfit:', error);
        alert('An error occurred while saving the outfit.');
    });
});



document.getElementById('reload-outfit').addEventListener('click', function() {
    location.reload(); 
  });