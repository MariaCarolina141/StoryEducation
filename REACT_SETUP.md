# Guia de Setup do React no Impulsa


## Status Atual
- ✅ Backend (Node.js + Express) funcionando perfeitamente
- ✅ Frontend (HTML + CSS + JavaScript) funcionando com gráficos
- ✅ Logo upload implementado no dashboard
- ✅ React adicionado ao package.json
- ⏳ Próximo: Converter componentes para React (opcional)


## Por que React?
React permite criar componentes reutilizáveis e gerenciar estado de forma mais eficiente. É ideal para painéis dinâmicos como o seu dashboard.


## Opção 1: Usar o Projeto Atual (Recomendado por enquanto)
O projeto funciona bem com HTML/CSS/JavaScript vanilla. Se quiser manter essa abordagem:
- ✅ Continue usando como está
- ✅ Os gráficos e funcionalidades estão funcionando
- ✅ Fácil de manter e expandir


## Opção 2: Migrar para React (Passo a Passo)


### Passo 1: Instalar dependências
```bash
npm install
```


### Passo 2: Setup com Vite (recomendado para React)
Se quiser uma build moderna com React:


```bash
npm create vite@latest impulsa-react -- --template react
cd impulsa-react
npm install
npm run dev
```


### Passo 3: Estrutura de pasta recomendada
```
impulsa/
├── server.js (backend mantido)
├── impulsa-react/ (novo projeto React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Charts.jsx
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
```


### Passo 4: Exemplo de Componente React
```jsx
// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { LineChart, BarChart } from './Charts';


export function Dashboard() {
  const [data, setData] = useState(null);


  useEffect(() => {
    // Buscar dados do backend
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);


  return (
    <div className="dashboard">
      <h1>Painel de Gestão</h1>
      {/* Componentes aqui */}
    </div>
  );
}
```


## Como Adicionar a Logo com React


```jsx
import React, { useState } from 'react';


function LogoUpload() {
  const [logo, setLogo] = useState(localStorage.getItem('companyLogo'));


  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        localStorage.setItem('companyLogo', dataUrl);
        setLogo(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="logo-upload">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        style={{display: 'none'}}
        id="logo-input"
      />
      <label htmlFor="logo-input" style={{cursor: 'pointer'}}>
        {logo ? (
          <img src={logo} alt="Logo" style={{width: '80px', height: '80px'}} />
        ) : (
          <div>Clique para adicionar logo</div>
        )}
      </label>
    </div>
  );
}


export default LogoUpload;
```


## Conexão Backend + React


O backend continua em `http://localhost:3000` com as mesmas rotas:
- `POST /api/login` - Autenticação
- `POST /api/ai` - Respostas de IA
- `GET /api/status` - Status do servidor


Para chamar o backend do React:
```javascript
const response = await fetch('http://localhost:3000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```


## Próximas Etapas
1. Decidir: continuar com vanilla JS ou migrar para React
2. Se React: rodar `npm install` e escolher método (Vite ou Create React App)
3. Converter componentes gradualmente
4. Testar integração com o backend


## Perguntas?
- Para dúvidas sobre React: consulte https://react.dev/
- Para integração com backend: verifique a documentação do Express
- Para gráficos em React: use bibliotecas como `recharts` ou `react-chartjs-2`
