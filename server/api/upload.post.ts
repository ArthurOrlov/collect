import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No file provided' })
  }

  const filePart = formData.find((part) => part.name === 'file')
  if (!filePart || !filePart.data) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid file data' })
  }

  const fileExt = filePart.filename?.split('.').pop() || 'jpg'
  const fileName = `${crypto.randomUUID()}.${fileExt}`

  const client = await serverSupabaseClient(event)
  const { error } = await client.storage
    .from('collection-images')
    .upload(fileName, filePart.data, {
      contentType: filePart.type,
      upsert: false,
    })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  const { data: publicUrlData } = client.storage
    .from('collection-images')
    .getPublicUrl(fileName)

  return { publicUrl: publicUrlData.publicUrl }
})