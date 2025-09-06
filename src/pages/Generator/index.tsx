import "./index.css"; 
import { useNavigate } from "react-router-dom";
import { useState, type ChangeEvent } from "react";
import {
  FaUser, FaBriefcase, FaGraduationCap, FaTools,
  FaGlobe, FaLanguage, FaHeart, FaTrash
} from "react-icons/fa";

// Tipo para itens dinâmicos (websites, skills, etc.)
type Item = {
  id: string;
  value: string;
};

// Tipo do estado principal do currículo
export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    photo: string; // base64
  };
  professionalSummary: string;
  websites: Item[];
  professionalHistory: Item[];
  education: Item[];
  skills: Item[];
  languages: Item[];
  hobbies: Item[];
}

// Chaves válidas para seções de array
type SectionKey = keyof Pick<
  ResumeData,
  "websites" | "professionalHistory" | "education" | "skills" | "languages" | "hobbies"
>;

const sections: Array<{
  key: SectionKey;
  title: string;
  icon: React.ReactNode;
  color: string;
}> = [
  { key: "websites", title: "Websites/LinkedIn", icon: <FaGlobe />, color: "web" },
  { key: "professionalHistory", title: "Histórico Profissional", icon: <FaBriefcase />, color: "history" },
  { key: "education", title: "Educação", icon: <FaGraduationCap />, color: "edu" },
  { key: "skills", title: "Habilidades", icon: <FaTools />, color: "skills" },
  { key: "languages", title: "Idiomas", icon: <FaLanguage />, color: "lang" },
  { key: "hobbies", title: "Hobbies", icon: <FaHeart />, color: "hobbies" },
];

const Generator = () => {
  const navigate = useNavigate();

  const createItem = (value = ""): Item => ({ id: crypto.randomUUID(), value });

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      country: "",
      city: "",
      photo: "",
    },
    professionalSummary: "",
    websites: [createItem()],
    professionalHistory: [createItem()],
    education: [createItem()],
    skills: [createItem()],
    languages: [createItem()],
    hobbies: [createItem()],
  });

  const [loadingSummary, setLoadingSummary] = useState(false);

  // Upload da foto (salva como base64)
  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setResumeData((prev) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, photo: reader.result as string },
      }));
    };
    reader.readAsDataURL(file);
  };

  // Atualiza campos de arrays
  const handleArrayChange = (section: SectionKey, id: string, value: string) => {
    const updated = resumeData[section].map((item) =>
      item.id === id ? { ...item, value } : item
    );
    setResumeData({ ...resumeData, [section]: updated });
  };

  // Adiciona novo campo
  const addField = (section: SectionKey) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], { id: crypto.randomUUID(), value: "" }],
    }));
  };

  // Remove campo
  const removeField = (section: SectionKey, id: string) => {
    const updated = resumeData[section].filter((item) => item.id !== id);
    setResumeData({ ...resumeData, [section]: updated });
  };

  // Atualiza personalInfo
  const handleChange = (
    section: "personalInfo",
    field: keyof ResumeData["personalInfo"],
    value: string
  ) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Função para melhorar o resumo via IA
  const handleImproveSummary = async () => {
    if (!resumeData.professionalSummary.trim()) return;

    setLoadingSummary(true);
    try {
      const response = await fetch("http://localhost:3001/api/improve-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: resumeData.professionalSummary }),
      });

      const data = await response.json();

      if (data.improvedText) {
        setResumeData((prev) => ({
          ...prev,
          professionalSummary: data.improvedText,
        }));
      }
    } catch (error) {
      console.error("Erro ao melhorar o resumo:", error);
      alert("Não foi possível melhorar o resumo. Tente novamente.");
    } finally {
      setLoadingSummary(false);
    }
  };

  // Envia todos os dados para o Visualizer
  const handleVisualize = () => {
    navigate("/visualizer", { state: resumeData });
  };

  return (
    <div className="container">
      {/* Esquerda = Form */}
      <div className="form-section">
        <form>
          <h2 className="section-title personal"><FaUser /> Informações Pessoais</h2>

          {/* Upload da foto */}
          <label>Foto:</label>
          <input type="file" accept="image/*" onChange={handlePhotoUpload} />

          <input
            type="text"
            placeholder="Nome Completo"
            value={resumeData.personalInfo.fullName}
            onChange={(e) => handleChange("personalInfo", "fullName", e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={resumeData.personalInfo.email}
            onChange={(e) => handleChange("personalInfo", "email", e.target.value)}
          />
          <input
            type="tel"
            placeholder="Telefone"
            value={resumeData.personalInfo.phone}
            onChange={(e) => handleChange("personalInfo", "phone", e.target.value)}
          />
          <input
            type="text"
            placeholder="País"
            value={resumeData.personalInfo.country}
            onChange={(e) => handleChange("personalInfo", "country", e.target.value)}
          />
          <input
            type="text"
            placeholder="Cidade"
            value={resumeData.personalInfo.city}
            onChange={(e) => handleChange("personalInfo", "city", e.target.value)}
          />

          <h2 className="section-title summary">
            <FaBriefcase /> Resumo Profissional
            <button
              type="button"
              onClick={handleImproveSummary}
              disabled={loadingSummary}
              style={{
                marginLeft: "10px",
                padding: "4px 8px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: loadingSummary ? "not-allowed" : "pointer"
              }}
            >
              {loadingSummary ? "Melhorando..." : "✨ Melhorar com IA"}
            </button>
          </h2>
          <textarea
            placeholder="Digite um breve resumo..."
            value={resumeData.professionalSummary}
            onChange={(e) =>
              setResumeData({ ...resumeData, professionalSummary: e.target.value })
            }
          />

          {/* Campos Dinâmicos */}
          {sections.map(({ key, title, icon, color }) => (
            <div key={key}>
              <h2 className={`section-title ${color}`}>{icon} {title}</h2>
              {resumeData[key].map((item) => (
                <div className="input-row" key={item.id}>
                  <input
                    type="text"
                    placeholder={title}
                    value={item.value}
                    onChange={(e) => handleArrayChange(key, item.id, e.target.value)}
                  />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeField(key, item.id)}
                    aria-label={`Remover ${title}`}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addField(key)}>
                + Adicionar {title}
              </button>
            </div>
          ))}
        </form>

        {/* Botão para visualizar/gerar PDF na outra página */}
        <div style={{ marginTop: "1rem" }}>
          <button type="button" onClick={handleVisualize}>
            Visualizar Currículo
          </button>
        </div>
      </div>

      {/* Direita = Preview */}
      <div className="preview-section">
        {/* Foto 3x4 */}
        {resumeData.personalInfo.photo && (
          <img
            src={resumeData.personalInfo.photo}
            alt="Foto 3x4"
            className="foto-3x4"
          />
        )}

        <h1>{resumeData.personalInfo.fullName || " Seu Nome Aqui"}</h1>
        <p>{resumeData.personalInfo.email}</p>
        <p>{resumeData.personalInfo.phone}</p>
        <p>{resumeData.personalInfo.city}, {resumeData.personalInfo.country}</p>

        <h2 className="summary"><FaBriefcase /> Resumo Profissional</h2>
        <p>{resumeData.professionalSummary}</p>

        {sections.map(({ key, title, icon, color }) => (
          resumeData[key].some((item) => item.value) && (
            <div key={key}>
              <h2 className={`section-title ${color}`}>{icon} {title}</h2>
              <ul>
                {resumeData[key].map((item) =>
                  item.value && <li key={item.id}>{item.value}</li>
                )}
              </ul>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Generator;
