import React from 'react';

const FAQ = () => {
  const faqs = [
    { q: "What is AlgoVista?", a: "A visual playground for understanding computer science fundamentals like logic gates and sorting algorithms." },
    { q: "Can I use the logic circuit simulator for real engineering?", a: "It is designed for educational purposes. While accurate for basic logic, it simplifies electrical properties like propagation delay." },
    { q: "Is this open source?", a: "Yes! Feel free to fork the repository and contribute." },
  ];

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn p-6">
      <h1 className="text-4xl font-black text-white mb-10 text-center">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((item, idx) => (
          <div key={idx} className="bg-gray-800/50 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-gray-800 transition-colors">
            <h3 className="text-lg font-bold text-teal-400 mb-2">{item.q}</h3>
            <p className="text-gray-300">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;