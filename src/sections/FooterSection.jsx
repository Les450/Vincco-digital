import Icon from '../components/icons/Icon'

export default function FooterSection() {
  return (
    <footer className="vc-footer">
      <div className="vc-footer-container">
        <div className="vc-footer-grid">
          <div className="vc-footer-brand">
            <div className="vc-footer-logo">
              <img
                src="/assets/logos/vincco-logo.png"
                alt="Vincco"
                className="vc-footer-logo-img"
              />
              <span className="vc-footer-logo-text">Vincco</span>
            </div>
            <p className="vc-footer-desc">
              Conectamos consumidores, negocios y proveedores en un ecosistema
              digital que impulsa la economía local.
            </p>
            <div className="vc-footer-social">
              <a href="#!" className="vc-footer-social-link">𝕏</a>
              <a href="#!" className="vc-footer-social-link">in</a>
              <a href="#!" className="vc-footer-social-link">ig</a>
              <a href="#!" className="vc-footer-social-link">fb</a>
            </div>
          </div>

          <div>
            <h4 className="vc-footer-col-title">Empresa</h4>
            <ul className="vc-footer-links">
              <li><a href="#!" className="vc-footer-link">Nosotros</a></li>
              <li><a href="#!" className="vc-footer-link">Blog</a></li>
              <li><a href="#!" className="vc-footer-link">Equipo</a></li>
              <li><a href="#!" className="vc-footer-link">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="vc-footer-col-title">Productos</h4>
            <ul className="vc-footer-links">
              <li><a href="#!" className="vc-footer-link">Puntos Vincco</a></li>
              <li><a href="#!" className="vc-footer-link">Inventario</a></li>
              <li><a href="#!" className="vc-footer-link">Cotizaciones</a></li>
              <li><a href="#!" className="vc-footer-link">Dashboard</a></li>
            </ul>
          </div>

          <div>
            <h4 className="vc-footer-col-title">Ayuda</h4>
            <ul className="vc-footer-links">
              <li><a href="#!" className="vc-footer-link">Centro de ayuda</a></li>
              <li><a href="#!" className="vc-footer-link">Tutoriales</a></li>
              <li><a href="#!" className="vc-footer-link">FAQ</a></li>
              <li><a href="#!" className="vc-footer-link">Soporte</a></li>
            </ul>
          </div>

          <div>
            <h4 className="vc-footer-col-title">Legal</h4>
            <ul className="vc-footer-links">
              <li><a href="#!" className="vc-footer-link">Términos</a></li>
              <li><a href="#!" className="vc-footer-link">Privacidad</a></li>
              <li><a href="#!" className="vc-footer-link">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="vc-footer-bottom">
          <p className="vc-footer-copy">
            &copy; {new Date().getFullYear()} Vincco. Todos los derechos reservados.
          </p>
          <p className="vc-footer-copy" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            Hecho con <Icon name="heart" filled size={14} /> para la economía local
          </p>
        </div>
      </div>
    </footer>
  )
}
