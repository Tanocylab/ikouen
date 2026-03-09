'use client'

import { useState, useRef } from 'react'
import { Park } from '@/types/park'

interface ParkCardProps {
  park: Park
  initialPhotos: string[]
}

export default function ParkCard({ park, initialPhotos }: ParkCardProps) {
  const [photos, setPhotos] = useState<string[]>(initialPhotos)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('parkId', park.id)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'アップロードに失敗しました')
      } else {
        setPhotos(prev => [...prev, data.url])
      }
    } catch {
      setError('通信エラーが発生しました')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const features = [
    { emoji: '🚻', label: 'トイレ', active: park.toilet },
    { emoji: '🌳', label: '日陰', active: park.shade },
    { emoji: '🍼', label: 'ベビーカー', active: park.stroller },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 写真エリア */}
      {photos.length > 0 ? (
        <div className="flex gap-1.5 overflow-x-auto p-2 bg-gray-50">
          {photos.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt={`${park.name} 写真${i + 1}`}
              className="h-36 w-48 object-cover rounded-xl flex-shrink-0"
            />
          ))}
        </div>
      ) : (
        <div className="h-24 bg-green-50 flex items-center justify-center text-4xl">
          🌿
        </div>
      )}

      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800">{park.name}</h2>
        <p className="text-xs text-gray-400 mt-0.5">📍 {park.address}</p>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{park.description}</p>

        {/* 遊具タグ */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {park.equipment.map(item => (
            <span
              key={item}
              className="text-xs bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full font-medium"
            >
              {item}
            </span>
          ))}
        </div>

        {/* 設備バッジ */}
        <div className="flex gap-4 mt-3">
          {features.map(f => (
            <span
              key={f.label}
              className={`text-xs flex items-center gap-1 ${
                f.active ? 'text-green-600 font-medium' : 'text-gray-300'
              }`}
            >
              <span>{f.emoji}</span>
              <span className={f.active ? '' : 'line-through'}>{f.label}</span>
            </span>
          ))}
        </div>

        {/* エラー表示 */}
        {error && (
          <p className="mt-2 text-xs text-red-500">{error}</p>
        )}

        {/* アップロードボタン */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="mt-4 w-full py-2.5 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 active:bg-green-200 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-3.5 h-3.5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              アップロード中...
            </span>
          ) : (
            '📷 写真を追加する'
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>
    </div>
  )
}
