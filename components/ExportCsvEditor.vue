<template>
    <Teleport to="body">
        <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/70" @click="isOpen = false"></div>

            <div class="relative z-[101] flex max-h-[92vh] w-full max-w-[96vw] flex-col overflow-hidden rounded-2xl border border-slate-500/20 bg-slate-950 text-white shadow-2xl">
                <div class="flex flex-col gap-3 border-b border-slate-500/20 p-4 md:flex-row md:items-center md:justify-between w-min">
                    <div>
                        <h2 class="text-2xl font-semibold">Édition avant export CSV</h2>
                        <p class="text-sm text-gray-400">
                            Modification des champs à la main avant de télécharger le fichier.
                        </p>
                    </div>

                    <div class="flex items-center gap-2">
                        <UBadge color="primary" variant="soft" size="md">
                            {{ draftRows.length }} ligne(s)
                        </UBadge>
                        <UButton color="gray" variant="soft" icon="i-lucide-x" @click="isOpen = false">
                            Fermer
                        </UButton>
                    </div>
                </div>

                <div class="overflow-hidden flex-1 flex flex-col gap-3 min-h-0">
                    <div class="flex-1 min-h-0 p-4 overflow-hidden flex flex-col">
                        <div class="overflow-x-scroll w-[90vw] overflow-y-auto rounded-xl border border-slate-500/20 bg-slate-950/40">
                            <table class="min-w-[2400px] border-collapse text-sm">
                            <thead class="sticky top-0 z-10 bg-slate-950/95 backdrop-blur border-b border-slate-500/20">
                                <tr>
                                    <th v-for="field in fields" :key="field.key" class="px-3 py-3 text-left font-medium text-gray-300 whitespace-nowrap">
                                        {{ field.label }}
                                    </th>
                                    <th class="px-3 py-3 text-left font-medium text-gray-300 whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="(row, rowIndex) in draftRows" :key="row.key || rowIndex" class="border-t border-slate-500/20 align-top hover:bg-slate-500/5">
                                    <td v-for="field in fields" :key="field.key" class="px-3 py-3 align-top">
                                        <div v-if="field.type === 'textarea'" class="bg-slate-900 rounded border border-slate-600 focus-within:border-primary-500">
                                            <textarea
                                                :value="getFieldValue(row, field.key)"
                                                :rows="field.rows || 2"
                                                class="w-72 px-3 py-2 bg-slate-900 text-white border-0 rounded outline-none focus:ring-0"
                                                @input="e => updateField(rowIndex, field.key, e.target.value)"
                                            ></textarea>
                                        </div>
                                        <USelect
                                            v-else-if="field.options"
                                            :model-value="getFieldValue(row, field.key)"
                                            :options="field.options"
                                            class="w-44"
                                            @update:model-value="value => updateField(rowIndex, field.key, value)"
                                        />
                                        <div v-else class="bg-slate-900 rounded border border-slate-600 focus-within:border-primary-500">
                                            <input
                                                :value="getFieldValue(row, field.key)"
                                                :type="field.type || 'text'"
                                                class="w-44 px-3 py-2 bg-slate-900 text-white border-0 rounded outline-none focus:ring-0"
                                                @input="e => updateField(rowIndex, field.key, e.target.value)"
                                            />
                                        </div>
                                    </td>

                                    <td class="px-3 py-3 align-top">
                                        <UButton color="red" variant="soft" icon="i-lucide-trash-2" @click="removeRow(rowIndex)">
                                            Supprimer
                                        </UButton>
                                    </td>
                                </tr>

                                <tr v-if="!draftRows.length">
                                    <td :colspan="fields.length + 1" class="px-3 py-8 text-center text-gray-400">
                                        Aucune ligne à éditer.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>

                    <p class="px-4 text-xs text-gray-500">
                        Les modifications sont appliquées immédiatement à la liste exportée.
                    </p>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
const props = defineProps({
    open: {
        type: Boolean,
        default: false
    },
    rows: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['update:open', 'update:rows'])

const fields = [
    { key: 'title', label: 'Titre' },
    { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
    { key: 'language', label: 'Langue' },
    { key: 'dateStart', label: 'Date début' },
    { key: 'startDateDisplay', label: 'Affichage date début' },
    { key: 'dateEnd', label: 'Date fin' },
    { key: 'endDateDisplay', label: 'Affichage date fin' },
    { key: 'ongoingEvent', label: 'Événement en cours' },
    { key: 'locationName', label: 'Nom du lieu' },
    { key: 'nominatimRef', label: 'Référence Nominatim' },
    { key: 'latitude', label: 'Latitude', type: 'number' },
    { key: 'longitude', label: 'Longitude', type: 'number' },
    { key: 'real', label: 'Réel' },
    { key: 'public', label: 'Public' },
    { key: 'origin', label: 'Provenance' },
    { key: 'source', label: 'Sources' },
    { key: 'externalId', label: 'Identifiant Bdd externe' },
    { key: 'disciplines', label: 'Discipline' },
    { key: 'type', label: 'Type' },
    { key: 'keywords', label: 'Mots-clefs' }
]

const isOpen = computed({
    get: () => props.open,
    set: value => emit('update:open', value)
})

watch(
    () => props.open,
    value => {
        console.log('[ExportCsvEditor] prop open changed', value)
    },
    { immediate: true }
)

watch(isOpen, value => {
    console.log('[ExportCsvEditor] isOpen changed', value)
})

const draftRows = ref([])

function cloneRows(rows) {
    return (rows || []).map(row => ({
        ...row,
        csv: { ...(row.csv || {}) }
    }))
}

watch(
    () => props.rows,
    rows => {
        console.log('[ExportCsvEditor] rows received', rows?.length || 0)
        draftRows.value = cloneRows(rows)
    },
    { immediate: true, deep: true }
)

function emitRows(nextRows) {
    draftRows.value = nextRows
    emit('update:rows', nextRows)
}

function getFieldValue(row, fieldKey) {
    return row.csv?.[fieldKey] ?? ''
}

function updateField(rowIndex, fieldKey, value) {
    const nextRows = cloneRows(draftRows.value)
    nextRows[rowIndex].csv[fieldKey] = value
    emitRows(nextRows)
}

function removeRow(rowIndex) {
    emitRows(draftRows.value.filter((_, index) => index !== rowIndex))
}
</script>