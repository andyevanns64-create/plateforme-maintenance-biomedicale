# MediLink — Plateforme collaborative de maintenance biomédicale à distance

## Contexte

Ce projet répond à une problématique de télémédecine à Madagascar : les établissements de santé (hôpitaux de district, cliniques mobiles, postes de santé ruraux) dépendent d'équipements biomédicaux (moniteurs, ECG, échographes, oxymètres, pompes à perfusion) dont la maintenance est freinée par l'éloignement des techniciens spécialisés et l'absence d'outils de gestion intégrés.

MediLink propose une plateforme numérique permettant de suivre l'état des équipements, signaler les pannes, planifier les interventions techniques et assurer un diagnostic à distance via visioconférence.

## Fonctionnalités

- **Gestion des équipements** : inventaire avec type, numéro de série, établissement et statut (fonctionnel / en panne / en maintenance)
- **Signalement d'incidents** : déclaration d'une panne liée à un équipement, avec description et niveau de priorité
- **Suivi des interventions** : planification d'une intervention technique liée à un incident, avec technicien assigné, date et compte-rendu
- **Diagnostic à distance** : visioconférence intégrée par incident, pour permettre à un technicien d'échanger en direct avec le personnel de terrain

## Architecture technique

| Composant | Technologie |
|---|---|
| Frontend | React (Vite) |
| Base de données | PostgreSQL (via Supabase) |
| Authentification / API | Supabase (REST auto-généré) |
| Visioconférence | Jitsi Meet (intégration iframe) |
| Hébergement | Netlify (déploiement continu depuis GitHub) |

## Modèle de données

Trois tables relationnelles :
- `equipement` — inventaire des dispositifs biomédicaux
- `incidents` — signalements de pannes, liés à un équipement (`equipement_id`)
- `interventions` — suivi des réparations, liées à un incident (`incident_id`)

## Démo en ligne

🔗 [maintenance-biomedicale-malagasy.netlify.app](https://maintenance-biomedicale-malagasy.netlify.app)

## Limites connues et évolutions futures

Ce projet est un MVP (produit minimum viable) démontrant la faisabilité du concept. Plusieurs éléments du cahier des charges initial restent à développer pour une mise en production réelle :

- **Mode hors-ligne** : la plateforme nécessite actuellement une connexion Internet permanente. Un mode de fonctionnement dégradé avec synchronisation différée est identifié comme priorité pour un déploiement en zone rurale à connectivité limitée.
- **Authentification et gestion des rôles** : pas de comptes utilisateurs différenciés (technicien / responsable hospitalier / fournisseur) dans cette version.
- **Visioconférence en production** : l'intégration Jitsi Meet utilisée est la version publique gratuite, limitée à 5 minutes par appel. Une mise en production nécessiterait soit un service Jitsi as a Service (JaaS), soit l'hébergement d'un serveur Jitsi dédié.
- **Base de connaissances collaborative** : non implémentée dans cette version.
- **Télémétrie temps réel des équipements** : nécessiterait une intégration matérielle avec les dispositifs biomédicaux connectés, hors périmètre de ce MVP.

## Auteur

Projet réalisé dans le cadre d'un cahier des charges sur la télémédecine et la maintenance biomédicale à Madagascar.
