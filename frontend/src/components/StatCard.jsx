const StatCard = ({ icon: Icon, title, value, trend, color = "primary" }) => {
  return (
    <div className="premium-card bg-base-100 rounded-2xl shadow-premium p-6 border border-base-300 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-base-content/60 mb-1 font-heading">{title}</p>
          <h3 className="text-3xl font-bold text-base-content font-display mb-2">{value}</h3>
          {trend && (
            <p className={`text-sm font-medium ${trend.positive ? 'text-success' : 'text-error'}`}>
              {trend.value}
            </p>
          )}
        </div>
        <div className={`p-4 rounded-xl bg-${color}/10`}>
          <Icon className={`w-8 h-8 text-${color}`} />
        </div>
      </div>
    </div>
  )
}

export default StatCard
