interface Props {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
}

export default function WritingEditor({ label, placeholder, value, onChange, onFocus }: Props) {
  const isEnglish = label.includes('English') || label.toLowerCase().includes('english')
  const count = isEnglish
    ? (value.trim() ? value.trim().split(/\s+/).length : 0)
    : value.replace(/\s/g, '').length
  const unit = isEnglish ? 'words' : '字'

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="font-semibold text-sm text-gray-800">{label}</label>
        <span className="text-xs text-gray-400 tabular-nums">{count} {unit}</span>
      </div>

      <textarea
        value={value}
        onChange={event => onChange(event.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        rows={10}
        className="w-full px-4 py-3.5 rounded-xl border-2 resize-none text-sm leading-relaxed transition-all duration-150 placeholder:text-gray-300 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
      />
    </div>
  )
}
