import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/icons/Icon'
import { categoriasFavoritos, negociosFavoritos } from '../data/data_falso'
import './Favoritos.css'

export default function Favoritos() {
  const navigate = useNavigate()
  const [favoritos, setFavoritos] = useState(negociosFavoritos)
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState(null)

  const favoritosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    return favoritos.filter((f) => {
      const coincideCategoria = !categoria || f.categoria === categoria
      const coincideTexto = !texto || f.nombre.toLowerCase().includes(texto)
      return coincideCategoria && coincideTexto
    })
  }, [favoritos, busqueda, categoria])

  const quitarFavorito = (id) => {
    setFavoritos((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <div className="fav">
      <div className="fav-header">
        <h2>Mis Favoritos</h2>
        <p>Encuentra rápidamente los comercios que has guardado como favoritos.</p>
      </div>

      <div className="fav-search">
        <Icon name="search" size={18} className="fav-search-icon" />
        <input
          type="text"
          placeholder="Buscar negocio favorito..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar negocio favorito"
        />
      </div>

      <div className="fav-categorias">
        <button
          className={`fav-categoria-btn ${!categoria ? 'fav-categoria-btn--activa' : ''}`}
          onClick={() => setCategoria(null)}
          type="button"
        >
          Todas
        </button>
        {categoriasFavoritos.map((cat) => (
          <button
            key={cat}
            className={`fav-categoria-btn ${categoria === cat ? 'fav-categoria-btn--activa' : ''}`}
            onClick={() => setCategoria(cat)}
            type="button"
          >
            {cat}
          </button>
        ))}
      </div>

      {favoritosFiltrados.length === 0 ? (
        <div className="fav-vacio">
          <div className="fav-vacio-icono">
            <Icon name="heart" size={32} />
          </div>
          <p>
            {favoritos.length === 0
              ? 'Aún no tienes comercios favoritos.'
              : 'No encontramos favoritos con ese filtro.'}
          </p>
          <div className="fav-vacio-sub">
            {favoritos.length === 0
              ? 'Guarda tus negocios favoritos para encontrarlos rápidamente cuando los necesites.'
              : 'Prueba con otra categoría o término de búsqueda.'}
          </div>
          <button className="fav-vacio-btn" onClick={() => navigate('/directorio')} type="button">
            Explorar negocios
          </button>
        </div>
      ) : (
        <div className="fav-lista">
          {favoritosFiltrados.map((f) => (
            <div key={f.id} className="fav-card">
              <div className="fav-card-thumb">
                <Icon name={f.icono} size={26} />
              </div>
              <div className="fav-card-info">
                <div className="fav-card-top">
                  <strong className="fav-card-nombre">{f.nombre}</strong>
                  <span className="fav-card-rating">
                    <Icon name="star" filled size={13} />
                    {f.rating}
                  </span>
                </div>
                <span className="fav-card-categoria">{f.categoria}</span>
                <p className="fav-card-direccion">
                  <Icon name="map-pin" size={13} />
                  {f.direccion}
                </p>
                <p className="fav-card-descripcion">{f.descripcion}</p>
              </div>
              <div className="fav-card-actions">
                <button
                  className="fav-card-heart"
                  onClick={() => quitarFavorito(f.id)}
                  aria-label="Quitar de favoritos"
                  type="button"
                >
                  <Icon name="heart" size={18} />
                </button>
                <button
                  className="fav-card-perfil"
                  onClick={() => navigate('/directorio')}
                  type="button"
                >
                  Ver perfil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
