import foto from "../../assets/foto.jpg";

const Visualizer = () => {
  return (
    <div>
      <h1>Visualizer</h1>
      <p>Esta é a página do visualizador de currículo.</p>
      <img src={foto} alt="Visualização do Currículo" width={200} />
    </div>
  );
};

export default Visualizer;
