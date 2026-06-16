import { useState } from "react";
import "./Servicos.css";

function Servicos() {

  const [servicoSelecionado, setServicoSelecionado] =
    useState(null);

  const servicos = [
    {
      id: 1,
      nome: "RPG",
      duracao: "60 min",
      valor: "R$ 120,00",
      descricao:
        "Reeducação Postural Global para correção postural, alívio de dores e melhora da mobilidade.",

      indicacoes:
        "Dores na coluna, escoliose, hérnia de disco, desvios posturais e dores crônicas.",

      beneficios:
        "Melhora da postura, redução de dores, aumento da flexibilidade e qualidade de vida."
    },

    {
      id: 2,
      nome: "Fisioterapia Ortopédica",
      duracao: "60 min",
      valor: "R$ 100,00",
      descricao:
        "Tratamento de lesões musculares, articulares e pós-operatórias.",

      indicacoes:
        "Fraturas, lesões ligamentares, tendinites e recuperação pós-cirúrgica.",

      beneficios:
        "Recuperação funcional, fortalecimento muscular e prevenção de novas lesões."
    },

    {
      id: 3,
      nome: "Acupuntura Sistêmica",
      duracao: "50 min",
      valor: "R$ 110,00",
      descricao:
        "Técnica terapêutica baseada na medicina tradicional chinesa.",

      indicacoes:
        "Ansiedade, dores musculares, insônia, estresse e dores crônicas.",

      beneficios:
        "Relaxamento, equilíbrio energético e controle da dor."
    },

    {
      id: 4,
      nome: "Auriculoterapia",
      duracao: "40 min",
      valor: "R$ 80,00",
      descricao:
        "Estimulação de pontos específicos da orelha para tratamento complementar.",

      indicacoes:
        "Ansiedade, estresse, dores musculares e emagrecimento.",

      beneficios:
        "Auxílio no controle emocional e melhora do bem-estar."
    },

    {
      id: 5,
      nome: "Ventosaterapia",
      duracao: "40 min",
      valor: "R$ 90,00",
      descricao:
        "Terapia realizada através da sucção da pele por ventosas.",

      indicacoes:
        "Tensões musculares, dores nas costas e fadiga muscular.",

      beneficios:
        "Melhora da circulação sanguínea e relaxamento muscular."
    }
  ];

  return (
    <div className="servicos-page">

      <div className="page-header">
        <h1>Serviços</h1>
      </div>

      <div className="servicos-grid">

        {servicos.map((servico) => (

          <div
            key={servico.id}
            className="servico-card"
            onClick={() =>
              setServicoSelecionado(servico)
            }
          >
            <h2>{servico.nome}</h2>
          </div>

        ))}

      </div>

      {servicoSelecionado && (

        <div
          className="modal-overlay"
          onClick={() =>
            setServicoSelecionado(null)
          }
        >

          <div
            className="servico-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h2>
              {servicoSelecionado.nome}
            </h2>

            <p>
              <strong>Duração:</strong>{" "}
              {servicoSelecionado.duracao}
            </p>

            <p>
              <strong>Valor:</strong>{" "}
              {servicoSelecionado.valor}
            </p>

            <p>
              <strong>Descrição:</strong>
            </p>

            <p>
              {servicoSelecionado.descricao}
            </p>

            <p>
              <strong>Indicações:</strong>
            </p>

            <p>
              {servicoSelecionado.indicacoes}
            </p>

            <p>
              <strong>Benefícios:</strong>
            </p>

            <p>
              {servicoSelecionado.beneficios}
            </p>

            <button
              className="fechar-btn"
              onClick={() =>
                setServicoSelecionado(null)
              }
            >
              Fechar
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Servicos;