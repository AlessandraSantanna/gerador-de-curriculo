import './index.css';
import { useState } from 'react';
import { 
  FaUser, FaBriefcase, FaGraduationCap, FaTools, 
  FaGlobe, FaLanguage, FaHeart, FaTrash 
} from "react-icons/fa";

const Generator = () => {
  const createItem = (value = "") => ({ id: crypto.randomUUID(), value });

  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      photo: '', // <-- foto em base64
    },
    professionalSummary: '',
    websites: [createItem()],
    professionalHistory: [createItem()],
    education: [createItem()],
    skills: [createItem()],
    languages: [createItem()],
    hobbies: [createItem()],
  });

  // Upload da foto
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeData((prev) => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, photo: reader.result as string },
        }));
      };
      reader.readAsDataURL(file); // converte para base64
    }
  };

  // Atualiza campos de arrays
  const handleArrayChange = (section: string, id: string, value: string) => {
    const updated = (resumeData as any)[section].map((item: any) =>
      item.id === id ? { ...item, value } : item
    );
    setResumeData({ ...resumeData, [section]: updated });
  };

  // Adiciona novo campo
  const addField = (section: string) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...(prev as any)[section], { id: crypto.randomUUID(), value: "" }],
    }));
  };

  // Remove campo
  const removeField = (section: string, id: string) => {
    const updated = (resumeData as any)[section].filter((item: any) => item.id !== id);
    setResumeData({ ...resumeData, [section]: updated });
  };

  // Atualiza personalInfo
  const handleChange = (section: string, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  return (
    <div className="container">
      {/* Esquerda = Form */}
      <div className="form-section">
        <form>
          <h2 className="section-title personal"><FaUser /> Informações Pessoais</h2>
          
          {/* Upload da foto */}
          <label>Foto 3x4:</label>
          <input type="file" accept="image/*" onChange={handlePhotoUpload} />

          <input type="text" placeholder="Nome Completo"
            value={resumeData.personalInfo.fullName}
            onChange={(e) => handleChange("personalInfo", "fullName", e.target.value)}
          />
          <input type="email" placeholder="Email"
            value={resumeData.personalInfo.email}
            onChange={(e) => handleChange("personalInfo", "email", e.target.value)}
          />
          <input type="tel" placeholder="Telefone"
            value={resumeData.personalInfo.phone}
            onChange={(e) => handleChange("personalInfo", "phone", e.target.value)}
          />
          <input type="text" placeholder="País"
            value={resumeData.personalInfo.country}
            onChange={(e) => handleChange("personalInfo", "country", e.target.value)}
          />
          <input type="text" placeholder="Cidade"
            value={resumeData.personalInfo.city}
            onChange={(e) => handleChange("personalInfo", "city", e.target.value)}
          />

          <h2 className="section-title summary"><FaBriefcase /> Resumo Profissional</h2>
          <textarea placeholder="Digite um breve resumo..."
            value={resumeData.professionalSummary}
            onChange={(e) =>
              setResumeData({ ...resumeData, professionalSummary: e.target.value })
            }
          />

          {/* Campos Dinâmicos */}
          {[
            { key: "websites", title: "Websites", icon: <FaGlobe />, color: "web" },
            { key: "professionalHistory", title: "Histórico Profissional", icon: <FaBriefcase />, color: "history" },
            { key: "education", title: "Educação", icon: <FaGraduationCap />, color: "edu" },
            { key: "skills", title: "Habilidades", icon: <FaTools />, color: "skills" },
            { key: "languages", title: "Idiomas", icon: <FaLanguage />, color: "lang" },
            { key: "hobbies", title: "Hobbies", icon: <FaHeart />, color: "hobbies" },
          ].map(({ key, title, icon, color }) => (
            <div key={key}>
              <h2 className={`section-title ${color}`}>{icon} {title}</h2>
              {(resumeData as any)[key].map((item: any) => (
                <div className="input-row" key={item.id}>
                  <input
                    type="text"
                    placeholder={`${title}`}
                    value={item.value}
                    onChange={(e) => handleArrayChange(key, item.id, e.target.value)}
                  />
                  <button type="button" className="remove-btn"
                    onClick={() => removeField(key, item.id)}>
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addField(key)}>+ Adicionar {title}</button>
            </div>
          ))}
        </form>
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

        {[
          { key: "websites", title: "Websites", icon: <FaGlobe />, color: "web" },
          { key: "professionalHistory", title: "Histórico Profissional", icon: <FaBriefcase />, color: "history" },
          { key: "education", title: "Educação", icon: <FaGraduationCap />, color: "edu" },
          { key: "skills", title: "Habilidades", icon: <FaTools />, color: "skills" },
          { key: "languages", title: "Idiomas", icon: <FaLanguage />, color: "lang" },
          { key: "hobbies", title: "Hobbies", icon: <FaHeart />, color: "hobbies" },
        ].map(({ key, title, icon, color }) => (
          (resumeData as any)[key].some((item: any) => item.value) && (
            <div key={key}>
              <h2 className={`section-title ${color}`}>{icon} {title}</h2>
              <ul>
                {(resumeData as any)[key].map((item: any) =>
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
