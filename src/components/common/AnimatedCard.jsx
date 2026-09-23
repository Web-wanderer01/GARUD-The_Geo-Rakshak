export default function AnimatedCard({ children, className = '' }) {
  // Replaced with static gov-card class for professional look
  return <div className={`gov-card ${className}`}>{children}</div>;
}
