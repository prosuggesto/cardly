// Cardly Pro — Supabase client + API layer
(function () {
  try {
    const SUPABASE_URL = 'https://wkwchmcmdazcrlxcofmo.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indrd2NobWNtZGF6Y3JseGNvZm1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjQxNDEsImV4cCI6MjA5MjcwMDE0MX0.gZcrLf8BZYVkDR5K3ecoFikHa7EP4a_wm-io6Oh9s3k';

    window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    window.CardlyAPI = {
      async signIn(email, pwd) {
        return window.sb.auth.signInWithPassword({ email, password: pwd });
      },
      async signUp(email, pwd) {
        return window.sb.auth.signUp({ email, password: pwd });
      },
      async signOut() {
        return window.sb.auth.signOut();
      },
      async getProfile(userId) {
        return window.sb.from('profiles').select('*').eq('id', userId).single();
      },
      async upsertProfile(userId, data) {
        return window.sb.from('profiles').upsert({ id: userId, ...data }, { onConflict: 'id' }).select().single();
      },
      async createEntreprise(adminId, nom_entreprise, website) {
        return window.sb.from('entreprises')
          .insert({ admin_id: adminId, nom_entreprise, website: website || null })
          .select().single();
      },
      async getEntrepriseByCode(code) {
        return window.sb.from('entreprises')
          .select('id, nom_entreprise, plan, code_secret')
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
          .in('statut', ['active', 'pending'])
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle();
      },
      async getMyCartes(userId, entrepriseId) {
        return window.sb.from('cartes').select('*')
          .eq('collaborateur_id', userId)
          .eq('entreprise_id', entrepriseId)
          .order('created_at', { ascending: true });
      },
    };
  } catch (e) {
    console.error('[Cardly] Supabase init failed:', e);
    window.sb = null;
    window.CardlyAPI = null;
  }
})();
