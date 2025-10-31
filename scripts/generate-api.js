#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

async function generateApiTypes() {
  try {
    // Fetch OpenAPI spec
    const response = await fetch('http://localhost:8000/openapi.json')
    const spec = await response.json()
    
    // Save spec locally
    fs.writeFileSync(
      path.join(__dirname, '../openapi.json'), 
      JSON.stringify(spec, null, 2)
    )
    
    console.log('✅ OpenAPI spec downloaded and saved')
    
    // Generate TypeScript types
    await generateTypes(spec)
    
  } catch (error) {
    console.error('❌ Failed to generate API types:', error.message)
    process.exit(1)
  }
}

async function generateTypes(spec) {
  const types = []
  const apiMethods = []
  
  // Generate types from schemas
  if (spec.components?.schemas) {
    for (const [name, schema] of Object.entries(spec.components.schemas)) {
      types.push(generateTypeFromSchema(name, schema))
    }
  }
  
  // Generate API methods from paths
  for (const [path, methods] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      if (typeof operation === 'object' && operation.operationId) {
        apiMethods.push(generateApiMethod(path, method, operation))
      }
    }
  }
  
  // Write generated types
  const typesContent = `// Auto-generated from OpenAPI spec
${types.join('\n\n')}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: any
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    current_page: number
    total_pages: number
    total_items: number
    per_page: number
    has_next: boolean
    has_prev: boolean
  }
}
`
  
  fs.writeFileSync(
    path.join(__dirname, '../types/generated-api.ts'),
    typesContent
  )
  
  // Write API client
  const clientContent = `// Auto-generated API client
import type { ApiResponse, PaginatedResponse } from './generated-api'

export class ApiClient {
  private baseURL: string
  private token: string | null = null
  
  constructor(baseURL: string = 'http://localhost:8000') {
    this.baseURL = baseURL
  }
  
  setToken(token: string) {
    this.token = token
  }
  
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = \`\${this.baseURL}\${endpoint}\`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    }
    
    if (this.token) {
      headers.Authorization = \`Bearer \${this.token}\`
    }
    
    const response = await fetch(url, {
      ...options,
      headers
    })
    
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`)
    }
    
    return response.json()
  }
  
${apiMethods.join('\n\n')}
}
`
  
  fs.writeFileSync(
    path.join(__dirname, '../composables/useApiClient.ts'),
    clientContent
  )
  
  console.log('✅ TypeScript types and API client generated')
}

function generateTypeFromSchema(name, schema) {
  if (schema.type === 'object' && schema.properties) {
    const props = Object.entries(schema.properties)
      .map(([key, prop]) => {
        const optional = !schema.required?.includes(key) ? '?' : ''
        const type = getTypeScriptType(prop)
        return `  ${key}${optional}: ${type}`
      })
      .join('\n')
    
    return `export interface ${name} {\n${props}\n}`
  }
  
  return `export type ${name} = ${getTypeScriptType(schema)}`
}

function getTypeScriptType(schema) {
  if (schema.type === 'string') {
    if (schema.format === 'uuid') return 'string'
    if (schema.format === 'date') return 'string'
    if (schema.format === 'date-time') return 'string'
    if (schema.enum) return schema.enum.map(v => `'${v}'`).join(' | ')
    return 'string'
  }
  
  if (schema.type === 'number' || schema.type === 'integer') return 'number'
  if (schema.type === 'boolean') return 'boolean'
  if (schema.type === 'array') return `${getTypeScriptType(schema.items)}[]`
  
  if (schema.anyOf) {
    return schema.anyOf.map(s => getTypeScriptType(s)).join(' | ')
  }
  
  if (schema.$ref) {
    return schema.$ref.split('/').pop()
  }
  
  return 'any'
}

function generateApiMethod(path, method, operation) {
  const methodName = operation.operationId.replace(/([A-Z])/g, '_$1').toLowerCase()
  const params = []
  const queryParams = []
  const pathParams = []
  
  // Extract parameters
  if (operation.parameters) {
    operation.parameters.forEach(param => {
      if (param.in === 'path') {
        pathParams.push(param.name)
        params.push(`${param.name}: string`)
      } else if (param.in === 'query') {
        const optional = param.required ? '' : '?'
        queryParams.push(param.name)
        params.push(`${param.name}${optional}: ${getTypeScriptType(param.schema)}`)
      }
    })
  }
  
  // Handle request body
  if (operation.requestBody) {
    params.push('data: any')
  }
  
  const paramString = params.length > 0 ? params.join(', ') : ''
  const returnType = getResponseType(operation.responses)
  
  let urlConstruction = `'${path}'`
  pathParams.forEach(param => {
    urlConstruction = urlConstruction.replace(`{${param}}`, `\${${param}}`)
  })
  
  if (queryParams.length > 0) {
    const queryString = queryParams
      .map(param => `\${${param} !== undefined ? '${param}=' + encodeURIComponent(${param}) + '&' : ''}`)
      .join('')
    urlConstruction += ` + '?' + ${queryString}.slice(0, -1)`
  }
  
  const methodCall = method.toUpperCase()
  const bodyParam = operation.requestBody ? ', body: JSON.stringify(data)' : ''
  
  return `  async ${methodName}(${paramString}): Promise<${returnType}> {
    return this.request<${returnType.replace('ApiResponse<', '').replace('>', '')}>(
      \`${urlConstruction}\`,
      { method: '${methodCall}'${bodyParam} }
    )
  }`
}

function getResponseType(responses) {
  const successResponse = responses['200'] || responses['201']
  if (successResponse?.content?.['application/json']?.schema) {
    const schema = successResponse.content['application/json'].schema
    if (schema.$ref) {
      return schema.$ref.split('/').pop()
    }
    return 'ApiResponse<any>'
  }
  return 'ApiResponse<any>'
}

// Run the generator
generateApiTypes()
