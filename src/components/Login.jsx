import { useState } from "react";
import { HardHat, Phone, KeyRound } from "lucide-react";
import { generateAuthCode, verifyAuthCode } from '../services/auth';
import { toast } from 'react-toastify';

export default function Login({ onLogin }) {
  const [step, setStep] = useState(1);
  const [whatsapp, setWhatsapp] = useState("");
  const [code, setCode] = useState("");

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (whatsapp) {
      let respGenerateCode = await generateAuthCode(whatsapp);

      if (respGenerateCode?.success == true) {
        setStep(2);
      } else {
        toast.error("Error");
      }
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (whatsapp && code) {
      let respVerifyCode = await verifyAuthCode(whatsapp, code);

      if (respVerifyCode?.success == true) {
        localStorage.setItem('token', respVerifyCode?.access_token);
        
        const newUserData = {
          phone: whatsapp,
          ...respVerifyCode
        };

        onLogin(newUserData);
      } else {
        toast.error("Error");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel">
        <div className="login-header">
          <div className="login-logo-icon">
            <HardHat size={40} className="logo-icon-svg" />
          </div>
          <h1 className="page-title" style={{ fontSize: '1.8rem', marginTop: '1rem' }}>Seguimiento de Obras</h1>
          <p className="login-subtitle">
            {step === 1 ? "Inicia sesión con tu WhatsApp" : "Ingresa el código de confirmación"}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendCode} className="login-form">
            <div className="form-group">
              <label>Número de WhatsApp</label>
              <div className="input-with-icon">
                <Phone className="input-icon" size={18} />
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Ej: +51 987 654 321"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary login-btn">
              Enviar Código
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="login-form">
            <div className="form-group">
              <label>Código de Confirmación</label>
              <div className="input-with-icon">
                <KeyRound className="input-icon" size={18} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ingresa el código de 6 dígitos"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
              <small style={{ color: "var(--text-secondary)", marginTop: "0.5rem", display: "block" }}>
                Se envió un código al número {whatsapp}
              </small>
            </div>

            <button type="submit" className="btn btn-primary login-btn">
              Verificar y Entrar
            </button>
            <button
              type="button"
              className="btn btn-ghost login-btn"
              style={{ marginTop: "0" }}
              onClick={() => setStep(1)}
            >
              Cambiar número
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
