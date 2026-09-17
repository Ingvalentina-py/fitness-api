// Catálogo global inicial. Incluye los ejercicios del Excel original (marcados con ★).
// isUnilateral: true = se trabaja un lado a la vez.

export const exercises = [
  // ── Tren inferior: sentadillas ──
  { name: 'Sentadilla con barra', equipment: 'barbell', movementPattern: 'squat', primaryMuscles: ['quadriceps', 'gluteMax'], secondaryMuscles: ['adductors', 'lowerBack', 'abs'] },
  { name: 'Sentadilla goblet', equipment: 'dumbbell', movementPattern: 'squat', primaryMuscles: ['quadriceps', 'gluteMax'], secondaryMuscles: ['adductors', 'abs'] },
  { name: 'Sentadilla sumo', equipment: 'dumbbell', movementPattern: 'squat', primaryMuscles: ['gluteMax', 'adductors'], secondaryMuscles: ['quadriceps'] },
  // ★ "Zumo squats (prensa)"
  { name: 'Sentadilla sumo en prensa', equipment: 'machine', movementPattern: 'squat', primaryMuscles: ['gluteMax', 'adductors'], secondaryMuscles: ['quadriceps'] },
  { name: 'Sentadilla hack', equipment: 'machine', movementPattern: 'squat', primaryMuscles: ['quadriceps'], secondaryMuscles: ['gluteMax'] },
  { name: 'Sentadilla en Smith', equipment: 'smith', movementPattern: 'squat', primaryMuscles: ['quadriceps', 'gluteMax'], secondaryMuscles: ['adductors'] },
  { name: 'Prensa de piernas', equipment: 'machine', movementPattern: 'squat', primaryMuscles: ['quadriceps', 'gluteMax'], secondaryMuscles: ['hamstrings', 'adductors'] },

  // ── Tren inferior: bisagra de cadera ──
  { name: 'Peso muerto rumano', equipment: 'barbell', movementPattern: 'hinge', primaryMuscles: ['hamstrings', 'gluteMax'], secondaryMuscles: ['lowerBack', 'forearms'] },
  { name: 'Peso muerto rumano con mancuernas', equipment: 'dumbbell', movementPattern: 'hinge', primaryMuscles: ['hamstrings', 'gluteMax'], secondaryMuscles: ['lowerBack', 'forearms'] },
  { name: 'Peso muerto convencional', equipment: 'barbell', movementPattern: 'hinge', primaryMuscles: ['gluteMax', 'hamstrings'], secondaryMuscles: ['quadriceps', 'lowerBack', 'traps', 'forearms'] },
  { name: 'Swing con kettlebell', equipment: 'kettlebell', movementPattern: 'hinge', primaryMuscles: ['gluteMax', 'hamstrings'], secondaryMuscles: ['lowerBack', 'abs'] },
  { name: 'Hiperextensiones', equipment: 'bodyweight', movementPattern: 'hinge', primaryMuscles: ['lowerBack', 'gluteMax'], secondaryMuscles: ['hamstrings'] },

  // ── Tren inferior: empuje de cadera ──
  // ★ "Hip thrust" (máquina)
  { name: 'Hip thrust', equipment: 'machine', movementPattern: 'hipThrust', primaryMuscles: ['gluteMax'], secondaryMuscles: ['hamstrings', 'gluteMed'] },
  { name: 'Hip thrust con barra', equipment: 'barbell', movementPattern: 'hipThrust', primaryMuscles: ['gluteMax'], secondaryMuscles: ['hamstrings', 'gluteMed'] },
  { name: 'Puente de glúteo', equipment: 'bodyweight', movementPattern: 'hipThrust', primaryMuscles: ['gluteMax'], secondaryMuscles: ['hamstrings'] },

  // ── Tren inferior: zancadas ──
  // ★ "Sentadilla búlgara"
  { name: 'Sentadilla búlgara', equipment: 'dumbbell', movementPattern: 'lunge', primaryMuscles: ['quadriceps', 'gluteMax'], secondaryMuscles: ['gluteMed', 'adductors'], isUnilateral: true },
  { name: 'Zancadas con mancuernas', equipment: 'dumbbell', movementPattern: 'lunge', primaryMuscles: ['quadriceps', 'gluteMax'], secondaryMuscles: ['hamstrings', 'gluteMed'], isUnilateral: true },
  { name: 'Subida al cajón', equipment: 'dumbbell', movementPattern: 'lunge', primaryMuscles: ['quadriceps', 'gluteMax'], secondaryMuscles: ['gluteMed'], isUnilateral: true },

  // ── Tren inferior: aislamiento ──
  // ★ "Patada glúteo" (unilateral máquina)
  { name: 'Patada de glúteo en máquina', equipment: 'machine', movementPattern: 'isolation', primaryMuscles: ['gluteMax'], secondaryMuscles: ['hamstrings'], isUnilateral: true },
  { name: 'Patada de glúteo en polea', equipment: 'cable', movementPattern: 'isolation', primaryMuscles: ['gluteMax'], secondaryMuscles: ['hamstrings'], isUnilateral: true },
  { name: 'Abducción de cadera en máquina', equipment: 'machine', movementPattern: 'isolation', primaryMuscles: ['gluteMed', 'abductors'] },
  { name: 'Abducción de cadera en polea', equipment: 'cable', movementPattern: 'isolation', primaryMuscles: ['gluteMed', 'abductors'], isUnilateral: true },
  { name: 'Aducción de cadera en máquina', equipment: 'machine', movementPattern: 'isolation', primaryMuscles: ['adductors'] },
  { name: 'Extensión de cuádriceps', equipment: 'machine', movementPattern: 'isolation', primaryMuscles: ['quadriceps'] },
  // ★ "Femoral acostado"
  { name: 'Curl femoral acostado', equipment: 'machine', movementPattern: 'isolation', primaryMuscles: ['hamstrings'], secondaryMuscles: ['calves'] },
  { name: 'Curl femoral sentado', equipment: 'machine', movementPattern: 'isolation', primaryMuscles: ['hamstrings'] },
  { name: 'Elevación de talones de pie', equipment: 'machine', movementPattern: 'isolation', primaryMuscles: ['calves'] },

  // ── Tren superior: empuje ──
  // ★ "Press pecho"
  { name: 'Press de pecho en máquina', equipment: 'machine', movementPattern: 'horizontalPush', primaryMuscles: ['chest'], secondaryMuscles: ['frontDelts', 'triceps'] },
  { name: 'Press de banca con barra', equipment: 'barbell', movementPattern: 'horizontalPush', primaryMuscles: ['chest'], secondaryMuscles: ['frontDelts', 'triceps'] },
  { name: 'Press inclinado con mancuernas', equipment: 'dumbbell', movementPattern: 'horizontalPush', primaryMuscles: ['chest', 'frontDelts'], secondaryMuscles: ['triceps'] },
  { name: 'Flexiones de brazos', equipment: 'bodyweight', movementPattern: 'horizontalPush', primaryMuscles: ['chest'], secondaryMuscles: ['triceps', 'frontDelts', 'abs'] },
  // ★ "Abrazos (máquina)"
  { name: 'Abrazos en máquina (pec deck)', equipment: 'machine', movementPattern: 'isolation', primaryMuscles: ['chest'], secondaryMuscles: ['frontDelts'] },
  { name: 'Press de hombro con mancuernas', equipment: 'dumbbell', movementPattern: 'verticalPush', primaryMuscles: ['frontDelts', 'sideDelts'], secondaryMuscles: ['triceps'] },
  { name: 'Press de hombro en máquina', equipment: 'machine', movementPattern: 'verticalPush', primaryMuscles: ['frontDelts', 'sideDelts'], secondaryMuscles: ['triceps'] },
  { name: 'Elevaciones laterales con mancuernas', equipment: 'dumbbell', movementPattern: 'isolation', primaryMuscles: ['sideDelts'], secondaryMuscles: ['traps'] },
  { name: 'Fondos en banco', equipment: 'bodyweight', movementPattern: 'verticalPush', primaryMuscles: ['triceps'], secondaryMuscles: ['chest', 'frontDelts'] },

  // ── Tren superior: tirón ──
  { name: 'Jalón al pecho', equipment: 'cable', movementPattern: 'verticalPull', primaryMuscles: ['lats'], secondaryMuscles: ['biceps', 'rhomboids', 'rearDelts'] },
  { name: 'Dominadas asistidas', equipment: 'machine', movementPattern: 'verticalPull', primaryMuscles: ['lats'], secondaryMuscles: ['biceps', 'rhomboids'] },
  { name: 'Remo sentado en polea', equipment: 'cable', movementPattern: 'horizontalPull', primaryMuscles: ['lats', 'rhomboids'], secondaryMuscles: ['biceps', 'rearDelts', 'traps'] },
  { name: 'Remo con mancuerna', equipment: 'dumbbell', movementPattern: 'horizontalPull', primaryMuscles: ['lats'], secondaryMuscles: ['rhomboids', 'biceps', 'rearDelts'], isUnilateral: true },
  { name: 'Face pull', equipment: 'cable', movementPattern: 'horizontalPull', primaryMuscles: ['rearDelts'], secondaryMuscles: ['rhomboids', 'traps'] },
  { name: 'Vuelos posteriores en máquina', equipment: 'machine', movementPattern: 'isolation', primaryMuscles: ['rearDelts'], secondaryMuscles: ['rhomboids'] },
  { name: 'Encogimientos con mancuernas', equipment: 'dumbbell', movementPattern: 'isolation', primaryMuscles: ['traps'], secondaryMuscles: ['forearms'] },

  // ── Brazos ──
  { name: 'Curl de bíceps con mancuernas', equipment: 'dumbbell', movementPattern: 'isolation', primaryMuscles: ['biceps'], secondaryMuscles: ['forearms'] },
  // ★ "Curl de bíceps en polea baja (con barrita)"
  { name: 'Curl de bíceps en polea baja (con barra)', equipment: 'cable', movementPattern: 'isolation', primaryMuscles: ['biceps'], secondaryMuscles: ['forearms'] },
  // ★ "Curl martillo en polea baja (con trenzas)"
  { name: 'Curl martillo en polea baja (con cuerda)', equipment: 'cable', movementPattern: 'isolation', primaryMuscles: ['biceps', 'forearms'] },
  // ★ "Contracción de bíceps"
  { name: 'Curl concentrado (contracción de bíceps)', equipment: 'dumbbell', movementPattern: 'isolation', primaryMuscles: ['biceps'], isUnilateral: true },
  { name: 'Extensión de tríceps en polea', equipment: 'cable', movementPattern: 'isolation', primaryMuscles: ['triceps'] },
  { name: 'Extensión de tríceps sobre la cabeza', equipment: 'dumbbell', movementPattern: 'isolation', primaryMuscles: ['triceps'] },

  // ── Core ──
  { name: 'Plancha', equipment: 'bodyweight', movementPattern: 'core', primaryMuscles: ['abs'], secondaryMuscles: ['obliques', 'lowerBack'] },
  { name: 'Plancha lateral', equipment: 'bodyweight', movementPattern: 'core', primaryMuscles: ['obliques'], secondaryMuscles: ['abs', 'gluteMed'], isUnilateral: true },
  { name: 'Crunch abdominal', equipment: 'bodyweight', movementPattern: 'core', primaryMuscles: ['abs'] },
  { name: 'Crunch en polea', equipment: 'cable', movementPattern: 'core', primaryMuscles: ['abs'], secondaryMuscles: ['obliques'] },
  { name: 'Elevación de piernas colgado', equipment: 'bodyweight', movementPattern: 'core', primaryMuscles: ['abs', 'hipFlexors'], secondaryMuscles: ['forearms'] },
  { name: 'Giros rusos', equipment: 'bodyweight', movementPattern: 'core', primaryMuscles: ['obliques'], secondaryMuscles: ['abs'] },

  // ── Cuerpo completo ──
  { name: 'Burpees', equipment: 'bodyweight', movementPattern: 'other', primaryMuscles: ['fullBody'] },
]
