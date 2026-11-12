export interface Item {
  id: string
  collection_id: string
  title: string
  description: string
  image_url: string | null
  created_at: string
}

export const useItems = () => {
  const supabase = useSupabaseClient() as any
  const items = ref<Item[]>([])

  const fetchItems = async (collectionId: string) => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('collection_id', collectionId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Ошибка загрузки предметов:', error.message)
      return
    }
    items.value = data || []
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

  const addItem = async (collectionId: string, data: { title: string; description: string; imageFile: File | null }) => {
    let imageUrl = null

    if (data.imageFile) {
      imageUrl = await uploadImage(data.imageFile)
      if (!imageUrl) return null
    }

    const { data: inserted, error } = await supabase
      .from('items')
      .insert([
        {
          collection_id: collectionId,
          title: data.title,
          description: data.description,
          image_url: imageUrl,
        },
      ] as any)
      .select()
      .single()

    if (error) {
      console.error('Ошибка вставки предмета:', error.message)
      return null
    }

    await fetchItems(collectionId)
    return inserted
  }

  const updateItem = async (id: string, collectionId: string, data: { title: string; description: string; imageFile: File | null, currentImageUrl: string | null }) => {
    let imageUrl = data.currentImageUrl

    if (data.imageFile) {
      const newImageUrl = await uploadImage(data.imageFile)
      if (!newImageUrl) return null
      imageUrl = newImageUrl
    }

    const { error } = await supabase
      .from('items')
      .update({
        title: data.title,
        description: data.description,
        image_url: imageUrl,
      } as any)
      .eq('id', id)

    if (error) {
      console.error('Ошибка обновления предмета:', error.message)
      return null
    }

    await fetchItems(collectionId)
    return true
  }

  const deleteItem = async (id: string, collectionId: string) => {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Ошибка удаления предмета:', error.message)
      return false
    }

    await fetchItems(collectionId)
    return true
  }

  return {
    items,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
  }
}