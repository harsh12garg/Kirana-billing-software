const PageHeader = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-slide-in">
      <div>
        <h1 className="text-4xl font-bold text-base-content font-display mb-2">{title}</h1>
        {subtitle && <p className="text-base-content/60 font-body">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export default PageHeader
