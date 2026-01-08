<template>
    <div class="karaoke-container">
        <!-- Flocons de neige -->
        <div class="snowflakes" aria-hidden="true">
            <div class="snowflake" v-for="i in 30" :key="i" :style="{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 10}s`, animationDuration: `${8 + Math.random() * 12}s` }">❄</div>
        </div>
        
        <div class="header-section">
            <h1>
                <span class="mic-animated">🎤</span> Karaoké au Berthom
            </h1>
            <p class="subtitle">
                Le 12/01 avec Ambroise
                <UIcon dynamic name="i-lucide-piano" size="32" />
            </p>
            <!-- <p>
                <button title = "Actualiser la liste" @click="fetchSongs" class="underline text-green-200 hover:text-white mt-2 opacity-60">
                    <UIcon dynamic name="i-lucide-refresh-cw" size="20" class="inline-block mr-2 animate-spin-slow"/>
                    Actualiser la liste
                </button>
                </p> -->
        </div>

        <!-- Message d'erreur -->
        <div v-if="errorMessage" class="error-banner">
            ⚠️ {{ errorMessage }}
        </div>

        <div class="list-section piano-section"> 
            <div class="list-header">
                <h2 class="text-xl sm:text-2xl">🎵 Liste des souhaits</h2>
                <button 
                    @click="fetchSongs" 
                    :disabled="isLoading"
                    class="refresh-btn"
                    title="Actualiser la liste"
                >
                    <UIcon dynamic name="i-lucide-refresh-cw" size="20" :class="{ 'animate-spin': isLoading }"/>
                </button>
            </div>
            <div v-if="songList.length > 0" class="piano-keyboard">
                <template v-for="(entry, index) in songList" :key="`${entry.id}-${index}`">
                    <div :class="['piano-key', 'white-key']" @click="playNote(index, false)">
                        <div class="key-content">
                            <span class="prenom">{{ entry.firstname }}</span>
                            <span class="chanson">{{ entry.song }}</span>
                        </div>
                    </div>
                    <div v-if="(index + 1) % 3 === 0" :key="`black-${index}`" class="piano-key black-key" @click="playNote(index, true)"></div>
                </template>
            </div>
            <p v-else class="empty-message flex items-center justify-center gap-2">
                Chargement de la liste ... <UIcon dynamic name="i-lucide-music-2" class="text-gray-400" size="24" />
            </p>
        </div>

        <div class="form-section">
            <h2 class="text-xl sm:text-2xl">➕ Ajouter une chanson</h2>
            <form @submit.prevent="addSong">
                <div class="form-group">
                    <label for="prenom" class="text-sm sm:text-base">Votre prénom :</label>
                    <input 
                        ref="prenomInput"
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
                    <label for="chanson" class="text-sm sm:text-base">Chanson :</label>
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
                
                <button type="submit" class="submit-btn text-sm sm:text-base" :disabled="isLoading">
                    {{ isLoading ? '⏳ Envoi...' : '🎤 Ajouter à la liste' }}
                </button>
            </form>
        </div>

        <!-- Bouton flottant arrondi -->
        <button @click="scrollToForm" class="floating-btn">
             <UIcon dynamic name="i-lucide-plus" size="32" class="plus-icon"/>
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const newEntry = ref({
    firstname: '',
    song: ''
})

const prenomInput = ref(null)
const songList = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const API_URL = 'https://api.sheetbest.com/sheets/2ac1731d-a6df-4152-b8c4-6444591a86a1'
const audioCtx = ref<AudioContext | null>(null)

// Scroll vers le formulaire et focus
const scrollToForm = () => {
  prenomInput.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  setTimeout(() => prenomInput.value?.focus(), 500)
}

const ensureAudioContext = async () => {
    if (audioCtx.value) return audioCtx.value
    const ctx = new AudioContext()
    await ctx.resume()
    audioCtx.value = ctx
    return ctx
}

const playNote = async (index: number, isBlack: boolean) => {
    const ctx = await ensureAudioContext()
    const baseFreq = 261.63 // C4
    const offset = isBlack ? 1 : 0
    const semitone = ((index + offset) % 12)
    const freq = baseFreq * Math.pow(2, semitone / 12)

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = isBlack ? 'square' : 'sine'
    osc.frequency.value = freq

    const now = ctx.currentTime
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.18, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.4)
}

// Récupère la liste depuis SheetDB
const fetchSongs = async () => {
  try {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error(`Erreur serveur: ${res.status}`)
    songList.value = await res.json()
    errorMessage.value = ''
  } catch (e: any) {
    errorMessage.value = `Impossible de récupérer les chansons: ${e.message}`
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
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry.value)
    })
    if (!res.ok) throw new Error(`Erreur serveur: ${res.status}`)
    newEntry.value.firstname = ''
    newEntry.value.song = ''
    
    // Attendre un peu que SheetDB mette à jour
    await new Promise(resolve => setTimeout(resolve, 1000))
    await fetchSongs()
  } catch (e: any) {
    errorMessage.value = `Erreur: ${e.message}`
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchSongs()
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
    padding: 20px 16px;
    border-radius: 16px;
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
}

.mic-animated {
    display: inline-block;
    animation: micPulse 1.2s ease-in-out infinite, micBounce 0.9s ease-in-out infinite;
    margin-bottom: 4px;
    margin-top: 4px;
    vertical-align: middle;
}

@keyframes micPulse {
    0%, 100% { 
        text-shadow: 0 0 0 rgba(74, 222, 128, 0.5);
        transform: scale(1);
    }
    50% { 
        text-shadow: 0 0 12px rgba(74, 222, 128, 0.6), 0 0 24px rgba(74, 222, 128, 0.3);
        transform: scale(1.08);
    }
}

@keyframes micBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
}

@media (max-width: 768px) {
    .karaoke-container { padding: 16px 14px; }
    h1 { font-size: 2.4rem; line-height: 1.12; }
}

.subtitle {
    font-size: 1.5rem;
    color: #4ade80;
    margin: 10px 0 0 0;
    font-weight: 300;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
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

.list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
}

.refresh-btn {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.refresh-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #16a34a, #15803d);
    transform: scale(1.1);
}

.refresh-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.list-section h2 {
    color: #166534;
    margin: 0;
    /* font-size: 1.8rem; */
}

.list-section.animate-pulse {
    opacity: 0.8;
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

/* Styles du clavier de piano */
.piano-section {
    background: linear-gradient(135deg, #f5f5f5, #e8e8e8);
    padding: 40px 20px;
    border: 2px solid #111;
    border-radius: 12px;
}

.piano-keyboard {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 20px 0;
    position: relative;
}

.piano-key {
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;
    animation: slideIn 0.4s ease-out;
    min-height: 70px;
    display: flex;
    align-items: center;
}

.white-key {
    background: linear-gradient(145deg, #ffffff, #f9f9f9);
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(0, 0, 0, 0.05);
    padding: 0 20px;
    position: relative;
    z-index: 1;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
}

.white-key:hover {
    background: linear-gradient(145deg, #f5f5f5, #efefef);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(0, 0, 0, 0.05), 
                0 4px 12px rgba(34, 197, 94, 0.2);
}

.white-key:active {
    background: linear-gradient(145deg, #efefef, #e8e8e8);
}

.black-key {
    background: linear-gradient(145deg, #0f3b29, #0a2a1f);
    border-top: 2px solid #145a3a;
    border-bottom: 2px solid #0e3d2c;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    height: 42px;
    min-height: 0;
    padding: 0;
    width: 72%;
    margin-left: auto;
    margin-right: 0;
    margin-top: -12px;
    margin-bottom: -12px;
    position: relative;
    z-index: 10;
    align-self: flex-start;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
}

.key-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 15px;
}

.white-key .prenom {
    color: #666;
    font-size: 0.95rem;
    font-weight: 500;
    min-width: 100px;
}

.white-key .chanson {
    color: #1a1a1a;
    font-size: 1.05rem;
    font-weight: bold;
    flex: 1;
}

@media (max-width: 768px) {
    .piano-key {
        min-height: 60px;
    }
    
    .key-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
    }
    
    .white-key .prenom,
    .white-key .chanson {
        font-size: 0.9rem;
    }
}

.piano-section h2 {
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
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
    /* font-size: 1.5rem; */
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

/* Bouton flottant */
.floating-btn {
    position: fixed;
    bottom: 40px;
    right: 30px;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    border: none;
    color: white;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(34, 197, 94, 0.4);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    animation: floatBtn 2s ease-in-out infinite;
    padding: 0;
}

.plus-icon {
    font-weight: bold;
    font-size: 48px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    margin: 0;
}

@keyframes floatBtn {
    0%, 100% { 
        transform: translateY(0);
        box-shadow: 0 8px 24px rgba(34, 197, 94, 0.4);
    }
    50% { 
        transform: translateY(-12px);
        box-shadow: 0 12px 32px rgba(34, 197, 94, 0.6);
    }
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

    .floating-btn {
        bottom: 30px;
        right: 20px;
        width: 60px;
        height: 60px;
    }
    
    .plus-icon {
        font-size: 36px;
        width: 36px;
        height: 36px;
    }
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

/* Garder les tailles de base pour desktop, Tailwind gérera le responsive */
.list-section h2 {
    color: #166534;
    margin: 0;
}

label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #166534;
}

/* Animation des flocons de neige */
.snowflakes {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1000;
    overflow: hidden;
}

.snowflake {
    position: absolute;
    top: -10%;
    color: white;
    font-size: 1.5em;
    opacity: 0.8;
    animation: fall linear infinite;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
}

@keyframes fall {
    0% {
        transform: translateY(-10vh) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(110vh) rotate(360deg);
        opacity: 0.3;
    }
}
</style>