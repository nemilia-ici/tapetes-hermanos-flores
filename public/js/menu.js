// MENÚ DE HAMBURGUESA - VERSIÓN CORREGIDA
document.addEventListener("DOMContentLoaded", function() {
  console.log("✅ Menú de hamburguesa cargado");
  
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  
  if (!menuToggle || !navLinks) {
    console.error("❌ No se encontraron los elementos del menú");
    return;
  }
  
  console.log("✅ Elementos del menú encontrados");
  
  // Función para alternar el menú
  function toggleMenu() {
    console.log("🔄 Alternando menú");
    
    // Alternar la clase 'active' en navLinks
    navLinks.classList.toggle("active");
    
    // Cambiar el icono
    if (navLinks.classList.contains("active")) {
      menuToggle.innerHTML = '<i class="fas fa-times"></i>';
      console.log("✅ Menú abierto");
    } else {
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      console.log("✅ Menú cerrado");
    }
  }
  
  // Evento click en el botón de hamburguesa
  menuToggle.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu();
  });
  
  // Cerrar el menú al hacer clic en un enlace
  navLinks.querySelectorAll("a").forEach(function(link) {
    link.addEventListener("click", function() {
      if (window.innerWidth <= 768) {
        navLinks.classList.remove("active");
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  });
  
  // Cerrar el menú al hacer clic fuera de él
  document.addEventListener("click", function(e) {
    if (window.innerWidth <= 768) {
      const isClickInsideMenu = navLinks.contains(e.target);
      const isClickOnToggle = menuToggle.contains(e.target);
      
      if (!isClickInsideMenu && !isClickOnToggle && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    }
  });
  
  // Cerrar el menú al redimensionar la ventana
  window.addEventListener("resize", function() {
    if (window.innerWidth > 768) {
      navLinks.classList.remove("active");
      navLinks.style.display = "flex";
      navLinks.style.flexDirection = "row";
      navLinks.style.position = "static";
      navLinks.style.width = "auto";
      navLinks.style.background = "transparent";
      navLinks.style.padding = "0";
      navLinks.style.boxShadow = "none";
      navLinks.style.borderTop = "none";
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    } else {
      // En móvil, asegurar que el menú esté cerrado por defecto
      if (!navLinks.classList.contains("active")) {
        navLinks.style.display = "none";
      } else {
        navLinks.style.display = "flex";
      }
    }
  });
  
  // Inicializar: en móvil, el menú está oculto
  if (window.innerWidth <= 768) {
    navLinks.classList.remove("active");
    navLinks.style.display = "none";
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
  }
  
  console.log("✅ Menú de hamburguesa inicializado correctamente");
});
