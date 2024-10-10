import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
  const shoppingList = document.getElementById('shopping-list');
  const addItemForm = document.getElementById('add-item-form');
  const newItemInput = document.getElementById('new-item-input');

  // Function to render the shopping list
  async function renderShoppingList() {
    const items = await backend.getItems();
    shoppingList.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <input type="checkbox" ${item.completed ? 'checked' : ''}>
        <span class="${item.completed ? 'completed' : ''}">${item.name}</span>
        <button class="delete-btn"><i class="fas fa-trash"></i></button>
      `;
      li.querySelector('input').addEventListener('change', async (e) => {
        await backend.updateItem(item.id, e.target.checked);
        renderShoppingList();
      });
      li.querySelector('.delete-btn').addEventListener('click', async () => {
        await backend.deleteItem(item.id);
        renderShoppingList();
      });
      shoppingList.appendChild(li);
    });
  }

  // Add new item
  addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const itemName = newItemInput.value.trim();
    if (itemName) {
      await backend.addItem(itemName);
      newItemInput.value = '';
      renderShoppingList();
    }
  });

  // Initial render
  renderShoppingList();
});
