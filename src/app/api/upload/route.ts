import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const parkId = formData.get('parkId') as string | null

    if (!file || !parkId) {
      return NextResponse.json({ error: 'file と parkId が必要です' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '画像ファイルのみアップロードできます' }, { status: 400 })
    }

    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: '画像は5MB以下にしてください' }, { status: 400 })
    }

    // パストラバーサル対策
    const safeParkId = parkId.replace(/[^a-zA-Z0-9_-]/g, '')
    if (!safeParkId) {
      return NextResponse.json({ error: '無効な parkId です' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', safeParkId)
    await mkdir(uploadsDir, { recursive: true })

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${Date.now()}.${ext}`
    await writeFile(path.join(uploadsDir, filename), buffer)

    return NextResponse.json({ url: `/uploads/${safeParkId}/${filename}` })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'アップロードに失敗しました' }, { status: 500 })
  }
}
