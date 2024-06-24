// Select the elements: the toggle button, its icon, and the dropdown menu
const toggleBtn = document.querySelector('.toggle_btn');
const toggleBtnIcon = document.querySelector('.toggle_btn i');
const dropDownMenu = document.querySelector('.dropdown_menu');

// Add a click event listener to the toggle button
toggleBtn.onclick = function () {
    // Toggle the 'open' class on the dropdown menu
    dropDownMenu.classList.toggle('open');

    // Check if the dropdown menu has the 'open' class
    const isOpen = dropDownMenu.classList.contains('open');

    // Change the icon class based on whether the menu is open or not
    toggleBtnIcon.className = isOpen
        ? 'fa-solid fa-xmark'  // If open, set icon to 'xmark' (close icon)
        : 'fa-solid fa-bars';  // If closed, set icon to 'bars' (menu icon)
};
