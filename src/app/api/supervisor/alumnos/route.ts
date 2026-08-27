import { NextResponse } from "next/server";

import { getAuthSession } from "@/utils/libs/auth-helpers";
import prisma from "@/utils/libs/prisma";

export async function GET() {
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const supervisor = await prisma.usuario.findUnique({
      where: { id: session.user.id },
      select: { rol: true }
    });

    if (supervisor?.rol !== 'SUPERVISOR' && supervisor?.rol !== 'ADMIN') {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const supervisados = await prisma.supervisorAlumno.findMany({
      where: { supervisor_id: session.user.id },
      include: {
        alumno: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            avatar: true,
            correo: true,
            inscripciones: {
              include: {
                curso: {
                  select: {
                    id: true,
                    titulo: true,
                    miniatura: true,
                  }
                }
              }
            },
            progreso_cursos: true,
            intentos_examen: {
              include: {
                examen: {
                  select: {
                    titulo: true,
                    curso_id: true,
                    tipo: true,
                    peso: true,
                  }
                }
              }
            }
          }
        }
      }
    });

    const formattedData = supervisados.map(relacion => {
      const alumno = relacion.alumno;
      
      const cursos = alumno.inscripciones.map(inscripcion => {
        const progreso = alumno.progreso_cursos.find(p => p.curso_id === inscripcion.curso.id)?.porcentaje_progreso || 0;
        
        // Exámenes de este curso (para calcular promedio)
        const examenesCurso = alumno.intentos_examen.filter(i => i.examen.curso_id === inscripcion.curso.id);
        
        let notaPromedio = 0;
        let detallesNotas = [];
        
        if (examenesCurso.length > 0) {
          const sum = examenesCurso.reduce((acc, intento) => acc + (intento.puntaje || 0), 0);

          notaPromedio = sum / examenesCurso.length;
          
          detallesNotas = examenesCurso.map(intento => ({
            titulo: intento.examen.titulo,
            tipo: intento.examen.tipo,
            nota: intento.puntaje || 0
          }));
        }
        
        return {
          id: inscripcion.curso.id,
          titulo: inscripcion.curso.titulo,
          miniatura: inscripcion.curso.miniatura,
          progreso: Math.round(progreso),
          notaPromedio: Number(notaPromedio.toFixed(1)),
          detallesNotas,
          totalEvaluaciones: examenesCurso.length
        };
      });

      return {
        id: alumno.id,
        nombre: `${alumno.nombre} ${alumno.apellido}`,
        avatar: alumno.avatar,
        correo: alumno.correo,
        cursos
      };
    });

    return NextResponse.json({ alumnos: formattedData });
  } catch (error) {
    console.error("Error al obtener alumnos del supervisor:", error);
    
return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
