'use client'

import React, { useState, useEffect } from 'react';

import AlumnosList from './AlumnosList';
import CursosAlumnoList from './CursosAlumnoList';
import DetalleProgresoModal from './DetalleProgresoModal';

export default function SupervisorDashboard() {
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlumno, setSelectedAlumno] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/supervisor/alumnos')
      .then(res => res.json())
      .then(data => {
        if (data.alumnos) setAlumnos(data.alumnos);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleOpenCourses = (alumno: any) => {
    setSelectedAlumno(alumno);
  };

  const handleOpenModal = (cursoDetails: any) => {
    setSelectedCourse(cursoDetails);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        {selectedAlumno && (
          <button 
            onClick={() => setSelectedAlumno(null)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center text-gray-500"
            title="Volver al listado"
          >
            <i className="tabler-arrow-left text-xl" />
          </button>
        )}
        <h1 className="text-2xl font-bold">Panel de Supervisor</h1>
      </div>
      
      {!selectedAlumno && (
        <p className="text-gray-600 mb-8">Objetivo: Supervisar avance de los cursos de tu equipo.</p>
      )}
      
      {loading ? (
        <p>Cargando información de alumnos...</p>
      ) : selectedAlumno ? (
        <CursosAlumnoList alumno={selectedAlumno} onOpenDetails={handleOpenModal} />
      ) : (
        <AlumnosList alumnos={alumnos} onOpenCourses={handleOpenCourses} />
      )}

      {selectedCourse && (
        <DetalleProgresoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          cursoData={selectedCourse}
        />
      )}
    </div>
  );
}
