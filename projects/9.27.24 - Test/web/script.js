document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".navbar-toggle");
    const navbarItems = document.querySelector(".navbar-items");
    const nothing = document.querySelector(".nothing");

    menuToggle.addEventListener("click", () => {
        navbarItems.classList.toggle("active");
        nothing.classList.toggle("active");
    });
    nothing.addEventListener("click", () => {
        navbarItems.classList.toggle("active");
        nothing.classList.toggle("active");
    })
});