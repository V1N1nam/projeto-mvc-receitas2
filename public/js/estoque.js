function toggleEdit(id) {
    const item = document.getElementById('item-' + id);
    const viewMode = item.querySelector('.view-mode');
    const editMode = item.querySelector('.edit-mode');

    if (editMode.style.display === 'none') {
        editMode.style.display = 'flex';
        viewMode.style.display = 'none';
    } else {
        editMode.style.display = 'none';
        viewMode.style.display = 'flex';
    }
}