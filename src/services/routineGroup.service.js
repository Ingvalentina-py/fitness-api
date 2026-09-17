import mongoose from 'mongoose'
import { Routine, RoutineGroup } from '../models/index.js'
import { AppError } from '../utils/AppError.js'
import { hasSameIds } from '../utils/ids.js'

// Grupos en su orden, con cuántas rutinas activas tiene cada uno
export async function listGroups(userId) {
  const [groups, counts] = await Promise.all([
    RoutineGroup.find({ user: userId }).sort({ order: 1, createdAt: 1 }),
    Routine.aggregate([
      { $match: { user: userId, isArchived: false } },
      { $group: { _id: '$group', count: { $sum: 1 } } },
    ]),
  ])

  const countByGroup = new Map(counts.map(({ _id, count }) => [String(_id), count]))

  return groups.map((group) => ({
    ...group.toJSON(),
    routineCount: countByGroup.get(String(group._id)) ?? 0,
  }))
}

export async function createGroup(userId, data) {
  const last = await RoutineGroup.findOne({ user: userId }).sort({ order: -1 }).select('order')
  return RoutineGroup.create({ ...data, user: userId, order: (last?.order ?? -1) + 1 })
}

export async function updateGroup(userId, id, changes) {
  const group = await findOwnGroup(userId, id)
  group.set(changes)
  await group.save()
  return group
}

// Recibe todos los ids de grupos en el nuevo orden
export async function reorderGroups(userId, groupIds) {
  const groups = await RoutineGroup.find({ user: userId }).select('_id')

  if (!hasSameIds(groups.map((group) => group._id), groupIds)) {
    throw AppError.validation([
      { field: 'body.groupIds', message: 'La lista debe incluir todos tus grupos, una vez cada uno' },
    ])
  }

  await RoutineGroup.bulkWrite(
    groupIds.map((id, index) => ({
      updateOne: { filter: { _id: id, user: userId }, update: { $set: { order: index } } },
    })),
  )
}

// Si el grupo tiene rutinas, hay que indicar a qué grupo moverlas (moveTo)
export async function deleteGroup(userId, id, moveTo) {
  await findOwnGroup(userId, id)
  const routineCount = await Routine.countDocuments({ user: userId, group: id })

  if (routineCount > 0 && !moveTo) {
    throw new AppError('Este grupo tiene rutinas. Elige a qué grupo moverlas antes de eliminarlo.', {
      status: 409,
      code: 'GROUP_NOT_EMPTY',
    })
  }

  if (moveTo) {
    if (moveTo === id) {
      throw AppError.validation([
        { field: 'query.moveTo', message: 'Elige un grupo distinto al que vas a eliminar' },
      ])
    }
    await findOwnGroup(userId, moveTo)
  }

  // Transacción: mover las rutinas y borrar el grupo ocurre completo o no ocurre
  await mongoose.connection.transaction(async (session) => {
    if (routineCount > 0) {
      const last = await Routine.findOne({ user: userId, group: moveTo })
        .sort({ order: -1 })
        .select('order')
        .session(session)
      const routines = await Routine.find({ user: userId, group: id })
        .sort({ order: 1 })
        .select('_id')
        .session(session)

      // Las rutinas movidas quedan al final del grupo de destino
      await Routine.bulkWrite(
        routines.map((routine, index) => ({
          updateOne: {
            filter: { _id: routine._id },
            update: { $set: { group: moveTo, order: (last?.order ?? -1) + 1 + index } },
          },
        })),
        { session },
      )
    }

    await RoutineGroup.deleteOne({ _id: id, user: userId }, { session })
  })
}

export async function findOwnGroup(userId, id) {
  const group = await RoutineGroup.findOne({ _id: id, user: userId })
  if (!group) throw AppError.notFound('Grupo no encontrado')
  return group
}
