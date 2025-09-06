import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import {
  FaUser, FaBriefcase, FaGraduationCap, FaTools,
  FaGlobe, FaLanguage, FaHeart
} from "react-icons/fa";
// Ajuste o caminho abaixo para o local correto do tipo ResumeData
import type { ResumeData } from "../Generator"; // ou o caminho correto onde ResumeData está definido

const Visualizer = () => {
  const location = useLocation();
  const resumeData = location.state as ResumeData | undefined;

  if (!resumeData) {
    return <p>⚠️ Nenhum dado encontrado. Volte e preencha o formulário.</p>;
  }

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    let y = 20;

    // Foto 3x4 (se existir)
    if (resumeData.personalInfo.photo) {
      doc.addImage(resumeData.personalInfo.photo, "JPEG", 150, 10, 40, 40);
    }

    // Cabeçalho
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(resumeData.personalInfo.fullName || "Seu Nome Aqui", 20, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(resumeData.personalInfo.email || "", 20, y);
    y += 6;
    doc.text(resumeData.personalInfo.phone || "", 20, y);
    y += 6;
    doc.text(`${resumeData.personalInfo.city}, ${resumeData.personalInfo.country}`, 20, y);
    y += 12;

    // Linha divisória
    doc.setDrawColor(180);
    doc.line(20, y, 190, y);
    y += 8;

    // Resumo
    if (resumeData.professionalSummary) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Resumo Profissional", 20, y);
      y += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(resumeData.professionalSummary, 20, y, { maxWidth: 170 });
      y += 12;

      doc.line(20, y, 190, y);
      y += 8;
    }

    // Helper para listas
    type ListItem = { value?: string; text?: string; name?: string; id?: string | number };
    const addList = (title: string, items: ListItem[]) => {
      if (!items || !items.some((i) => i.value || i.text || i.name)) return;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(title, 20, y);
      y += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      items.forEach((i) => {
        const content = i.value || i.text || i.name || "";
        if (content) {
          doc.text(`• ${content}`, 25, y);
          y += 6;
        }
      });
      y += 8;

      doc.line(20, y, 190, y);
      y += 8;
    };

    addList("Websites", resumeData.websites);
    addList("Histórico Profissional", resumeData.professionalHistory);
    addList("Educação", resumeData.education);
    addList("Habilidades", resumeData.skills);
    addList("Idiomas", resumeData.languages);
    addList("Hobbies", resumeData.hobbies);

    doc.save("curriculo.pdf");
  };

  // Função para exibir listas no PREVIEW
  type ListItem = { value?: string; text?: string; name?: string; id?: string | number };
  const renderList = (items: ListItem[]) => (
    <ul>
      {items.map(
        (item) => {
          const content = item.value || item.text || item.name || "";
          return content ? <li key={item.id}>{content}</li> : null;
        }
      )}
    </ul>
  );

  return (
    <div className="visualizer">
      {resumeData.personalInfo.photo && (
        <img
          src={resumeData.personalInfo.photo}
          alt="Foto 3x4"
          className="foto-3x4"
        />
      )}

      <h1><FaUser /> {resumeData.personalInfo.fullName}</h1>
      <p>{resumeData.personalInfo.email}</p>
      <p>{resumeData.personalInfo.phone}</p>
      <p>{resumeData.personalInfo.city}, {resumeData.personalInfo.country}</p>

      {resumeData.professionalSummary && (
        <>
          <h2><FaBriefcase /> Resumo Profissional</h2>
          <p>{resumeData.professionalSummary}</p>
        </>
      )}

      {[
        { key: "websites", title: "Websites", icon: <FaGlobe /> },
        { key: "professionalHistory", title: "Histórico Profissional", icon: <FaBriefcase /> },
        { key: "education", title: "Educação", icon: <FaGraduationCap /> },
        { key: "skills", title: "Habilidades", icon: <FaTools /> },
        { key: "languages", title: "Idiomas", icon: <FaLanguage /> },
        { key: "hobbies", title: "Hobbies", icon: <FaHeart /> },
      ].map(({ key, title, icon }) => {
        const items = resumeData[key as keyof ResumeData] as Array<{ value?: string; text?: string; name?: string; id?: string | number }>;
        return (
          items && items.some((i) => i.value || i.text || i.name) && (
            <div key={key}>
              <h2>{icon} {title}</h2>
              {renderList(items)}
            </div>
          )
        );
      })}

      <button onClick={handleGeneratePDF}>📄 Gerar PDF</button>
    </div>
  );
};

export default Visualizer;
