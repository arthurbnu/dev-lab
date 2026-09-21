import { createError, readBody } from 'h3'
import { getSupabase } from '../../utils/supabase'

type SongInput = {
  firstname?: string
  song?: string
}

export default defineEventHandler(async (event) => {
  let supabase

  try {
    supabase = getSupabase()
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Supabase non configuré',
    })
  }

  if (event.method === 'GET') {
    const { data, error } = await supabase
      .from('songs')
      .select('id, firstname, song, created_at')
      .order('created_at', { ascending: true })

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return data
  }

  if (event.method === 'POST') {
    const body = await readBody<SongInput>(event)
    const firstname = body.firstname?.trim()
    const song = body.song?.trim()

    if (!firstname || !song) {
      throw createError({ statusCode: 400, statusMessage: 'Prénom et chanson requis' })
    }

    const { data, error } = await supabase
      .from('songs')
      .insert({ firstname, song })
      .select('id, firstname, song, created_at')
      .single()

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return data
  }

  throw createError({ statusCode: 405, statusMessage: 'Méthode non autorisée' })
})