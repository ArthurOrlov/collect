// composables/useCollections.ts
export interface Collection {
  id: string
  title: string
  description: string
  image: string | null
  createdAt: number
}

export const useCollections = () => {
  const collections = useState<Collection[]>('collections', () => [])

  const loadFromStorage = () => {
    if (import.meta.client) {
      const raw = localStorage.getItem('collections')
      if (raw) {
        try {
          collections.value = JSON.parse(raw)
        } catch (e) {
          console.error('Failed to parse collections', e)
        }
      }
    }
  }

  const saveToStorage = () => {
    if (import.meta.client) {
      localStorage.setItem('collections', JSON.stringify(collections.value))
    }
  }

  const addCollection = (data: Omit<Collection, 'id' | 'createdAt'>) => {
    const collection: Collection = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      ...data,
    }
    collections.value.push(collection)
    saveToStorage()
    return collection
  }

  const getById = (id: string) => 
    collections.value.find(c => c.id === id)

  return {
    collections,
    loadFromStorage,
    addCollection,
    getById,
  }
}