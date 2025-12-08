<template>
    <div class="karaoke-container">
        <div class="header-section">
            <h1>🎤 Karaoké au Berthom</h1>
            <p class="subtitle">Strasbourg</p>
        </div>

        <!-- Message d'erreur -->
        <div v-if="errorMessage" class="error-banner">
            ⚠️ {{ errorMessage }}
        </div>

        <div class="list-section">
            <h2>🎵 Liste des souhaits <span class="count">({{ songList.length }})</span></h2>
            <ul v-if="songList.length > 0" class="song-list">
                <li v-for="entry in songList" :key="entry.id" class="song-item">
                    <div class="song-info">
                        <span class="prenom">{{ entry.firstname }}</span>
                        <span class="chanson">{{ entry.song }}</span>
                    </div>
                </li>
            </ul>
            <p v-else class="empty-message">Aucune chanson pour le moment... 🎶</p>
        </div>

        <div class="form-section">
            <h2>➕ Ajouter une chanson</h2>
            <form @submit.prevent="addSong">
                <div class="form-group">
                    <label for="prenom">Votre prénom :</label>
                    <input 
                        v-model="newEntry.firstname" 
                        type="text" 
                        id="prenom" 
                        required 
                        placeholder="Entrez votre prénom"
                        class="form-input"
                        :disabled="isLoading"
                    />
                </div>
                
                <div class="form-group">
                    <label for="chanson">Chanson :</label>
                    <input 
                        v-model="newEntry.song" 
                        type="text" 
                        id="chanson" 
                        required 
                        placeholder="Titre de la chanson"
                        class="form-input"
                        :disabled="isLoading"
                    />
                </div>
                
                <button type="submit" class="submit-btn" :disabled="isLoading">
                    {{ isLoading ? '⏳ Envoi...' : '🎤 Ajouter à la liste' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const newEntry = ref({
    firstname: '',
    song: ''
})

const songList = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const SHEETDB_URL = 'https://sheetdb.io/api/v1/djxhdg0nbnfik'

// Récupère la liste depuis SheetDB
const fetchSongs = async () => {
  try {
    console.log('📡 Récupération des chansons...')
    const response = await fetch(SHEETDB_URL)
    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status}`)
    }
    songList.value = await response.json()
    console.log('✅ Chansons récupérées:', songList.value)
    errorMessage.value = ''
  } catch (error) {
    console.error('❌ Erreur lors du chargement:', error)
    errorMessage.value = `Impossible de récupérer les chansons: ${error.message}`
  }
}

// Ajoute une chanson
const addSong = async () => {
  if (!newEntry.value.firstname || !newEntry.value.song) {
    errorMessage.value = 'Veuillez remplir tous les champs'
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    console.log('🎤 Ajout de la chanson...')
    const response = await fetch(SHEETDB_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          firstname: newEntry.value.firstname,
          song: newEntry.value.song
        }
      })
    })
    
    console.log('📊 Réponse:', response.status)
    
    if (response.ok) {
      console.log('✅ Chanson ajoutée avec succès')
      newEntry.value.firstname = ''
      newEntry.value.song = ''
      // Recharge la liste
      await fetchSongs()
    } else {
      const errorData = await response.text()
      throw new Error(errorData || 'Erreur lors de l\'ajout')
    }
  } catch (error) {
    console.error('❌ Erreur:', error)
    errorMessage.value = `Erreur: ${error.message}`
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchSongs()
  // Rafraîchir la liste toutes les 30 secondes
  setInterval(fetchSongs, 30000)
})


const baseUrl = 'https://dev-lab-one.vercel.app/'
const title  = "Karaoké au Berthom";
const description = "Ajoutez vos chansons préférées à la liste !" ;
useSeoMeta({
  title,
  description,
  author: "arthur.brody@bnu.fr",
  ogImage: baseUrl + "karaoke.png",
  ogUrl: baseUrl,
  ogType: "website",
  ogTitle:  "Karaoké - " + title,
  ogDescription: description,
  robots: "index, follow",
  themeColor: "teal",
});
</script>

<style scoped>
.karaoke-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1f3d2e 100%);
    background-image: 
        url('data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Crect fill="%23164e2e" width="100" height="100"/%3E%3Cpath d="M0 50 Q25 30, 50 50 T100 50" stroke="%232d5a3d" stroke-width="2" fill="none" opacity="0.3"/%3E%3Ccircle cx="20" cy="20" r="3" fill="%233a7d4d" opacity="0.5"/%3E%3Ccircle cx="80" cy="80" r="3" fill="%233a7d4d" opacity="0.5"/%3E%3C/svg%3E');
    background-attachment: fixed;
    padding: 40px 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    position: relative;
}

.header-section {
    text-align: center;
    color: white;
    margin-bottom: 40px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

h1 {
    font-size: 3.5rem;
    margin: 0;
    font-weight: 800;
    letter-spacing: 2px;
    animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
    0%, 100% { text-shadow: 2px 2px 4px rgba(0,0,0,0.3), 0 0 10px rgba(74, 222, 128, 0.3); }
    50% { text-shadow: 2px 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(74, 222, 128, 0.6); }
}

.subtitle {
    font-size: 1.5rem;
    color: #4ade80;
    margin: 10px 0 0 0;
    font-weight: 300;
}

.list-section {
    max-width: 900px;
    margin: 0 auto 40px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    border: 2px solid rgba(74, 222, 128, 0.3);
}

.list-section h2 {
    color: #166534;
    margin: 0 0 25px 0;
    font-size: 1.8rem;
    display: flex;
    align-items: center;
    gap: 10px;
}

.count {
    background: linear-gradient(135deg, #22c55e, #4ade80);
    color: white;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: bold;
}

.song-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.song-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px;
    border-left: 5px solid #22c55e;
    background: linear-gradient(90deg, rgba(34, 197, 94, 0.05), transparent);
    margin-bottom: 12px;
    border-radius: 8px;
    transition: all 0.3s ease;
    animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.song-item:hover {
    background: linear-gradient(90deg, rgba(34, 197, 94, 0.1), transparent);
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
}

.song-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 1;
}

.chanson {
    font-weight: bold;
    color: #166534;
    font-size: 1.1rem;
}

.prenom {
    color: #4b5563;
    font-style: italic;
}

.empty-message {
    text-align: center;
    color: #9ca3af;
    font-style: italic;
    padding: 40px 20px;
    font-size: 1.1rem;
}

.form-section {
    max-width: 900px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(10px);
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    border: 2px solid rgba(74, 222, 128, 0.2);
    position: relative;
    overflow: hidden;
}

.form-section h2 {
    color: #166534;
    margin: 0 0 25px 0;
    font-size: 1.5rem;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #166534;
    font-size: 1rem;
}

.form-input {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #d1fae5;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: white;
    color: #1f2937;
}

.form-input:focus {
    outline: none;
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    background: #f0fdf4;
}

.form-input::placeholder {
    color: #9ca3af;
}

.submit-btn {
    width: 100%;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
    padding: 14px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: bold;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.submit-btn:hover {
    background: linear-gradient(135deg, #16a34a, #15803d);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

.submit-btn:active {
    transform: translateY(0);
}

.submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.error-banner {
    max-width: 900px;
    margin: 0 auto 20px;
    background: #fee2e2;
    color: #991b1b;
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid #dc2626;
    font-weight: 500;
}

@media (max-width: 768px) {
    h1 {
        font-size: 2.5rem;
    }
    
    .list-section,
    .form-section {
        padding: 20px;
    }
    
    .song-item {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>