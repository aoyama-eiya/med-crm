import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchTemplates, createTemplate, updateTemplate, createDefaultTemplates } from '../lib/api'

interface Template {
    id: string
    type: string
    name: string
    content: string
    is_active: boolean
}

const templateTypes = [
    { value: 'welcome', label: 'ウェルカム', icon: '👋', description: '友だち追加時に送信' },
    { value: 'aftercare', label: 'アフターフォロー', icon: '💊', description: '来院24時間後に送信' },
    { value: 'recall', label: 'リコール', icon: '📅', description: '休眠患者への呼び戻し' },
    { value: 'default_reply', label: '通常応答', icon: '💬', description: 'メッセージへの自動返信' },
    { value: 'alert_reply', label: '緊急応答', icon: '🚨', description: '特定キーワード検出時' },
]

// デモ用モックデータ
const mockTemplates = [
    { id: '1', type: 'welcome', name: 'ウェルカムメッセージ', content: '友だち追加ありがとうございます！\n当院からのお知らせや健康情報をお届けします。', is_active: true },
    { id: '2', type: 'aftercare', name: '来院後フォロー', content: '本日はご来院ありがとうございました。\nお薬の効き目はいかがですか？\n体調に変化があれば無理せずご連絡ください。', is_active: true },
    { id: '3', type: 'default_reply', name: '通常応答', content: 'ご連絡ありがとうございます。\nお大事になさってください。', is_active: true },
]

export default function Templates() {
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editContent, setEditContent] = useState('')
    const queryClient = useQueryClient()

    const { data: templates, isLoading } = useQuery({
        queryKey: ['templates'],
        queryFn: () => fetchTemplates(),
        placeholderData: mockTemplates,
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, content }: { id: string; content: string }) =>
            updateTemplate(id, { content }),
        onSuccess: () => {
            setEditingId(null)
            queryClient.invalidateQueries({ queryKey: ['templates'] })
        },
    })

    const defaultsMutation = useMutation({
        mutationFn: createDefaultTemplates,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates'] })
        },
    })

    const startEdit = (template: Template) => {
        setEditingId(template.id)
        setEditContent(template.content)
    }

    const saveEdit = () => {
        if (editingId) {
            updateMutation.mutate({ id: editingId, content: editContent })
        }
    }

    const filteredTemplates = selectedType
        ? templates?.filter((t: Template) => t.type === selectedType)
        : templates

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">メッセージテンプレート</h2>
                    <p className="text-gray-600 mt-1">自動送信されるメッセージを設定</p>
                </div>
                <button
                    onClick={() => defaultsMutation.mutate()}
                    disabled={defaultsMutation.isPending}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                    {defaultsMutation.isPending ? '作成中...' : 'デフォルトを作成'}
                </button>
            </div>

            {/* Type Filter */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setSelectedType(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedType === null
                            ? 'bg-medical text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    すべて
                </button>
                {templateTypes.map((type) => (
                    <button
                        key={type.value}
                        onClick={() => setSelectedType(type.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${selectedType === type.value
                                ? 'bg-medical text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <span>{type.icon}</span>
                        {type.label}
                    </button>
                ))}
            </div>

            {/* Template Cards */}
            <div className="grid gap-4">
                {isLoading ? (
                    <div className="text-center text-gray-500 py-8">読み込み中...</div>
                ) : filteredTemplates?.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 bg-white rounded-xl">
                        テンプレートがありません。「デフォルトを作成」ボタンで初期テンプレートを作成できます。
                    </div>
                ) : (
                    filteredTemplates?.map((template: Template) => {
                        const typeInfo = templateTypes.find((t) => t.value === template.type)
                        const isEditing = editingId === template.id

                        return (
                            <div key={template.id} className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{typeInfo?.icon || '📝'}</span>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{template.name}</h3>
                                            <p className="text-sm text-gray-500">{typeInfo?.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${template.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {template.is_active ? '有効' : '無効'}
                                        </span>
                                    </div>
                                </div>

                                {isEditing ? (
                                    <div className="space-y-4">
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            rows={5}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical focus:border-transparent resize-none"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={saveEdit}
                                                disabled={updateMutation.isPending}
                                                className="bg-medical text-white px-4 py-2 rounded-lg hover:bg-medical-dark transition-colors disabled:opacity-50"
                                            >
                                                {updateMutation.isPending ? '保存中...' : '保存'}
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                キャンセル
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700">
                                            {template.content}
                                        </div>
                                        <button
                                            onClick={() => startEdit(template)}
                                            className="mt-4 text-medical hover:text-medical-dark font-medium text-sm"
                                        >
                                            編集する
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>

            {/* Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                    💡 <strong>ヒント:</strong> テンプレート内で <code className="bg-yellow-100 px-1 rounded">{'{name}'}</code> と書くと、患者名に自動置換されます。
                </p>
            </div>
        </div>
    )
}
