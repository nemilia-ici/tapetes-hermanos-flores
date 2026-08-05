'use client'

export default function Home() {
  return (
    <div suppressHydrationWarning dangerouslySetInnerHTML={{
      __html: `
<!DOCTYPE html>
<html lang="es">
...
      `
    }} />
  )
}
