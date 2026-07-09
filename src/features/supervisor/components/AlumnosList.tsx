import React from 'react';
import { Eye } from 'lucide-react';

export default function AlumnosList({ alumnos, onOpenCourses }: { alumnos: any[], onOpenCourses: (alumno: any) => void }) {
  if (alumnos.length === 0) {
    return <p className="text-gray-500">No tienes alumnos asignados.</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {alumnos.map((alumno, index) => {
        // Calculate global average
        const notasValidas = alumno.cursos
          .map((c: any) => parseFloat(c.notaPromedio))
          .filter((n: number) => !isNaN(n));
        
        const promedioGlobal = notasValidas.length > 0 
          ? (notasValidas.reduce((a: number, b: number) => a + b, 0) / notasValidas.length).toFixed(2)
          : '--';

        return (
          <div key={alumno.id} className={`flex items-center justify-between p-4 md:px-6 hover:bg-gray-50 transition-colors ${index !== alumnos.length - 1 ? 'border-b' : ''}`}>
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                {alumno.avatar ? (
                  <img src={alumno.avatar} alt={alumno.nombre} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg font-semibold">
                    {alumno.nombre.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold truncate" title={alumno.nombre}>{alumno.nombre}</h2>
                <p className="text-sm text-gray-500 truncate" title={alumno.correo}>{alumno.correo}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 ml-4">
              <div className="text-center hidden sm:block">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Nota Promedio</p>
                <p className="font-semibold text-lg">{promedioGlobal}</p>
              </div>
              
              <button 
                onClick={() => onOpenCourses(alumno)}
                className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 rounded-lg transition-colors flex items-center gap-2 font-medium text-sm whitespace-nowrap"
              >
                <Eye size={18} />
                <span className="hidden sm:inline">Ver Cursos</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
