import fs from 'fs'
import path from 'path'
import parksData from '@/data/parks_kasugacho.json'
import { Park } from '@/types/park'
import ParkCard from '@/components/ParkCard'

function getPhotosForPark(parkId: string): string[] {
  const dir = path.join(process.cwd(), 'public', 'uploads', parkId)
  try {
    const files = fs.readdirSync(dir).filter(f =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
    )
    return files.map(f => `/uploads/${parkId}/${f}`)
  } catch {
    return []
  }
}

export default function Home() {
  const parks = parksData as Park[]

  return (
    <div className="min-h-screen bg-green-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-green-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-green-700 leading-none">🌿 iKouen</h1>
            <p className="text-xs text-gray-400 mt-0.5">みんなで育てる公園情報</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5">
        {/* エリア情報 */}
        <div className="flex items-center gap-2 mb-5">
          <span className="bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full">
            📍 練馬区 春日町エリア
          </span>
          <span className="text-sm text-gray-500">{parks.length}件の公園</span>
        </div>

        {/* 公園カード一覧 */}
        <div className="flex flex-col gap-4">
          {parks.map(park => (
            <ParkCard
              key={park.id}
              park={park}
              initialPhotos={getPhotosForPark(park.id)}
            />
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8 mb-4">
          公園の情報・写真を投稿して、地域の育児を応援しよう
        </p>
      </main>
    </div>
  )
}
