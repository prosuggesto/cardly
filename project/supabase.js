// Cardly Pro — Supabase client + API layer
(function () {
  const SUPABASE_URL = 'https://wkwchmcmdazcrlxcofmo.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indrd2NobWNtZGF6Y3JseGNvZm1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjQxNDEsImV4cCI6MjA5MjcwMDE0MX0.gZcrLf8BZYVkDR5K3ecoFikHa7EP4a_wm-io6Oh9s3k';
  const FN_URL = SUPABASE_URL + '/functions/v1';

  window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  window._CARDLY_ANON_KEY = SUPABASE_ANON_KEY;
  window._CARDLY_FN_URL = FN_URL;

  window.CardlyAPI = {

    // ── Auth ─────────────────────────────────────────────────────────────
    async signIn(email, password) {
      return window.sb.auth.signInWithPassword({ email, password });
    },
    async signUp(email, password) {
      return window.sb.auth.signUp({ email, password });
    },
    async signOut() {
      return window.sb.auth.signOut();
    },

    // ── Profile ──────────────────────────────────────────────────────────
    async getProfile(userId) {
      return window.sb.from('profiles').select('*').eq('id', userId).single();
    },
    async upsertProfile(userId, data) {
      return window.sb.from('profiles').upsert({ id: userId, ...data }, { onConflict: 'id' }).select().single();
    },

    // ── Entreprise ───────────────────────────────────────────────────────
    async createEntreprise(adminId, nom_entreprise, website) {
      return window.sb.from('entreprises')
        .insert({ admin_id: adminId, nom_entreprise, website: website || null })
        .select().single();
    },
    async getEntrepriseByCode(code) {
      return window.sb.from('entreprises')
        .select('id, nom_entreprise, plan, statut, code_secret')
        .eq('code_secret', code.toUpperCase().trim())
        .single();
    },
    async joinEntreprise(entrepriseId, userId) {
      return window.sb.from('entreprise_members')
        .insert({ entreprise_id: entrepriseId, user_id: userId, role: 'member', statut: 'pending' })
        .select().single();
    },
    async getMyMembership(userId) {
      return window.sb.from('entreprise_members')
        .select('*, entreprises(*)')
        .eq('user_id', userId)
        .eq('statut', 'active')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();
    },
    async getMyPendingMembership(userId) {
      return window.sb.from('entreprise_members')
        .select('*, entreprises(nom_entreprise)')
        .eq('user_id', userId)
        .eq('statut', 'pending')
        .maybeSingle();
    },
    async getMembers(entrepriseId) {
      return window.sb.from('entreprise_members')
        .select('*, profiles(id, nom, prenom, email, poste, telephone)')
        .eq('entreprise_id', entrepriseId)
        .order('created_at', { ascending: true });
    },
    async acceptMember(memberId) {
      return window.sb.from('entreprise_members')
        .update({ statut: 'active' }).eq('id', memberId).select().single();
    },
    async removeMember(memberId) {
      return window.sb.from('entreprise_members').delete().eq('id', memberId);
    },
    async regenerateCode(entrepriseId) {
      // Generate a new code server-side via SQL
      const newCode = 'CARDLY-' + Math.random().toString(36).slice(2, 6).toUpperCase()
        + Math.random().toString(36).slice(2, 6).toUpperCase();
      return window.sb.from('entreprises')
        .update({ code_secret: newCode })
        .eq('id', entrepriseId)
        .select('code_secret').single();
    },

    // ── Cartes ───────────────────────────────────────────────────────────
    async getCartes(entrepriseId) {
      return window.sb.from('cartes').select('*')
        .eq('entreprise_id', entrepriseId)
        .order('created_at', { ascending: true });
    },
    // Cartes for current user only (Mes cartes page)
    async getMyCartes(userId, entrepriseId) {
      return window.sb.from('cartes').select('*')
        .eq('collaborateur_id', userId)
        .eq('entreprise_id', entrepriseId)
        .order('created_at', { ascending: true });
    },
    async getCarteByUuid(carteUuid) {
      return window.sb.from('cartes').select('*').eq('carte_uuid', carteUuid).single();
    },
    async createCarte(data) {
      return window.sb.from('cartes').insert(data).select().single();
    },
    async updateCarte(carteUuid, data) {
      return window.sb.from('cartes').update(data).eq('carte_uuid', carteUuid).select().single();
    },
    async deleteCarte(carteUuid) {
      return window.sb.from('cartes').delete().eq('carte_uuid', carteUuid);
    },

    // ── Événements ───────────────────────────────────────────────────────
    async getEvenements(entrepriseId) {
      return window.sb.from('evenements').select('*')
        .eq('entreprise_id', entrepriseId)
        .order('created_at', { ascending: false });
    },

    // ── Dashboard / Logs Leads ───────────────────────────────────────────
    async getLogsLeads(entrepriseId, { mois, annee, userId } = {}) {
      let q = window.sb.from('logs_leads').select('*').eq('entreprise_id', entrepriseId);
      if (mois)   q = q.eq('mois', mois);
      if (annee)  q = q.eq('annee', annee);
      if (userId) q = q.eq('user_id', userId);
      return q;
    },

    // ── CRM Contacts ─────────────────────────────────────────────────────
    async getCRMContacts(entrepriseId) {
      return window.sb.from('crm_contacts').select('*')
        .eq('entreprise_id', entrepriseId)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });
    },
    async deleteCRMContact(contactId) {
      return window.sb.from('crm_contacts').delete().eq('id', contactId);
    },

    // ── Mes idées ────────────────────────────────────────────────────────
    async getIdees(userId) {
      return window.sb.from('mes_idees').select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
    },
    async sendMessage(userId, { message, categorie, mail, telephone }) {
      return window.sb.from('mes_idees').insert({
        user_id: userId, message, categorie,
        mail: mail || null, telephone: telephone || null,
        sender: 'user',
      }).select().single();
    },

    // ── NFC Cards ────────────────────────────────────────────────────────
    async getNFCCards(userId, entrepriseId) {
      return window.sb.from('nfc_cards')
        .select('*, cartes(card_name, carte_uuid, statut)')
        .eq('user_id', userId).eq('entreprise_id', entrepriseId);
    },
    async linkNFCCard(nfcId, carteUuid) {
      return window.sb.from('nfc_cards')
        .update({ carte_uuid: carteUuid }).eq('id', nfcId).select().single();
    },

    // ── Edge Functions ───────────────────────────────────────────────────
    async trackAction(carteUuid, action) {
      try {
        const { data: { session } } = await window.sb.auth.getSession();
        await fetch(window._CARDLY_FN_URL + '/track-action', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': window._CARDLY_ANON_KEY,
            ...(session ? { 'Authorization': 'Bearer ' + session.access_token } : {}),
          },
          body: JSON.stringify({ carte_uuid: carteUuid, action }),
        });
      } catch (_) { /* non-bloquant */ }
    },

    async saveCRMContact(carteUuid, { nom, prenom, mail, tel, prospect_entreprise_nom } = {}) {
      const { data: { session } } = await window.sb.auth.getSession();
      const res = await fetch(window._CARDLY_FN_URL + '/save-crm-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': window._CARDLY_ANON_KEY,
          ...(session ? { 'Authorization': 'Bearer ' + session.access_token } : {}),
        },
        body: JSON.stringify({ carte_uuid: carteUuid, nom, prenom, mail, tel, prospect_entreprise_nom }),
      });
      return res.json();
    },
  };
})();
