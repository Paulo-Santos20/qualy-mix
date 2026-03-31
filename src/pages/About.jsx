import { useEffect } from 'react';

const About = () => {
  useEffect(() => {
    const reveal = () => {
      const reveals = document.querySelectorAll(".scroll-reveal");
      reveals.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
          element.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", reveal);
    reveal(); // Disparar no load inicial

    return () => window.removeEventListener("scroll", reveal);
  }, []);

  return (
    <div className="bg-gray-50 text-gray-800 font-sans min-h-screen">
      {/* Estilos customizados injetados via JSX ou seu index.css */}
      <style>{`
        .timeline-line { width: 2px; height: 100%; background: #e5e7eb; position: absolute; left: 50%; transform: translateX(-50%); }
        .scroll-reveal { opacity: 0; transform: translateY(20px); transition: all 0.6s ease-out; }
        .scroll-reveal.active { opacity: 1; transform: translateY(0); }
      `}</style>

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&q=80&w=1600" 
            alt="Supermercado" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4">Nossa História</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto font-light">
            De um pequeno comércio a um dos maiores grupos varejistas do Brasil.
          </p>
        </div>
      </section>
      
      {/* Content Section */}
      <section className="max-w-5xl mx-auto py-20 px-6">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">O Começo de Tudo</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Assim como no Grupo Mateus, a trajetória de sucesso começa com determinação. 
            Nossa jornada é marcada pelo compromisso de levar qualidade e preço baixo para as famílias brasileiras.
          </p>
        </div>

        <div className="relative">
          <div className="timeline-line hidden md:block"></div>

          {/* Item 1986 */}
          <div className="flex flex-col md:flex-row items-center mb-16 scroll-reveal">
            <div className="md:w-1/2 md:pr-12 text-right hidden md:block">
              <h3 className="text-2xl font-bold text-blue-800">1986</h3>
              <p className="text-gray-600">A abertura da primeira loja, focada em atender as necessidades da comunidade local.</p>
            </div>
            <div className="w-10 h-10 bg-red-500 rounded-full border-4 border-white shadow z-10"></div>
            <div className="md:w-1/2 md:pl-12 mt-4 md:mt-0">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-2 md:hidden">1986</h3>
                <p className="text-gray-700 font-semibold italic">"Onde o sonho se tornou realidade."</p>
              </div>
            </div>
          </div>

          {/* Item 2000 */}
          <div className="flex flex-col md:flex-row-reverse items-center mb-16 scroll-reveal">
            <div className="md:w-1/2 md:pl-12 text-left hidden md:block">
              <h3 className="text-2xl font-bold text-blue-800">2000 - Expansão</h3>
              <p className="text-gray-600">Chegada a novas cidades e a consolidação do modelo de atacarejo.</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full border-4 border-white shadow z-10"></div>
            <div className="md:w-1/2 md:pr-12 mt-4 md:mt-0">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=600" 
                  alt="Expansão" 
                  className="rounded mb-4"
                />
                <h3 className="text-xl font-bold mb-2 md:hidden">2000</h3>
                <p className="text-gray-700">O Mix Mateus se torna referência em variedade e economia.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;