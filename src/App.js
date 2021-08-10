import { PDFExport } from "@progress/kendo-react-pdf";
import mevacuno from "./assets/logo-mevacuno.png";
import qrDefault from "./assets/codigo-qr.jpg";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import "./App.scss";
import { useEffect, useRef, useState } from "react";
import data from "./const/vacunas";

function App() {
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [fechaNac, setFechaNac] = useState([]);
  const [sexo, setSexo] = useState("");
  const [vacuna, setVacuna] = useState("");
  const [fondo, setFondo] = useState(null);
  const [preview, setPreview] = useState(undefined);
  const [qr, setQR] = useState(null);
  const [previewQR, setPreviewQR] = useState(undefined);

  useEffect(() => {
    if (fondo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(fondo);
    }

    if (qr) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewQR(reader.result);
      };
      reader.readAsDataURL(qr);
    }
  }, [fondo, qr]);

  const formatRut = (rut) => {
    if (rut.length > 12) return rut;

    let value = rut.replace(/\./g, "").replace("-", "");

    if (value.match(/^(\d{2})(\d{3}){2}(\w{1})$/)) {
      value = value.replace(/^(\d{2})(\d{3})(\d{3})(\w{1})$/, "$1.$2.$3-$4");
    } else if (value.match(/^(\d)(\d{3}){2}(\w{0,1})$/)) {
      value = value.replace(/^(\d)(\d{3})(\d{3})(\w{0,1})$/, "$1.$2.$3-$4");
    } else if (value.match(/^(\d)(\d{3})(\d{0,2})$/)) {
      value = value.replace(/^(\d)(\d{3})(\d{0,2})$/, "$1.$2.$3");
    } else if (value.match(/^(\d)(\d{0,2})$/)) {
      value = value.replace(/^(\d)(\d{0,2})$/, "$1.$2");
    }

    setRut(value);
  };

  const pdfExportComponent = useRef(null);

  const handleExportWithComponent = (event) => {
    pdfExportComponent.current.save();
  };

  const formatDate = (date) => {
    if (!date) return "";

    let day = "";

    if (date.value.getDate() > 9) {
      day = date.value.getDate();
    } else {
      day = `0${date.value.getDate()}`;
    }

    let month = "";

    if (date.value.getMonth() + 1 > 9) {
      month = date.value.getMonth() + 1;
    } else {
      month = `0${date.value.getMonth() + 1}`;
    }

    const year = date.value.getFullYear();

    setFechaNac(`${day}/${month}/${year}`);
  };

  return (
    <div className="main-container">
      <header className="header-container">
        <h1>Generador de pase de movilidad personalizado</h1>
      </header>
      <div className="user-info">
        <h1>Datos</h1>
        <p>Nombre completo (sin tildes)</p>
        <input
          placeholder="Ejemplo: Juan Antonio Perez Rosales"
          className="form-control"
          onChange={(e) => setNombre(e.target.value.toUpperCase())}
          value={nombre}
        />
        <p>RUT</p>
        <input
          placeholder="Ejemplo: 21.565.789-2"
          className="form-control"
          onChange={(e) => formatRut(e.target.value)}
          value={rut}
        />
        <p>Fecha de nacimiento (DD/MM/AAAA)</p>
        <DatePickerComponent
          id="calendar"
          placeholder="Ingresa la fecha de nacimiento"
          format="dd/MM/yyyy"
          onChange={(e) => formatDate(e)}
          start="Decade"
        />
        <p>Sexo</p>
        <select
          className="form-control"
          aria-label="Default select example"
          onChange={(e) => setSexo(e.target.value)}
        >
          <option defaultValue>Seleciona tu sexo</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
        </select>
        <p>Vacuna</p>
        <select
          className="form-control"
          aria-label="Default select example"
          onChange={(e) => setVacuna(e.target.value)}
        >
          <option defaultValue>Seleciona la vacuna</option>
          {data.map((vacuna, key) => {
            return (
              <option value={vacuna.name} key={key}>
                {vacuna.name}
              </option>
            );
          })}
        </select>
        <div
          className="user-background-qr"
          style={{ display: "flex", width: "90%" }}
        >
          <div className="user-background info-center">
            <p>Fondo</p>
            <input
              className="form-control"
              type="file"
              onChange={(e) => setFondo(e.target.files[0])}
            />
          </div>
          <div className="user-qr info-center">
            <p>Código QR</p>
            <input
              className="form-control"
              type="file"
              onChange={(e) => setQR(e.target.files[0])}
            />
          </div>
        </div>
        <button onClick={handleExportWithComponent} className="btn btn-primary">
          Descargar
        </button>
      </div>
      <div className="pdf-viewer">
        <PDFExport
          ref={pdfExportComponent}
          paperSize="A4"
          scale={0.7}
          margin="4cm"
        >
          <div
            className="pase front"
            style={
              preview
                ? { backgroundImage: `url(${preview})` }
                : { background: "#fff" }
            }
          >
            <img src={mevacuno} alt="logo-mevacuno" className="logo-mevacuno" />
          </div>
          <div className="pase back">
            <div className="left-back">
              <img
                src={previewQR ? previewQR : qrDefault}
                alt="codigo qr"
                className="codigo-qr"
              />
              <p
                style={{
                  marginTop: "30px",
                  fontSize: "13px",
                  maxWidth: "100%",
                }}
              >
                Esquema: {vacuna}
              </p>
            </div>
            <div className="right-back">
              <p>Nombre:</p>
              <h6>{nombre}</h6>
              <p>Documento:</p>
              <h6>{rut}</h6>
              <p>Fecha de nacimiento:</p>
              <h6>{fechaNac}</h6>
              <p>Sexo:</p>
              <h6>{sexo}</h6>
              <p className="end-text">
                El comprobante de vacunación sólo representa el avance en su
                estado de vacunación contra el COVID-19. En caso de requerir el
                PASE DE MOVILIDAD, escanee el código QR presentado en este
                documento con cualquier dispositivo habilitado para este fin.
              </p>
            </div>
          </div>
        </PDFExport>
      </div>
    </div>
  );
}

export default App;
