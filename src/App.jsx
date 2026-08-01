import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

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

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <h1>Maintenance biomédicale</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setPage('equipements')}
          style={{ fontWeight: page === 'equipements' ? 'bold' : 'normal', marginRight: '10px' }}
        >
          Équipements
        </button>
        <button
          onClick={() => setPage('incidents')}
          style={{ fontWeight: page === 'incidents' ? 'bold' : 'normal', marginRight: '10px' }}
        >
          Incidents
        </button>
        <button
          onClick={() => setPage('interventions')}
          style={{ fontWeight: page === 'interventions' ? 'bold' : 'normal' }}
        >
          Interventions
        </button>
      </div>

      {erreur && <p style={{ color: 'red' }}>Erreur : {erreur}</p>}
      {loading && <p>Chargement...</p>}

      {!loading && page === 'equipements' && (
        <div>
          <form onSubmit={ajouterEquipement} style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <h2>Ajouter un équipement</h2>
            <div><label>Nom : </label><input value={nom} onChange={(e) => setNom(e.target.value)} required /></div>
            <div><label>Type : </label><input value={type} onChange={(e) => setType(e.target.value)} required /></div>
            <div><label>Numéro de série : </label><input value={numeroSerie} onChange={(e) => setNumeroSerie(e.target.value)} required /></div>
            <div><label>Établissement : </label><input value={etablissement} onChange={(e) => setEtablissement(e.target.value)} required /></div>
            <div>
              <label>Statut : </label>
              <select value={statut} onChange={(e) => setStatut(e.target.value)}>
                <option value="fonctionnel">Fonctionnel</option>
                <option value="en panne">En panne</option>
                <option value="en maintenance">En maintenance</option>
              </select>
            </div>
            <button type="submit">Ajouter</button>
          </form>

          <h2>Liste des équipements</h2>
          {equipements.length === 0 && <p>Aucun équipement.</p>}
          <ul>
            {equipements.map((eq) => (
              <li key={eq.id}>
                <strong>{eq.nom}</strong> — {eq.type} — {eq.numero_serie} — {eq.etablissement} — <em>{eq.statut}</em>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && page === 'incidents' && (
        <div>
          <form onSubmit={ajouterIncident} style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <h2>Signaler un incident</h2>
            <div>
              <label>Équipement concerné : </label>
              <select value={equipementId} onChange={(e) => setEquipementId(e.target.value)} required>
                <option value="">-- Choisir --</option>
                {equipements.map((eq) => (
                  <option key={eq.id} value={eq.id}>{eq.nom} ({eq.etablissement})</option>
                ))}
              </select>
            </div>
            <div>
              <label>Description : </label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div>
              <label>Priorité : </label>
              <select value={priorite} onChange={(e) => setPriorite(e.target.value)}>
                <option value="basse">Basse</option>
                <option value="moyenne">Moyenne</option>
                <option value="haute">Haute</option>
              </select>
            </div>
            <button type="submit">Signaler</button>
          </form>

          <h2>Liste des incidents</h2>
          {incidents.length === 0 && <p>Aucun incident signalé.</p>}
          <ul>
            {incidents.map((inc) => (
              <li key={inc.id}>
                <strong>{nomEquipement(inc.equipement_id)}</strong> — {inc.description} — priorité <em>{inc.priorite}</em> — statut <em>{inc.statut}</em>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && page === 'interventions' && (
        <div>
          <form onSubmit={ajouterIntervention} style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <h2>Planifier une intervention</h2>
            <div>
              <label>Incident concerné : </label>
              <select value={incidentId} onChange={(e) => setIncidentId(e.target.value)} required>
                <option value="">-- Choisir --</option>
                {incidents.map((inc) => (
                  <option key={inc.id} value={inc.id}>
                    {nomEquipement(inc.equipement_id)} — {inc.description}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Technicien : </label>
              <input value={technicien} onChange={(e) => setTechnicien(e.target.value)} required />
            </div>
            <div>
              <label>Date d'intervention : </label>
              <input type="date" value={dateIntervention} onChange={(e) => setDateIntervention(e.target.value)} required />
            </div>
            <div>
              <label>Compte-rendu : </label>
              <textarea value={compteRendu} onChange={(e) => setCompteRendu(e.target.value)} />
            </div>
            <button type="submit">Planifier</button>
          </form>

          <h2>Liste des interventions</h2>
          {interventions.length === 0 && <p>Aucune intervention.</p>}
          <ul>
            {interventions.map((it) => (
              <li key={it.id}>
                <strong>{equipementDeIncident(it.incident_id)}</strong> — {descriptionIncident(it.incident_id)} — technicien : {it.technicien} — le {it.date_intervention} — <em>{it.statut}</em>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
