export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">B</span>
              </div>
              <span className="text-2xl font-bold text-white">BeePulse</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              O Raio-X Digital do seu Hotel. Análise completa de performance para aumentar suas reservas diretas.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Produto</h4>
            <ul className="space-y-2">
              <li>
                <a href="#como-funciona" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Como funciona
                </a>
              </li>
              <li>
                <a href="#beneficios" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Benefícios
                </a>
              </li>
              <li>
                <a href="#relatorio" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Exemplo de Relatório
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Omnibees</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://omnibees.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Site Oficial
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Termos de Uso
              </a>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center">
                  <span className="text-black font-bold text-xs">O</span>
                </div>
                <span className="text-gray-400 text-sm">Omnibees</span>
              </div>
              
              <span className="text-gray-600">•</span>
              
              <p className="text-gray-400 text-sm">
                © 2025 Todos os direitos reservados
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-400 py-2">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-2 text-black text-sm font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Powered by Omnibees Technology</span>
          </div>
        </div>
      </div>
    </footer>
  )
}