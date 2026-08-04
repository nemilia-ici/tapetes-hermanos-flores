'use client'

import { useState } from 'react'
import { FaWhatsapp, FaTimes, FaComment } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: '¡Hola! Soy tu asistente virtual con IA. ¿Cómo podemos ayudarte hoy?', sender: 'bot' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const quickReplies = [
    { label: '💰 Precios', value: 'precios' },
    { label: '📅 Agendar cita', value: 'agendar' },
    { label: '⏰ Horario', value: 'horario' },
    { label: '📞 Contacto', value: 'contacto' },
  ]

  // Simulación de IA - respuestas inteligentes
  const getAIResponse = (text: string): string => {
    const lower = text.toLowerCase()
    if (lower.includes('precio') || lower.includes('costo') || lower.includes('cuanto')) {
      return 'Los precios dependen del tamaño y estado del tapete. 📏 Un tapete pequeño (2x3m) desde $500 MXN, mediano (3x5m) desde $800 MXN, grande (5x7m) desde $1,200 MXN. ¿Podrías enviarnos una foto para cotizarte mejor? 📸'
    } else if (lower.includes('cita') || lower.includes('agendar') || lower.includes('dia')) {
      return '¡Claro! 📅 Puedes agendar una cita de lunes a viernes de 9am a 6pm, y sábados de 9am a 2pm. ¿Qué día te queda mejor? Te esperamos en Alcaldía Iztapalapa #6, CDMX. 🏠'
    } else if (lower.includes('horario') || lower.includes('atienden') || lower.includes('abren')) {
      return '⏰ Nuestro horario es: Lunes a Viernes 9am-6pm, Sábados 9am-2pm. ¡Cerramos los domingos! ¿Te agendamos una cita? 📅'
    } else if (lower.includes('contacto') || lower.includes('hablar') || lower.includes('asesor')) {
      return '📞 Puedes contactarnos de varias formas:\n- Teléfono: 55 3878-8046\n- WhatsApp: 55 3878-8046\n- Email: lavadodetapeteshnozfloresflore@gmail.com\n- O visítanos en Alcaldía Iztapalapa #6, CDMX 🏠'
    } else if (lower.includes('gracias') || lower.includes('gracias')) {
      return '¡De nada! 🙏 Estamos para servirte. ¿Necesitas algo más?'
    } else if (lower.includes('hola') || lower.includes('buen') || lower.includes('saludo')) {
      return '¡Hola! 👋 ¿Cómo estás? Me alegra saludarte. ¿En qué puedo ayudarte hoy?'
    } else {
      return 'Gracias por tu mensaje. 🤖 Nuestro equipo revisará tu consulta y te responderá pronto. Mientras tanto, ¿puedo ayudarte con precios, citas, horario o contacto?'
    }
  }

  const handleSend = (text: string) => {
    if (!text.trim()) return
    setMessages((prev) => [...prev, { text, sender: 'user' }])
    setInput('')
    setIsTyping(true)

    setTimeout(
      () => {
        const response = getAIResponse(text)
        setMessages((prev) => [...prev, { text: response, sender: 'bot' }])
        setIsTyping(false)
      },
      1000 + Math.random() * 500
    )
  }

  const handleQuickReply = (value: string) => {
    const labels: Record<string, string> = {
      precios: 'Me interesa conocer los precios',
      agendar: 'Quiero agendar una cita',
      horario: '¿Cuál es su horario de atención?',
      contacto: 'Quiero contactar a un asesor',
    }
    handleSend(labels[value])
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#c49a6c] rounded-full flex items-center justify-center text-white text-2xl shadow-xl hover:shadow-2xl hover:scale-110 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={
          !isOpen
            ? {
                boxShadow: ['0 0 0 0 rgba(196,154,108,0.7)', '0 0 0 20px rgba(196,154,108,0)'],
              }
            : {}
        }
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {isOpen ? <FaTimes /> : <FaComment />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          >
            <div className="bg-gradient-to-r from-[#c49a6c] to-[#a5784a] text-white p-4">
              <h3 className="font-bold">🧶 Hnos. Flores</h3>
              <p className="text-sm opacity-90">Asistente con IA 🤖</p>
            </div>

            <div className="h-64 overflow-y-auto p-4 bg-[#fef9f4] space-y-3">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2 rounded-xl ${
                      msg.sender === 'user'
                        ? 'bg-[#c49a6c] text-white rounded-br-none'
                        : 'bg-white text-[#2c1810] rounded-bl-none shadow-sm border border-gray-100'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white text-[#2c1810] rounded-xl rounded-bl-none shadow-sm border border-gray-100 px-4 py-2">
                    <span className="inline-block w-2 h-2 bg-[#c49a6c] rounded-full animate-bounce mx-0.5" />
                    <span
                      className="inline-block w-2 h-2 bg-[#c49a6c] rounded-full animate-bounce mx-0.5"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <span
                      className="inline-block w-2 h-2 bg-[#c49a6c] rounded-full animate-bounce mx-0.5"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="p-2 flex flex-wrap gap-1 border-t border-gray-200 bg-white">
              {quickReplies.map((qr) => (
                <motion.button
                  key={qr.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickReply(qr.value)}
                  className="px-3 py-1.5 text-xs border border-[#c49a6c] text-[#c49a6c] rounded-full hover:bg-[#c49a6c] hover:text-white transition-all"
                >
                  {qr.label}
                </motion.button>
              ))}
            </div>

            <div className="flex p-2 border-t border-gray-200 bg-white">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-l-xl outline-none focus:border-[#c49a6c] transition"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSend(input)}
                className="px-4 bg-[#c49a6c] text-white rounded-r-xl hover:bg-[#a5784a] transition"
              >
                <FaWhatsapp />
              </motion.button>
            </div>

            <div className="text-center text-xs text-gray-400 py-1 bg-white">
              <a
                href="https://wa.me/525538788046"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#c49a6c] transition"
              >
                Abrir en WhatsApp → 📱
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ChatBot
