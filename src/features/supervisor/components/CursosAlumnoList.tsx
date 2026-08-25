import React from 'react';
import { Eye } from 'lucide-react';

export default function CursosAlumnoList({ alumno, onOpenDetails }: { alumno: any, onOpenDetails: (curso: any) => void }) {
  return (
    <div className="bg-white rounded-lg shadow-md border p-6">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b">
        <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
          {alumno.avatar ? (
            <img src={alumno.avatar} alt={alumno.nombre} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-semibold">
              {alumno.nombre.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold">{alumno.nombre}</h2>
          <p className="text-gray-500">{alumno.correo}</p>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-700 mb-4">CURSOS INSCRITOS ({alumno.cursos.length})</h3>
        {alumno.cursos.length === 0 ? (
          <p className="text-sm text-gray-400">El alumno no está inscrito en ningún curso.</p>
        ) : (
          <div className="border rounded-md overflow-hidden">
            {alumno.cursos.map((curso: any, index: number) => (
              <div key={curso.id} className={`flex items-center justify-between p-4 ${index !== alumno.cursos.length - 1 ? 'border-b' : ''} hover:bg-gray-50 transition-colors`}>
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 hidden sm:block">
                    {curso.miniatura ? (
                      <img src={curso.miniatura} alt={curso.titulo} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{curso.titulo}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-2 w-full max-w-[200px] bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ width: `${curso.progreso}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600">{curso.progreso}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 ml-4">
                  <div className="text-center hidden sm:block">
                    <p className="text-xs text-gray-500">Nota Final</p>
                    <p className="font-semibold">{curso.notaPromedio}</p>
                  </div>
                  <button 
                    onClick={() => onOpenDetails({ alumno, curso })}
                    className="px-3 py-1.5 text-gray-600 hover:text-green-700 hover:bg-green-50 border border-transparent hover:border-green-200 rounded transition-all flex items-center gap-2"
                  >
                    <Eye size={18} />
                    <span className="text-sm font-medium">Ver más</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
