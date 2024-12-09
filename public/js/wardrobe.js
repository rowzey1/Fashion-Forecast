document.querySelectorAll(".delete-item").forEach((button) => {
  button.addEventListener("click", function () {
    const itemId = this.getAttribute("data-id");
    fetch(`/wardrobe/delete/${itemId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Remove the item from the DOM
          this.closest(".clothing-item").remove();
          alert("Item deleted successfully");
        } else {
          alert("Error deleting item");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
