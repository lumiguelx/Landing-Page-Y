import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [sugestoes, setSugestoes] = useState([]);
  const [tabloide, setTabloide] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  // Verificar se o admin está logado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

    // Buscar as sugestões
    fetch('http://localhost:3001/api/sugestoes', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSugestoes(data));

    // Buscar o tabloide
    fetch('http://localhost:3001/api/tabloide')
      .then((res) => res.json())
      .then((data) => setTabloide(data));
  }, [navigate]);

  const handleTabloideUpload = (e) => {
    const formData = new FormData();
    formData.append('frente', e.target.files[0]);
    formData.append('verso', e.target.files[1]);

    const token = localStorage.getItem('token');
    fetch('http://localhost:3001/api/tabloide-upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => setTabloide(data))
      .catch(() => setMensagem('Erro ao fazer upload do tabloide.'));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">Painel de Administração</h1>

      {/* Lista de Sugestões */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">Sugestões dos Clientes</h2>
        <ul className="space-y-4">
          {sugestoes.map((sugestao) => (
            <li key={sugestao.id} className="p-4 border rounded-lg">
              <p className="font-semibold">{sugestao.nome}</p>
              <p>{sugestao.texto}</p>
              <p className="text-sm text-gray-500">{sugestao.data}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Upload do Tabloide */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">Upload do Tabloide</h2>
        {tabloide ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <img src={`http://localhost:3001/${tabloide.frente}`} alt="Frente do tabloide" className="rounded shadow" />
            <img src={`http://localhost:3001/${tabloide.verso}`} alt="Verso do tabloide" className="rounded shadow" />
          </div>
        ) : (
          <p>Sem tabloide publicado para esta semana.</p>
        )}
        <input type="file" onChange={handleTabloideUpload} accept="image/*" multiple />
        {mensagem && <p className="text-red-600">{mensagem}</p>}
      </div>
    </div>
  );
}

export default Admin;
