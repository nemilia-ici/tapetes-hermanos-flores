// VALIDACIÓN COMPLETA CON CAPTURA DE ERRORES DEL BACKEND
document.addEventListener("DOMContentLoaded", function() {
  console.log("✅ Validación avanzada cargada");

  const form = document.getElementById("contactForm");
  if (!form) {
    console.error("❌ Formulario no encontrado");
    return;
  }

  // ========== ESTILOS ==========
  const styles = `
    .campo-container { position: relative; margin-bottom: 20px; }
    .campo-container input, .campo-container textarea {
      width: 100%; padding: 14px 18px;
      border: 2px solid #e8e0d8; border-radius: 12px;
      font-size: 1rem; transition: all 0.3s ease;
      background: white; font-family: inherit;
    }
    .campo-container input:focus, .campo-container textarea:focus {
      outline: none; border-color: #c49a6c;
      box-shadow: 0 0 0 4px rgba(196,154,108,0.15);
      transform: translateY(-2px);
    }
    .campo-container.valid input, .campo-container.valid textarea {
      border-color: #22c55e; background: #f0fdf4;
      box-shadow: 0 0 0 4px rgba(34,197,94,0.1);
      padding-right: 48px;
    }
    .campo-container.error input, .campo-container.error textarea {
      border-color: #ef4444; background: #fef2f2;
      box-shadow: 0 0 0 4px rgba(239,68,68,0.1);
      padding-right: 48px;
    }
    .campo-container .estado-icono {
      position: absolute; right: 14px; top: 50%;
      transform: translateY(-50%); font-size: 1.3rem;
      opacity: 0; transition: all 0.3s ease;
      pointer-events: none;
    }
    .campo-container.valid .estado-icono { opacity: 1; color: #22c55e; transform: translateY(-50%) scale(1); }
    .campo-container.error .estado-icono { opacity: 1; color: #ef4444; transform: translateY(-50%) scale(1); }
    .error-message { display: none; margin-top: 6px; padding: 8px 12px; background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; color: #dc2626; font-size: 0.85rem; font-weight: 500; animation: slideDown 0.3s ease; }
    .error-message.show { display: block; }
    .form-message { padding: 16px 20px; border-radius: 12px; text-align: center; font-weight: 500; margin-bottom: 20px; animation: slideDown 0.4s ease; display: none; }
    .form-message.success { display: block; background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
    .form-message.error { display: block; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
    .form-message.loading { display: block; background: #f0f9ff; color: #0369a1; border: 1px solid #bae6fd; }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 60% { transform: translateX(8px); } }
    .campo-container.error input, .campo-container.error textarea { animation: shake 0.4s ease; }
    .btn-submit { width: 100% !important; padding: 16px !important; background: linear-gradient(135deg, #c49a6c, #a5784a) !important; color: white !important; border: none !important; border-radius: 12px !important; font-size: 1.1rem !important; font-weight: 700 !important; cursor: pointer !important; transition: all 0.3s ease !important; box-shadow: 0 4px 15px rgba(196,154,108,0.3) !important; display: flex !important; align-items: center !important; justify-content: center !important; gap: 10px !important; }
    .btn-submit:hover { transform: translateY(-3px) !important; box-shadow: 0 8px 30px rgba(196,154,108,0.4) !important; }
    .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none !important; }
    .btn-submit .spinner { display: inline-block; width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 0.8s ease infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // ========== FUNCIONES ==========

  // Crear estructura de campo con icono
  function mejorarCampos() {
    form.querySelectorAll('input, textarea').forEach(function(campo) {
      if (campo.type === 'submit') return;
      const container = document.createElement('div');
      container.className = 'campo-container';
      campo.parentElement.insertBefore(container, campo);
      container.appendChild(campo);
      const icono = document.createElement('span');
      icono.className = 'estado-icono';
      icono.textContent = '✓';
      container.appendChild(icono);
      campo.dataset.container = container;
    });
  }

  mejorarCampos();

  // Crear contenedor de mensajes
  const messageDiv = document.createElement('div');
  messageDiv.className = 'form-message';
  form.insertBefore(messageDiv, form.firstChild);

  function showMessage(message, type = 'error') {
    messageDiv.className = 'form-message ' + type;
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function hideMessage() {
    messageDiv.style.display = 'none';
  }

  function updateSubmitButton(loading) {
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    if (loading) {
      btn.innerHTML = '<span class="spinner"></span> Enviando...';
      btn.disabled = true;
    } else {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar mensaje';
      btn.disabled = false;
    }
  }

  function actualizarEstado(campo, estado, mensaje = '') {
    const container = campo.closest('.campo-container');
    if (!container) return;
    container.classList.remove('valid', 'error');
    const errorExistente = container.querySelector('.error-message');
    if (errorExistente) errorExistente.remove();

    if (estado === 'valid') {
      container.classList.add('valid');
      container.querySelector('.estado-icono').textContent = '✓';
    } else if (estado === 'error') {
      container.classList.add('error');
      container.querySelector('.estado-icono').textContent = '✗';
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message show';
      errorDiv.textContent = mensaje;
      container.appendChild(errorDiv);
    } else {
      container.querySelector('.estado-icono').textContent = '';
    }
  }

  function limpiarFormulario() {
    // Limpiar todos los campos del formulario
    form.querySelectorAll('input, textarea').forEach(function(campo) {
      if (campo.type === 'submit') return;
      campo.value = '';
      actualizarEstado(campo, 'neutral');
    });
    
    // Recargar el token CSRF
    if (typeof loadCsrfToken === 'function') {
      loadCsrfToken();
    }
  }

  // Validar un campo (solo formato)
  function validarCampo(campo) {
    const valor = campo.value.trim();
    const nombre = campo.name;
    let esValido = true;
    let mensaje = '';

    if (campo.hasAttribute('required') && !valor) {
      if (nombre === 'nombre') mensaje = 'El nombre es obligatorio';
      else if (nombre === 'email') mensaje = 'El email es obligatorio';
      else if (nombre === 'mensaje') mensaje = 'El mensaje es obligatorio';
      esValido = false;
    } else if (nombre === 'nombre' && valor.length < 2) {
      mensaje = 'El nombre debe tener al menos 2 caracteres';
      esValido = false;
    } else if (nombre === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(valor)) {
        mensaje = 'Ingresa un email válido (ejemplo@correo.com)';
        esValido = false;
      }
    } else if (nombre === 'telefono' && valor && !/^[0-9+\-\s]{8,15}$/.test(valor)) {
      mensaje = 'El teléfono debe tener 8-15 dígitos (ej: 55 1234 5678)';
      esValido = false;
    } else if (nombre === 'mensaje' && valor.length < 10) {
      mensaje = 'El mensaje debe tener al menos 10 caracteres';
      esValido = false;
    }

    if (!esValido) {
      actualizarEstado(campo, 'error', mensaje);
    } else if (valor) {
      actualizarEstado(campo, 'valid');
    } else {
      actualizarEstado(campo, 'neutral');
    }

    return esValido;
  }

  // ========== EVENTOS ==========

  form.querySelectorAll('input, textarea').forEach(function(campo) {
    if (campo.type === 'submit') return;

    campo.addEventListener('blur', function() {
      validarCampo(this);
    });

    campo.addEventListener('input', function() {
      const container = this.closest('.campo-container');
      if (container && (container.classList.contains('error') || container.classList.contains('valid'))) {
        validarCampo(this);
      }
    });
  });

  // ========== ENVÍO DEL FORMULARIO ==========
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    hideMessage();

    let primerError = null;
    let todosValidos = true;

    // Validar todos los campos (solo formato)
    form.querySelectorAll('input, textarea').forEach(function(campo) {
      if (campo.type === 'submit') return;
      const esValido = validarCampo(campo);
      if (!esValido && !primerError) {
        primerError = campo;
      }
      if (!esValido) {
        todosValidos = false;
      }
    });

    if (!todosValidos) {
      if (primerError) primerError.focus();
      return;
    }

    // Mostrar loading
    updateSubmitButton(true);
    showMessage('⏳ Validando y enviando mensaje...', 'loading');

    try {
      const datos = {
        nombre: form.querySelector('input[name="nombre"]').value.trim(),
        email: form.querySelector('input[name="email"]').value.trim(),
        telefono: form.querySelector('input[name="telefono"]').value.trim(),
        mensaje: form.querySelector('textarea[name="mensaje"]').value.trim()
      };

      console.log('📤 Enviando datos:', datos);

      // Obtener el token CSRF
      const csrfToken = document.querySelector('input[name="csrf-token"]');
      if (!csrfToken || !csrfToken.value) {
        throw new Error('Token CSRF no disponible');
      }

      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken.value
        },
        body: JSON.stringify(datos)
      });

      const result = await response.json();
      console.log('📥 Respuesta del servidor:', result);

      if (response.ok) {
        showMessage('✅ ¡Mensaje enviado! Te contactaremos pronto.', 'success');
        
        // ✅ LIMPIAR EL FORMULARIO COMPLETAMENTE
        limpiarFormulario();
        
        setTimeout(hideMessage, 5000);
      } else {
        // Mostrar el error específico del backend
        const errorMsg = result.error || 'Error al enviar el mensaje';
        showMessage('❌ ' + errorMsg, 'error');

        // Si el error es del email, resaltar el campo de email
        if (errorMsg.includes('email') || errorMsg.includes('correo')) {
          const emailInput = form.querySelector('input[name="email"]');
          if (emailInput) {
            actualizarEstado(emailInput, 'error', errorMsg);
            emailInput.focus();
          }
        }
      }
    } catch (error) {
      console.error('❌ Error de red:', error);
      showMessage('❌ Error de conexión. Verifica tu internet.', 'error');
    } finally {
      updateSubmitButton(false);
    }
  });
});
