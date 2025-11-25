// Variável global para armazenar as unidades do estoque
// Será preenchida na view antes deste script rodar ou via data-attributes
let pantryUnits = {};

function initRecipeForm(unitsData) {
    pantryUnits = unitsData || {};
}

function autoSelectUnit(selectElement) {
    const ingredientId = selectElement.value;
    
    // Se houver uma unidade cadastrada para este ingrediente no estoque
    if (pantryUnits[ingredientId]) {
        const row = selectElement.closest('.ingredient-item');
        const unitSelect = row.querySelector('select[name="units[]"]');
        
        // Define o valor do select de unidade, APENAS se o campo estiver vazio
        if (unitSelect.value === "") {
            unitSelect.value = pantryUnits[ingredientId];
        }
    }
}

function addIngredient(ingredientsData) {
    const list = document.getElementById('ingredients-list');
    const newItem = document.createElement('div');
    newItem.classList.add('ingredient-item');
    
    // Constrói as opções do select baseadas nos dados recebidos
    let ingredientOptions = '';
    if (ingredientsData && ingredientsData.length > 0) {
        ingredientsData.forEach(ing => {
            ingredientOptions += `<option value="${ing.id}">${ing.name}</option>`;
        });
    }

    newItem.innerHTML = `
        <select name="ingredientIds[]" required onchange="autoSelectUnit(this)">
            <option value="">-- Ingrediente --</option>
            ${ingredientOptions}
        </select>
        <input type="number" name="quantities[]" placeholder="Qtd" step="any" required style="max-width: 100px;">
        <select name="units[]" required style="max-width: 150px;">
            <option value="">-- Unid. --</option>
            <optgroup label="Peso">
                <option value="g">g</option>
                <option value="kg">kg</option>
            </optgroup>
            <optgroup label="Volume">
                <option value="ml">ml</option>
                <option value="l">l</option>
            </optgroup>
            <optgroup label="Outros">
                <option value="un">un</option>
                <option value="xic">xícara</option>
                <option value="col_sopa">col. sopa</option>
                <option value="col_cha">col. chá</option>
            </optgroup>
        </select>
        <button type="button" class="btn-remove-ingredient" onclick="removeIngredient(this)">Remover</button>
    `;
    list.appendChild(newItem);
}

function removeIngredient(button) {
    const list = document.getElementById('ingredients-list');
    if (list.children.length > 1) {
        button.closest('.ingredient-item').remove();
    } else {
        const item = button.closest('.ingredient-item');
        item.querySelectorAll('select, input').forEach(field => field.value = "");
    }
}