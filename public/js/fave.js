document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', function() {
        const outfitId = this.getAttribute('data-id');
        console.log('Attempting to delete outfit with ID:', outfitId);
        fetch(`/favorites/delete/${outfitId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Outfit deleted successfully!');
                location.reload(); // Reload the page to update the list
            } else {
                alert('Failed to delete outfit.');
            }
        })
        .catch(error => {
            console.error('Error deleting outfit:', error);
            alert('An error occurred while deleting the outfit.');
        });
    });
});