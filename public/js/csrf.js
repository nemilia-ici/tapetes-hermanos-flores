// Cargar token CSRF dinámicamente
async function loadCsrfToken() {
  try {
    const response = await fetch('/api/csrf');
    if (!response.ok) {
      throw new Error('Error al obtener token CSRF');
    }
    const data = await response.json();
    const tokenInput = document.getElementById('csrfToken');
    if (tokenInput) {
      tokenInput.value = data.token;
      console.log('✅ Token CSRF cargado correctamente');
    }
  } catch (error) {
    console.error('❌ Error cargando CSRF token:', error);
  }
}

// Cargar el token cuando la página esté lista
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadCsrfToken);
} else {
  loadCsrfToken();
}
