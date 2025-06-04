import { useEffect, useState } from 'react';

function Home() {
  const [form, setForm] = useState({ nome: '', email: '', texto: '' });
  const [tabloide, setTabloide] = useState(null);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/tabloide')
      .then(res => res.json())
      .then(data => setTabloide(data));
  }, []);

  const enviarSugestao = async () => {
    const res = await fetch('http://localhost:3001/api/sugestoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMensagem('Sugestão enviada com sucesso!');
      setForm({ nome: '', email: '', texto: '' });
    } else {
      setMensagem('Erro ao enviar. Tente novamente.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center text-blue-700">Bem-vindo ao Supermercado Yama</h1>

      {/* Sugestão */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">Deixe sua sugestão</h2>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Nome"
          value={form.nome}
          onChange={e => setForm({ ...form, nome: e.target.value })}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <textarea
          className="w-full border rounded px-3 py-2"
          placeholder="Sua sugestão"
          rows={4}
          value={form.texto}
          onChange={e => setForm({ ...form, texto: e.target.value })}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={enviarSugestao}
        >
          Enviar
        </button>
        {mensagem && <p className="text-green-600">{mensagem}</p>}
      </div>

      {/* Tabloide */}
      {tabloide && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Tabloide da Semana</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <img src={`http://localhost:3001/${tabloide.frente}`} alt="Frente" className="rounded shadow" />
            <img src={`http://localhost:3001/${tabloide.verso}`} alt="Verso" className="rounded shadow" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
