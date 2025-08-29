import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    
    let whereClause = {}
    if (type) {
      whereClause = { ...whereClause, type }
    }
    if (category) {
      whereClause = { ...whereClause, category }
    }

    const templates = await db.template.findMany({
      where: whereClause,
      include: {
        fields: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, type, category, htmlContent, cssContent, config, fields } = body

    // Validate required fields
    if (!name || !type || !category || !htmlContent) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, category, htmlContent' },
        { status: 400 }
      )
    }

    // Create template with fields
    const template = await db.template.create({
      data: {
        name,
        description,
        type,
        category,
        htmlContent,
        cssContent,
        config: config || {},
        isSystem: false,
        isActive: true,
        fields: fields ? {
          create: fields.map((field: any, index: number) => ({
            name: field.name,
            label: field.label,
            type: field.type,
            required: field.required || false,
            defaultValue: field.defaultValue,
            options: field.options,
            validation: field.validation,
            order: index
          }))
        } : undefined
      },
      include: {
        fields: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}