export interface Collection {
  id: string
  title: string
  description: string
  image_url: string | null
  created_at: string
}

export const useCollections = () => {
  const supabase = useSupabaseClient() as any
  const collections = ref<Collection[]>([])

  const fetchCollections = async () => {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Ошибка загрузки:', error.message)
      return
    }
    collections.value = data || []
  }

  const fetchCollectionById = async (id: string): Promise<Collection | null> => {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Ошибка загрузки коллекции:', error.message)
      return null
    }
    return data
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await $fetch<{ publicUrl: string }>('/api/upload', {
        method: 'POST',
        body: formData,
      })

      return response.publicUrl
    } catch (err: any) {
      console.error('Ошибка загрузки фото:', err.data?.statusMessage || err.message)
      return null
    }
  }

  const addCollection = async (data: { title: string; description: string; imageFile: File | null }) => {
    let imageUrl = null

    if (data.imageFile) {
      imageUrl = await uploadImage(data.imageFile)
      if (!imageUrl) return null
    }

    const { data: inserted, error } = await supabase
      .from('collections')
      .insert([
        {
          title: data.title,
          description: data.description,
          image_url: imageUrl,
        },
      ] as any)
      .select()
      .single()

    if (error) {
      console.error('Ошибка вставки:', error.message)
      return null
    }

    await fetchCollections()
    return inserted
  }

  return {
    collections,
    fetchCollections,
    fetchCollectionById,
    addCollection,
  }
}