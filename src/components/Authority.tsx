export default function Authority() {
  const testimonial = {
    quote: "Desde que implementamos as recomendações do BeePulse, nossas reservas diretas aumentaram 42% e reduzimos significativamente o abandono no checkout.",
    author: "Marina Silva",
    position: "Gerente de Marketing Digital",
    hotel: "Resort Águas Claras",
    location: "Búzios, RJ",
    rating: 5
  }

  const stats = [
    { number: "5.000+", label: "Hotéis parceiros" },
    { number: "15+", label: "Anos de experiência" },
    { number: "98%", label: "Satisfação dos clientes" },
    { number: "24/7", label: "Suporte especializado" }
  ]

  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Mais de 5.000 hotéis já confiam na Omnibees
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Líder em tecnologia hoteleira no Brasil, agora com o BeePulse para otimizar sua presença digital
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center mb-6">
              {[...Array(testimonial.rating)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            
            <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed">
              "{testimonial.quote}"
            </blockquote>
            
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                <span className="text-black font-bold text-lg">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              <div>
                <div className="font-semibold text-gray-900">{testimonial.author}</div>
                <div className="text-sm text-gray-600">{testimonial.position}</div>
                <div className="text-sm text-gray-500">{testimonial.hotel} • {testimonial.location}</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-white mb-4">
                Por que escolher a Omnibees?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Somos a maior plataforma de tecnologia hoteleira do Brasil, oferecendo soluções completas para hotéis, pousadas e resorts de todos os tamanhos.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-yellow-400 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center space-x-4 bg-white rounded-2xl px-8 py-4 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">O</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Omnibees</span>
            </div>
            
            <div className="w-px h-8 bg-gray-300"></div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">B</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">BeePulse</span>
            </div>
          </div>
          
          <p className="text-gray-400 text-sm mt-4">
            Tecnologia de ponta para o setor hoteleiro
          </p>
        </div>
      </div>
    </section>
  )
}