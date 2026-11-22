// While the 3D stall loads: a faint outline of the shelf and basket where they'll appear, so the screen
// already reads as a stall. Static on purpose; it is gone in a second or two.
export default function StallSkeleton({ className = '' }) {
  return (
    <div className={`stage-loading ${className}`} role="status">
      <div className="skeleton-shelf" aria-hidden="true">
        {Array.from({ length: 15 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <div className="skeleton-basket" aria-hidden="true" />
      <p>Setting up the stall…</p>
    </div>
  )
}
