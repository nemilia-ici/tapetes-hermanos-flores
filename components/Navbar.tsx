'use client'

import { useState, useEffect } from 'react'

import Image from 'next/image';

export const Navbar = () => {
  const [isDark, setIsDark] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    
    // Cargar preferencia guardada
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark-mode')
    }
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    
    // Aplicar a todo el documento
    if (newIsDark) {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark-mode')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark-mode')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <div className="logo">
          


         <Image src="/images/Logo.jpg" alt="Hnos. Flores" width={50} height={50} className="rounded-full border-2 border-[#c49a6c] object-cover" />

          <span className="logo-text">Hnos. Flores</span>
        </div>
        <div className="nav-links">
          <a href="#inicio">Inicio</a>
          <a href="#servicios">Servicios</a>
          <a href="#proceso">Proceso</a>
          <a href="#galeria">Galería</a>
          <a href="#testimonios">Testimonios</a>
          <a href="#contacto">Contacto</a>
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
        <div className="menu-toggle">
          <i className="fas fa-bars"></i>
        </div>
      </div>
    </nav>
  )
}
