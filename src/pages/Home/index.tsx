import './index.css';
import foto from "../../assets/foto.jpg";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Bem Vindo ao Gerador de Currículo</h1>
      <p>
        Aqui você pode criar e visualizar seu currículo de forma fácil e rápida
        e gratuita
      </p>
      <img src={foto} alt="Foto 3x4" className="foto"   />
       <Link to="/generator">
      <button className="btn">Gerar Currículo</button>
       </Link>
    </div>
  );
};

export default Home;




