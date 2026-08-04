'use client'

import { useState } from 'react'
import {
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaCheckCircle,
} from 'react-icons/fa'
import { motion } from 'framer-motion'

const Contacto = () => {
  const [enviado, setEnviado] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEnviado(true)
    setTimeout(() => setEnviado(false), 5000)
    setFormData({ nombre: '', email: '', telefono: '', mensaje: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <section id="contacto" className="py-20 bg-amber-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-[#2c1810]">Contáctanos</h2>
          <p className="text-gray-500 mt-2">¡Cotiza tu limpieza sin compromiso!</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: FaMapMarkerAlt, title: 'Dirección', content: 'Alcaldía Iztapalapa #6, CDMX' },
              { icon: FaPhone, title: 'Teléfono', content: '55 3878-8046', link: 'tel:5538788046' },
              {
                icon: FaWhatsapp,
                title: 'WhatsApp',
                content: '55 3878-8046',
                link: 'https://wa.me/525538788046',
              },
              {
                icon: FaEnvelope,
                title: 'Email',
                content: 'lavadodetapeteshnozfloresflore@gmail.com',
                link: 'mailto:lavadodetapeteshnozfloresflore@gmail.com',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition"
              >
                <div className="w-14 h-14 mx-auto mb-3 bg-[#c49a6c]/10 rounded-full flex items-center justify-center text-[#c49a6c] text-2xl">
                  <item.icon />
                </div>
                <h3 className="font-bold text-[#2c1810] text-sm">{item.title}</h3>
                {item.link ? (
                  <a
                    href={item.link}
                    className="text-gray-500 hover:text-[#c49a6c] transition text-xs"
                  >
                    {item.content}
                  </a>
                ) : (
                  <p className="text-gray-500 text-xs">{item.content}</p>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-2xl shadow-md"
          >
            {enviado ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center justify-center h-full py-8"
              >
                <FaCheckCircle className="text-6xl text-emerald-500 mb-4" />
                <h3 className="text-2xl font-bold text-[#2c1810]">¡Mensaje enviado!</h3>
                <p className="text-gray-500 mt-2 text-center">Te contactaremos pronto.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#c49a6c] outline-none transition"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Correo electrónico"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#c49a6c] outline-none transition"
                />
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Teléfono"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#c49a6c] outline-none transition"
                />
                <textarea
                  name="mensaje"
                  rows={4}
                  value={formData.mensaje}
                  onChange={handleChange}
                  placeholder="¿Qué servicio necesitas?"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#c49a6c] outline-none transition"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-[#c49a6c] hover:bg-[#a5784a] text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-[#c49a6c]/30 hover:shadow-xl"
                >
                  <FaPaperPlane /> Enviar mensaje
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contacto
