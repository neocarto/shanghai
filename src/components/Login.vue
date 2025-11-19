<template>
  <div class="login-container">
    <div class="login-box">
      <form @submit.prevent="loginAdmin">

        <!-- Radio buttons stylés -->
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" value="Riate" v-model="site" />
            <span>Riate</span>
          </label>
          <label class="radio-label">
            <input type="radio" value="Condorcet" v-model="site" />
            <span>Condorcet</span>
          </label>
        </div>

        <input
          v-model="password"
          type="password"
          placeholder="Mot de passe"
          autocomplete="current-password"
        />
        <button type="submit" :disabled="loading">
          {{ loading ? "Connexion..." : "Se connecter" }}
        </button>
      </form>
      <a @click.prevent="continueAsVisitor" href="#" class="visitor-link">
        Continuer en tant que visiteur
      </a>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { loginWithPasswordOnly } from '../supabase.js';

const emit = defineEmits(['login']);
const password = ref('');
const site = ref('Riate'); // valeur par défaut
const error = ref(null);
const loading = ref(false);

async function loginAdmin() {
  error.value = null;
  loading.value = true;

  const success = await loginWithPasswordOnly(password.value);
  loading.value = false;

  if (!success) {
    error.value = 'Mot de passe incorrect.';
  } else {
    emit('login', { name: 'Admin', role: 'admin', site: site.value });
  }
}

function continueAsVisitor() {
  emit('login', { name: 'Visiteur', role: 'visiteur', site: site.value });
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
}

.login-box {
  background: white;
  padding: 24px 32px;
  border-radius: 12px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 320px;
  box-sizing: border-box;
}

.login-box input[type="password"] {
  width: 100%;
  padding: 10px 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 12px;
  box-sizing: border-box;
}

.login-box button {
  width: 100%;
  padding: 10px 12px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 8px;
  transition: background-color 0.2s ease;
}

.login-box button:hover {
  background-color: #f0f0f0;
}

.visitor-link {
  display: block;
  margin-top: 16px;
  font-size: 0.9rem;
  color: #666;
  text-decoration: none;
  cursor: pointer;
}

.visitor-link:hover {
  color: #000;
  text-decoration: underline;
}

.error {
  margin-top: 12px;
  color: red;
  font-weight: bold;
  font-size: 0.9rem;
}

/* --- Styles custom pour les radio --- */
.radio-group {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

.radio-label {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;

  padding: 10px 14px;
  border: 2px solid #ddd;
  border-radius: 10px;
  background: #fafafa;
  cursor: pointer;
  font-size: 0.95rem;

  transition: 
    border-color 0.2s ease,
    background-color 0.2s ease,
    transform 0.15s ease,
    color 0.2s ease;
}

.radio-label:hover {
  background-color: #f5f5f5;
  border-color: #bbb;
  transform: translateY(-1px);
}

.radio-label input {
  display: none;
}

/* Tout le label devient bleu quand sélectionné */
.radio-label:has(input:checked) {
  background-color: #1C212B;  /* bleu */
  color: white;             
  border-color: #1C212B;      
  font-weight: 600;
}
</style>
