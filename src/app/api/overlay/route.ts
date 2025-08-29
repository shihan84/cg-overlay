import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')
    
    let overlays
    if (clientId) {
      overlays = await db.overlay.findMany({
        where: { clientId },
        include: {
          client: true,
          template: true
        }
      })
    } else {
      overlays = await db.overlay.findMany({
        include: {
          client: true,
          template: true
        }
      })
    }

    return NextResponse.json(overlays)
  } catch (error) {
    console.error('Error fetching overlays:', error)
    return NextResponse.json(
      { error: 'Failed to fetch overlays' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, templateId, name, data, position, size, zIndex, animation } = body

    // Validate required fields
    if (!clientId || !templateId || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: clientId, templateId, name' },
        { status: 400 }
      )
    }

    // Check if client exists
    const client = await db.client.findUnique({
      where: { id: clientId }
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    // Check if template exists
    const template = await db.template.findUnique({
      where: { id: templateId }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Create overlay
    const overlay = await db.overlay.create({
      data: {
        clientId,
        templateId,
        name,
        data: data || {},
        position: position || { x: 0, y: 0 },
        size: size || { width: 800, height: 200 },
        zIndex: zIndex || 1,
        animation: animation || { enter: 'slideInUp', exit: 'slideOutDown', duration: '0.5s' }
      },
      include: {
        client: true,
        template: true
      }
    })

    return NextResponse.json(overlay, { status: 201 })
  } catch (error) {
    console.error('Error creating overlay:', error)
    return NextResponse.json(
      { error: 'Failed to create overlay' },
      { status: 500 }
    )
  }
}