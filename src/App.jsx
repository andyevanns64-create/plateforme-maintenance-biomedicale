import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const couleurs = {
  fond: '#f4f6f8',
  carte: '#ffffff',
  accent: '#0f766e',
  accentClair: '#e6f4f2',
  texte: '#1f2937',
  texteClair: '#6b7280',
  bordure: '#e5e7eb',
}

const badgePriorite = {
  haute: { bg: '#fee2e2', color: '#b91c1c' },
  moyenne: { bg: '#fef3c7', color: '#92400e' },
  basse: { bg: '#dcfce7', color: '#166534' },
}

const badgeStatutEquipement = {
  fonctionnel: { bg: '#dcfce7', color: '#166534' },
  'en panne': { bg: '#fee2e2', color: '#b91c1c' },
  'en maintenance': { bg: '#fef3c7', color: '#92400e' },
}

function Badge({ label, style }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 600,
      backgroundColor: style?.bg || '#eee',
      color: style?.color || '#333',
      textTransform: 'capitalize',
    }}>
      {label}
    </span>
  )
}

const styleInput = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: '6px',
  border: `1px solid ${couleurs.bordure}`,
  marginTop: '4px',
  marginBottom: '12px',
  fontSize: '14px',
  boxSizing: 'border-box',
}

const styleLabel = {
  fontSize: '13px',
  fontWeight: 600,
  color: couleurs.texte,
}

const styleBouton = {
  backgroundColor: couleurs.accent,
  color: 'white',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '6px',
  fontWeight: 600,
  fontSize: '14px',
  cursor: 'pointer',
}

const styleCarte = {
  backgroundColor: couleurs.carte,
  borderRadius: '10px',
  padding: '20px',
  marginBottom: '24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  border: `1px solid ${couleurs.bordure}`,
}

function App() {
  const [page, setPage] = useState('equipements')

  const [equipements, setEquipements] = useState([])
  const [incidents, setIncidents] = useState([])
  const [interventions, setInterventions] = useState([])
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur] = useState(null)

  const [nom, setNom] = useState('')
  const [type, setType] = useState('')
  const [numeroSerie, setNumeroSerie] = useState('')
  const [etablissement, setEtablissement] = useState('')
  const [statut, setStatut] = useState('fonctionnel')

  const [equipementId, setEquipementId] = useState('')
  const [description, setDescription] = useState('')
  const [priorite, setPriorite] = useState('moyenne')

  const [incidentId, setIncidentId] = useState('')
  const [technicien, setTechnicien] = useState('')
  const [dateIntervention, setDateIntervention] = useState('')
  const [compteRendu, setCompteRendu] = useState('')

  const [visioOuverte, setVisioOuverte] = useState(null)

  useEffect(() => {
    chargerDonnees()
  }, [])

  async function chargerDonnees() {
    setLoading(true)
    setErreur(null)

    const { data: dataEq, error: errEq } = await supabase
      .from('equipement')
      .select('*')
      .order('id', { ascending: false })

    const { data: dataInc, error: errInc } = await supabase
      .from('incidents')
      .select('*')
      .order('id', { ascending: false })

    const { data: dataInt, error: errInt } = await supabase
      .from('interventions')
      .select('*')
      .order('id', { ascending: false })

    if (errEq) setErreur(errEq.message)
    else setEquipements(dataEq || [])

    if (errInc) setErreur(errInc.message)
    else setIncidents(dataInc || [])

    if (errInt) setErreur(errInt.message)
    else setInterventions(dataInt || [])

    setLoading(false)
  }

  function nomEquipement(id) {
    const eq = equipements.find((e) => e.id === id)
    return eq ? eq.nom : 'Équipement inconnu'
  }

  function descriptionIncident(id) {
    const inc = incidents.find((i) => i.id === id)
    return inc ? inc.description : 'Incident inconnu'
  }

  function equipementDeIncident(id) {
    const inc = incidents.find((i) => i.id === id)
    if (!inc) return 'Équipement inconnu'
    return nomEquipement(inc.equipement_id)
  }

  async function ajouterEquipement(e) {
    e.preventDefault()
    const { error } = await supabase
      .from('equipement')
      .insert([{ nom, type, numero_serie: numeroSerie, etablissement, statut }])

    if (error) { alert('Erreur : ' + error.message); return }

    setNom(''); setType(''); setNumeroSerie(''); setEtablissement(''); setStatut('fonctionnel')
    chargerDonnees()
  }

  async function ajouterIncident(e) {
    e.preventDefault()
    if (!equipementId) { alert('Choisis un équipement'); return }

    const { error } = await supabase
      .from('incidents')
      .insert([{
        equipement_id: parseInt(equipementId),
        description,
        priorite,
        statut: 'ouvert'
      }])

    if (error) { alert('Erreur : ' + error.message); return }

    setEquipementId(''); setDescription(''); setPriorite('moyenne')
    chargerDonnees()
  }

  async function ajouterIntervention(e) {
    e.preventDefault()
    if (!incidentId) { alert('Choisis un incident'); return }

    const { error } = await supabase
      .from('interventions')
      .insert([{
        incident_id: parseInt(incidentId),
        technicien,
        date_intervention: dateIntervention,
        compte_rendu: compteRendu,
        statut: 'planifiée'
      }])

    if (error) { alert('Erreur : ' + error.message); return }

    setIncidentId(''); setTechnicien(''); setDateIntervention(''); setCompteRendu('')
    chargerDonnees()
  }

  function toggleVisio(incidentId) {
    setVisioOuverte(visioOuverte === incidentId ? null : incidentId)
  }

  return (
    <div style={{ backgroundColor: couleurs.fond, minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ padding: '30px 20px', maxWidth: '760px', margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '8px',
            backgroundColor: couleurs.accent, color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '16px'
          }}>+</div>
          <h1 style={{ margin: 0, fontSize: '24px', color: couleurs.texte }}>Maintenance biomédicale</h1>
        </div>
        <p style={{ color: couleurs.texteClair, marginTop: '4px', marginBottom: '24px', fontSize: '14px' }}>
          Suivi des équipements, signalement d'incidents et interventions à distance
        </p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {['equipements', 'incidents', 'interventions'].map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                border: `1px solid ${page === p ? couleurs.accent : couleurs.bordure}`,
                backgroundColor: page === p ? couleurs.accent : 'white',
                color: page === p ? 'white' : couleurs.texte,
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {p === 'equipements' ? 'Équipements' : p === 'incidents' ? 'Incidents' : 'Interventions'}
            </button>
          ))}
        </div>

        {erreur && <p style={{ color: '#b91c1c' }}>Erreur : {erreur}</p>}
        {loading && <p style={{ color: couleurs.texteClair }}>Chargement...</p>}

        {!loading && page === 'equipements' && (
          <div>
            <div style={styleCarte}>
              <h2 style={{ marginTop: 0, fontSize: '17px' }}>Ajouter un équipement</h2>
              <form onSubmit={ajouterEquipement}>
                <label style={styleLabel}>Nom</label>
                <input style={styleInput} value={nom} onChange={(e) => setNom(e.target.value)} required />
                <label style={styleLabel}>Type</label>
                <input style={styleInput} value={type} onChange={(e) => setType(e.target.value)} required />
                <label style={styleLabel}>Numéro de série</label>
                <input style={styleInput} value={numeroSerie} onChange={(e) => setNumeroSerie(e.target.value)} required />
                <label style={styleLabel}>Établissement</label>
                <input style={styleInput} value={etablissement} onChange={(e) => setEtablissement(e.target.value)} required />
                <label style={styleLabel}>Statut</label>
                <select style={styleInput} value={statut} onChange={(e) => setStatut(e.target.value)}>
                  <option value="fonctionnel">Fonctionnel</option>
                  <option value="en panne">En panne</option>
                  <option value="en maintenance">En maintenance</option>
                </select>
                <button type="submit" style={styleBouton}>Ajouter</button>
              </form>
            </div>

            <h2 style={{ fontSize: '17px', color: couleurs.texte }}>Liste des équipements</h2>
            {equipements.length === 0 && <p style={{ color: couleurs.texteClair }}>Aucun équipement.</p>}
            {equipements.map((eq) => (
              <div key={eq.id} style={{ ...styleCarte, marginBottom: '12px', padding: '14px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{eq.nom}</strong>
                    <div style={{ fontSize: '13px', color: couleurs.texteClair }}>
                      {eq.type} — n° {eq.numero_serie} — {eq.etablissement}
                    </div>
                  </div>
                  <Badge label={eq.statut} style={badgeStatutEquipement[eq.statut]} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && page === 'incidents' && (
          <div>
            <div style={styleCarte}>
              <h2 style={{ marginTop: 0, fontSize: '17px' }}>Signaler un incident</h2>
              <form onSubmit={ajouterIncident}>
                <label style={styleLabel}>Équipement concerné</label>
                <select style={styleInput} value={equipementId} onChange={(e) => setEquipementId(e.target.value)} required>
                  <option value="">-- Choisir --</option>
                  {equipements.map((eq) => (
                    <option key={eq.id} value={eq.id}>{eq.nom} ({eq.etablissement})</option>
                  ))}
                </select>
                <label style={styleLabel}>Description</label>
                <textarea style={{ ...styleInput, minHeight: '70px' }} value={description} onChange={(e) => setDescription(e.target.value)} required />
                <label style={styleLabel}>Priorité</label>
                <select style={styleInput} value={priorite} onChange={(e) => setPriorite(e.target.value)}>
                  <option value="basse">Basse</option>
                  <option value="moyenne">Moyenne</option>
                  <option value="haute">Haute</option>
                </select>
                <button type="submit" style={styleBouton}>Signaler</button>
              </form>
            </div>

            <h2 style={{ fontSize: '17px', color: couleurs.texte }}>Liste des incidents</h2>
            {incidents.length === 0 && <p style={{ color: couleurs.texteClair }}>Aucun incident signalé.</p>}
            {incidents.map((inc) => (
              <div key={inc.id} style={{ ...styleCarte, marginBottom: '12px', padding: '14px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                  <div>
                    <strong>{nomEquipement(inc.equipement_id)}</strong>
                    <div style={{ fontSize: '13px', color: couleurs.texteClair, marginTop: '2px' }}>{inc.description}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <Badge label={inc.priorite} style={badgePriorite[inc.priorite]} />
                    <Badge label={inc.statut} />
                  </div>
                </div>
                <button
                  onClick={() => toggleVisio(inc.id)}
                  style={{ ...styleBouton, backgroundColor: couleurs.accentClair, color: couleurs.accent, marginTop: '12px', fontSize: '13px', padding: '6px 12px' }}
                >
                  {visioOuverte === inc.id ? 'Fermer la visioconférence' : '📹 Démarrer une visioconférence'}
                </button>

                {visioOuverte === inc.id && (
                  <div style={{ marginTop: '10px' }}>
                    <iframe
                      src={`https://meet.jit.si/maintenance-biomed-incident-${inc.id}#config.hideConferenceSubject=true&config.disableDeepLinking=true&config.prejoinConfig.enabled=false&interfaceConfig.SHOW_JITSI_WATERMARK=false&interfaceConfig.SHOW_BRAND_WATERMARK=false&interfaceConfig.SHOW_POWERED_BY=false`}
                      style={{ width: '100%', height: '400px', border: 'none', borderRadius: '8px' }}
                      allow="camera; microphone; fullscreen; display-capture"
                      title={`Visio incident ${inc.id}`}
                    ></iframe>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && page === 'interventions' && (
          <div>
            <div style={styleCarte}>
              <h2 style={{ marginTop: 0, fontSize: '17px' }}>Planifier une intervention</h2>
              <form onSubmit={ajouterIntervention}>
                <label style={styleLabel}>Incident concerné</label>
                <select style={styleInput} value={incidentId} onChange={(e) => setIncidentId(e.target.value)} required>
                  <option value="">-- Choisir --</option>
                  {incidents.map((inc) => (
                    <option key={inc.id} value={inc.id}>
                      {nomEquipement(inc.equipement_id)} — {inc.description}
                    </option>
                  ))}
                </select>
                <label style={styleLabel}>Technicien</label>
                <input style={styleInput} value={technicien} onChange={(e) => setTechnicien(e.target.value)} required />
                <label style={styleLabel}>Date d'intervention</label>
                <input type="date" style={styleInput} value={dateIntervention} onChange={(e) => setDateIntervention(e.target.value)} required />
                <label style={styleLabel}>Compte-rendu</label>
                <textarea style={{ ...styleInput, minHeight: '70px' }} value={compteRendu} onChange={(e) => setCompteRendu(e.target.value)} />
                <button type="submit" style={styleBouton}>Planifier</button>
              </form>
            </div>

            <h2 style={{ fontSize: '17px', color: couleurs.texte }}>Liste des interventions</h2>
            {interventions.length === 0 && <p style={{ color: couleurs.texteClair }}>Aucune intervention.</p>}
            {interventions.map((it) => (
              <div key={it.id} style={{ ...styleCarte, marginBottom: '12px', padding: '14px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{equipementDeIncident(it.incident_id)}</strong>
                    <div style={{ fontSize: '13px', color: couleurs.texteClair, marginTop: '2px' }}>
                      {descriptionIncident(it.incident_id)} — technicien : {it.technicien} — le {it.date_intervention}
                    </div>
                    {it.compte_rendu && (
                      <div style={{ fontSize: '13px', color: couleurs.texte, marginTop: '6px', fontStyle: 'italic' }}>
                        Compte-rendu : {it.compte_rendu}
                      </div>
                    )}
                  </div>
                  <Badge label={it.statut} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
