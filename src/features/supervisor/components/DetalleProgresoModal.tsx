import React from 'react';

export default function DetalleProgresoModal({ isOpen, onClose, cursoData }: { isOpen: boolean, onClose: () => void, cursoData: any }) {
  if (!isOpen || !cursoData) return null;
  const { alumno, curso } = cursoData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-bold">Progreso de Cursos</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden border-2 border-green-500">
                {alumno.avatar ? (
                  <img src={alumno.avatar} alt={alumno.nombre} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-3xl font-bold">
                    {alumno.nombre.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-xl">{alumno.nombre}</p>
                <p className="text-gray-500">{alumno.correo}</p>
              </div>
            </div>

            <div className="border rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row">
              {/* Izquierda: Info básica */}
              <div className="p-6 bg-gray-50 flex-1 border-b md:border-b-0 md:border-r flex flex-col justify-center">
                <p className="font-semibold text-lg text-gray-800">{curso.titulo}</p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="h-3 flex-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${curso.progreso}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-700">{curso.progreso}%</span>
                </div>
              </div>

              {/* Derecha: Notas (simulando la captura) */}
              <div className="p-4 bg-white w-full md:w-48 flex-shrink-0 text-sm flex flex-col justify-center">
                <div className="border border-gray-200 rounded-md p-3 shadow-sm">
                  <p className="font-semibold text-gray-700 mb-2 border-b pb-1 text-center">Progreso & Notas</p>
                  <div className="flex justify-between items-center mb-1 text-gray-600">
                    <span>Evals:</span>
                    <span className="font-medium">{curso.detallesNotas?.length || 0}/{curso.totalEvaluaciones || 0}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-green-600">Prom:</span>
                    <span className="font-bold text-green-600">{curso.notaPromedio}</span>
                  </div>
                  
                  <div className="space-y-1 text-gray-500 pt-2 border-t text-xs">
                    {curso.detallesNotas && curso.detallesNotas.length > 0 ? (
                      curso.detallesNotas.map((nota: any, i: number) => (
                        <div key={i} className="flex justify-between">
                          <span>N{i+1}:</span>
                          <span className="font-medium text-gray-700">{nota.nota}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex justify-between"><span>N1:</span><span className="font-medium text-gray-700">0.0</span></div>
                        <div className="flex justify-between"><span>N2:</span><span className="font-medium text-gray-700">0.0</span></div>
                        <div className="flex justify-between"><span>N3:</span><span className="font-medium text-gray-700">0.0</span></div>
                        <div className="flex justify-between"><span>N4:</span><span className="font-medium text-gray-700">0.0</span></div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
