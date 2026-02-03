const API_BASE = import.meta.env.VITE_API_URL || ''

// デモ用のテナントID（実際はログイン時に設定）
const TENANT_ID = 'demo-tenant-id'

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'X-Tenant-ID': TENANT_ID,
            ...options.headers,
        },
    })

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
}

// Dashboard
export async function fetchDashboardStats() {
    return fetchWithAuth('/api/dashboard/stats')
}

export async function fetchDashboardTrends(days = 30) {
    return fetchWithAuth(`/api/dashboard/trends?days=${days}`)
}

export async function fetchDashboardAnalysis() {
    // モックデータ: 予約ソース分析、ジャンル別返信率
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                reservations: {
                    web: 124,
                    tel: 45,
                    line_rich_menu: 89
                },
                genre_performance: [
                    { genre: '花粉症', sent: 450, reply_rate: 12.5 },
                    { genre: '生活習慣病', sent: 120, reply_rate: 4.2 },
                    { genre: 'ワクチン', sent: 300, reply_rate: 18.9 },
                    { genre: '定期検診', sent: 80, reply_rate: 8.5 },
                ]
            })
        }, 500)
    })
}

// Patients
export async function fetchPatients(params: {
    page?: number
    per_page?: number
    search?: string
    status?: string
} = {}) {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', String(params.page))
    if (params.per_page) searchParams.set('per_page', String(params.per_page))
    if (params.search) searchParams.set('search', params.search)
    if (params.status) searchParams.set('status', params.status)

    return fetchWithAuth(`/api/patients/?${searchParams}`)
}

export async function registerVisit(patientId: string) {
    return fetchWithAuth('/api/visits/', {
        method: 'POST',
        body: JSON.stringify({ patient_id: patientId }),
    })
}

export async function registerVisitsBulk(patientIds: string[]) {
    return fetchWithAuth('/api/visits/bulk', {
        method: 'POST',
        body: JSON.stringify({ patient_ids: patientIds }),
    })
}

// Templates
export async function fetchTemplates(type?: string) {
    const url = type ? `/api/templates/?type=${type}` : '/api/templates/'
    return fetchWithAuth(url)
}

export async function createTemplate(data: {
    type: string
    name: string
    content: string
}) {
    return fetchWithAuth('/api/templates/', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export async function updateTemplate(id: string, data: Partial<{
    name: string
    content: string
    is_active: boolean
}>) {
    return fetchWithAuth(`/api/templates/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
}

export async function createDefaultTemplates() {
    return fetchWithAuth('/api/templates/defaults', {
        method: 'POST',
    })
}

// Rich Menus
export async function fetchRichMenuTemplates() {
    return fetchWithAuth('/api/rich-menus/templates')
}

export async function fetchRichMenus() {
    return fetchWithAuth('/api/rich-menus/')
}

export async function createRichMenu(data: {
    template_type: string
    button_config: Record<string, string>
}) {
    return fetchWithAuth('/api/rich-menus/', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export async function activateRichMenu(menuId: string) {
    return fetchWithAuth(`/api/rich-menus/${menuId}/activate`, {
        method: 'POST',
    })
}

// Billing
export async function createCheckoutSession() {
    return fetchWithAuth('/api/billing/create-checkout', {
        method: 'POST',
        body: JSON.stringify({
            success_url: `${window.location.origin}/settings?success=true`,
            cancel_url: `${window.location.origin}/settings?canceled=true`,
        }),
    })
}

export async function createPortalSession() {
    return fetchWithAuth('/api/billing/portal', {
        method: 'POST',
        body: JSON.stringify({
            return_url: `${window.location.origin}/settings`,
        }),
    })
}
