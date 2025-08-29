import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const overlay = await db.overlay.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        template: true
      }
    })

    if (!overlay) {
      return NextResponse.json(
        { error: 'Overlay not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(overlay)
  } catch (error) {
    console.error('Error fetching overlay:', error)
    return NextResponse.json(
      { error: 'Failed to fetch overlay' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, data, isActive, isVisible, position, size, zIndex, animation } = body

    const overlay = await db.overlay.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(data !== undefined && { data }),
        ...(isActive !== undefined && { isActive }),
        ...(isVisible !== undefined && { isVisible }),
        ...(position && { position }),
        ...(size && { size }),
        ...(zIndex !== undefined && { zIndex }),
        ...(animation && { animation })
      },
      include: {
        client: true,
        template: true
      }
    })

    return NextResponse.json(overlay)
  } catch (error) {
    console.error('Error updating overlay:', error)
    return NextResponse.json(
      { error: 'Failed to update overlay' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.overlay.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Overlay deleted successfully' })
  } catch (error) {
    console.error('Error deleting overlay:', error)
    return NextResponse.json(
      { error: 'Failed to delete overlay' },
      { status: 500 }
    )
  }
}