export default function Options({isSmall}) {
  const sz = isSmall? '24px': '32px'
  return (
    <svg aria-label="Options" height={sz} role="img" viewBox="0 0 24 24" width={sz}>
        <circle cx="12" cy="12" r="1.5"></circle>
        <circle cx="6" cy="12" r="1.5"></circle>
        <circle cx="18" cy="12" r="1.5"></circle>
    </svg>
  )
}
