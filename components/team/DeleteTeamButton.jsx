"use client"

export default function DeleteTeamButton({ teamId }) {
  async function handleDelete() {
    if (!confirm("¿Seguro que quieres borrar este equipo?")) return

    const res = await fetch(`/api/teams/${teamId}`, {
      method: "DELETE"
    })

    if (res.ok) {
      window.location.reload()
    }
  }

  return (
    <button onClick={handleDelete}>
      Borrar
    </button>
  )
}