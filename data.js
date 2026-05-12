// Cardly Pro — mock data layer (shaped to match future Supabase schema)

window.CARTALIS_DATA = (function() {
  const entreprise = {
    id: "ent-001",
    nom_entreprise: "Cartalis",
    code_secret: "CARTALIS-8K4P",
    plan: "team", // 'solo' | 'team' | 'enterprise'
    max_collaborateurs: 10,
    owner_id: "u-001",
    statut: "active",
  };

  const profileMe = {
    id: "u-001",
    nom: "Lamperim",
    prenom: "Diego",
    telephone: "07 67 56 92 24",
    email: "contact.cartalis@gmail.com",
    poste: "Directeur commercial",
    role: "admin", // 'admin' | 'collaborator'
    site_web: "cartalis.fr",
    instagram: "cartalis",
    linkedin: "diego-lamperim-cartalis",
  };

  const collaborators = [
    { id: "u-002", prenom: "Emma", nom: "Laurent", email: "emma@cartalis.fr", poste: "Conseillère", leads: 42, statut: "actif", role_membre: "responsable", last_click: "Il y a 2h" },
    { id: "u-003", prenom: "Hugo", nom: "Bernard", email: "hugo@cartalis.fr", poste: "Commercial", leads: 31, statut: "actif", role_membre: "collaborateur", last_click: "Il y a 5h" },
    { id: "u-004", prenom: "Sofia", nom: "Garcia", email: "sofia@cartalis.fr", poste: "Agent immobilier", leads: 18, statut: "en_attente", role_membre: "collaborateur", last_click: "—" },
    { id: "u-005", prenom: "Nathan", nom: "Morel", email: "nathan@cartalis.fr", poste: "Commercial junior", leads: 9, statut: "actif", role_membre: "collaborateur", last_click: "Hier" },
  ];

  // 6 card design variants (used in landing carousel + Mes cartes)
  const cardDesigns = [
    { id: "design-style-chinois",      label: "Style Chinois",      front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-style-chinois-front.webp",      back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-style-chinois-back.webp",      ink: "#2a241a", tag: "Signature" },
    { id: "design-serisier",           label: "Cerisier",           front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-serisier-front.webp",           back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-serisier-back.webp",           ink: "#2a241a", tag: "Nature" },
    { id: "design-bambou",             label: "Bambou",             front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-bambou-front.webp",             back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-bambou-back.webp",             ink: "#2a241a", tag: "Nature" },
    { id: "design-coline",             label: "Coline",             front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-coline-front.webp",             back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-coline-back.webp",             ink: "#2a241a", tag: "Nature" },
    { id: "design-fleures-roses",      label: "Fleurs Roses",       front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-fleures-roses-front.webp",      back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-fleures-roses-back.webp",      ink: "#2a241a", tag: "Floral" },
    { id: "design-plantes-verte",      label: "Plantes",            front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-plantes-verte-front.webp",      back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-plantes-verte-back.webp",      ink: "#2a241a", tag: "Nature" },
    { id: "design-nature-vert",        label: "Nature Vert",        front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-nature-vert-front.webp",        back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-nature-vert-back.webp",        ink: "#2a241a", tag: "Nature" },
    { id: "design-anime-nuage-vert",   label: "Nuage Vert",         front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-anime-nuage-vert-front.webp",   back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-anime-nuage-vert-back.webp",   ink: "#2a241a", tag: "Animé" },
    { id: "design-eventail-rouge",     label: "Éventail Rouge",     front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-eventail-rouge-front.webp",     back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-eventail-rouge-back.webp",     ink: "#2a241a", tag: "Artistique" },
    { id: "design-mon-fugi-vangog",    label: "Fuji Van Gogh",      front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-mon-fugi-vangog-front.webp",    back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-mon-fugi-vangog-back.webp",    ink: "#2a241a", tag: "Artistique" },
    { id: "design-papier-1",           label: "Papier I",           front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-papier-1-front.webp",           back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-papier-1-back.webp",           ink: "#2a241a", tag: "Minimal" },
    { id: "design-papier-simple-2",    label: "Papier II",          front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-papier-simple-2-front.webp",    back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-papier-simple-2-back.webp",    ink: "#2a241a", tag: "Minimal" },
    { id: "design-papirer-simple-3",   label: "Papier III",         front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-papirer-simple-3-front.webp",   back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-papirer-simple-3-back.webp",   ink: "#2a241a", tag: "Minimal" },
    { id: "design-papier-simple-4",    label: "Papier IV",          front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-papier-simple-4-front.webp",    back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-papier-simple-4-back.webp",    ink: "#2a241a", tag: "Minimal" },
    { id: "design-papie-simple-5",     label: "Papier V",           front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-papie-simple-5-front.webp",     back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-papie-simple-5-back.webp",     ink: "#2a241a", tag: "Minimal" },
    { id: "design-sobre-elegant",      label: "Sobre & Élégant",    front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-sobre-elegant-front.webp",      back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-sobre-elegant-back.webp",      ink: "#2a241a", tag: "Élégant" },
    { id: "design-beige-unie",         label: "Beige",              front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-beige-unie-front.webp",         back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-beige-unie-back.webp",         ink: "#2a241a", tag: "Uni" },
    { id: "design-argent-unie",        label: "Argent",             front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-argent-unie-front.webp",        back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-argent-unie-back.webp",        ink: "#2a241a", tag: "Uni" },
    { id: "design-unie-or",            label: "Or",                 front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-unie-or-front.webp",            back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-unie-or-back.webp",            ink: "#2a241a", tag: "Uni" },
    { id: "design-unie-rose",          label: "Rose",               front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-unie-rose-front.webp",          back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-unie-rose-back.webp",          ink: "#2a241a", tag: "Uni" },
    { id: "design-unie-orange",        label: "Orange",             front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-unie-orange-front.webp",        back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-unie-orange-back.webp",        ink: "#ffffff", tag: "Uni" },
    { id: "design-unie-violet",        label: "Violet",             front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-unie-violet-front.webp",        back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-unie-violet-back.webp",        ink: "#ffffff", tag: "Uni" },
    { id: "design-red-unie",           label: "Rouge",              front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-red-unie-front.webp",           back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-red-unie-back.webp",           ink: "#ffffff", tag: "Uni" },
    { id: "design-blue-unie",          label: "Bleu",               front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-blue-unie-front.webp",          back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-blue-unie-back.webp",          ink: "#ffffff", tag: "Uni" },
    { id: "design-black-unie",         label: "Noir",               front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-black-unie-front.webp",         back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-black-unie-back.webp",         ink: "#f1deb6", tag: "Uni" },
    { id: "design-classie-black",      label: "Classique Noir",     front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-classie-black-front.webp",      back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-classie-black-back.webp",      ink: "#f1deb6", tag: "Premium" },
    { id: "design-luxe-blac-or",       label: "Luxe Noir & Or",     front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-luxe-blac-or-front.webp",       back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-luxe-blac-or-back.webp",       ink: "#f1deb6", tag: "Luxe" },
    { id: "design-premium-blue",       label: "Premium Bleu",       front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-premium-blue-front.webp",       back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-premium-blue-back.webp",       ink: "#ffffff", tag: "Premium" },
    { id: "design-classique-immo",     label: "Classique Immo",     front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-classique-immo-front.webp",     back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-classique-immo-back.webp",     ink: "#2a241a", tag: "Immobilier" },
    { id: "design-immoblier-bleu",     label: "Immo Bleu",          front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-immoblier-bleu-front.webp",     back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-immoblier-bleu-back.webp",     ink: "#ffffff", tag: "Immobilier" },
    { id: "design-immoblier-luxe-bleu",label: "Immo Luxe Bleu",     front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-immoblier-luxe-bleu-front.webp",back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-immoblier-luxe-bleu-back.webp",ink: "#ffffff", tag: "Immobilier" },
    { id: "design-immoblier-vert",     label: "Immo Vert",          front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-immoblier-vert-front.webp",     back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-immoblier-vert-back.webp",     ink: "#ffffff", tag: "Immobilier" },
    { id: "design-ocean",              label: "Océan",              front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-ocean-front.webp",              back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-ocean-back.webp",              ink: "#ffffff", tag: "Nature" },
    { id: "design-costume",            label: "Costume",            front: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-costume-front.webp",            back: "https://wkwchmcmdazcrlxcofmo.supabase.co/storage/v1/object/public/card-designs/design-costume-back.webp",            ink: "#f1deb6", tag: "Élégant" },
  ];

  // Cards chargées depuis Supabase — tableau vide à l'init, hydraté par auth.jsx / app.jsx
  const cards = [];

  // CRM contacts — chargés dynamiquement depuis Supabase (table crm_contacts)
  const crmContacts = [];

  return {
    entreprise, profileMe, collaborators, cardDesigns, cards, crmContacts,
    // helpers
    getDesign: (id) => cardDesigns.find(d => d.id === id) || cardDesigns[0],
    leadsThisMonth: 142,
    leadsLastMonth: 118,
    activeCollabs: 3,
  };
})();
