<template>
  <div class="login-container">
    <div class="login-box">
      <form @submit.prevent="loginAdmin">
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
      emit('login', { name: 'Admin', role: 'admin' });
    }
  }
  
  function continueAsVisitor() {
    emit('login', { name: 'Visiteur', role: 'visiteur' });
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
  
  .login-box h2 {
    font-size: 1.4rem;
    margin-bottom: 16px;
  }
  
  .login-box input {
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
  </style>
  