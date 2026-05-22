import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request, { params }) {
  const session = await auth()
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 })

  const { teamId } = await params

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { members: true }
  })

  if (!team) return Response.json({ error: "No encontrado" }, { status: 404 })
  if (team.userId !== session.user.id) return Response.json({ error: "No autorizado" }, { status: 403 })

  return Response.json(team)
}

export async function DELETE(request, { params }) {
  const session = await auth()
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 })

  const { teamId } = await params

  const team = await prisma.team.findUnique({ where: { id: teamId } })
  if (!team) return Response.json({ error: "No encontrado" }, { status: 404 })
  if (team.userId !== session.user.id) return Response.json({ error: "No autorizado" }, { status: 403 })

  await prisma.teamMember.deleteMany({ where: { teamId } })
  await prisma.team.delete({ where: { id: teamId } })

  return Response.json({ ok: true })
}

export async function PATCH(request, { params }) {
  const session = await auth()
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 })

  const { teamId } = await params
  const body = await request.json()

  const team = await prisma.team.findUnique({ where: { id: teamId } })
  if (!team) return Response.json({ error: "No encontrado" }, { status: 404 })
  if (team.userId !== session.user.id) return Response.json({ error: "No autorizado" }, { status: 403 })

  await prisma.teamMember.deleteMany({ where: { teamId } })

  const updated = await prisma.team.update({
    where: { id: teamId },
    data: {
      name: body.name,
      members: {
        create: body.pokemon.map((p, index) => ({
          pokemonId: p.id,
          position: index,
        }))
      }
    },
    include: { members: true }
  })

  return Response.json(updated)
}