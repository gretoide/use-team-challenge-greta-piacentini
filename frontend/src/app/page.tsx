'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useEffect } from 'react';
import { io } from "socket.io-client";
import { Toaster, toast } from 'sonner';
import { useStore } from '../store/useStore';
import { Column } from '../components/Column';
import { UserSwitch } from '../components/UserSwitch';

const socket = io('http://localhost:3000');

export default function Home() {
  const { columns, setColumns, users, setUsers, moveCard } = useStore();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  


  useEffect(() => {
    // Cargar usuarios
    socket.emit('getUsers', {}, (response: any) => {
      if (response.success) {
        setUsers(response.data);
      }
    });

    // Cargar columnas y tarjetas
    socket.emit('getColumns', {}, (response: any) => {
      if (response.success) {
        setColumns(response.data);
      }
    });

    // Escuchar eventos de WebSocket
    socket.on('cardMoved', (data) => {
      toast('Tarjeta movida');
      // Recargar las columnas para mantener sincronización
      socket.emit('getColumns', {}, (response: any) => {
        if (response.success) {
          setColumns(response.data);
        }
      });
    });

    return () => {
      socket.off('cardMoved');
    };
  }, []);

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Encontrar la columna de origen (donde está la tarjeta actualmente)
    const sourceColumn = columns.find(col => 
      col.cards.some(card => card.id === activeId)
    );

    if (!sourceColumn) return;

    // Determinar la columna de destino
    let targetColumn = columns.find(col => col.id === overId);
    
    // Si overId no es una columna, buscar en qué columna está esa tarjeta
    if (!targetColumn) {
      targetColumn = columns.find(col => 
        col.cards.some(card => card.id === overId)
      );
    }

    if (!targetColumn || sourceColumn.id === targetColumn.id) return;

    // Solo actualizar localmente para feedback visual
    const sourceCardIndex = sourceColumn.cards.findIndex(card => card.id === activeId);
    if (sourceCardIndex === -1) return;

    const card = sourceColumn.cards[sourceCardIndex];
    
    // Calcular nueva posición en la columna de destino
    let newOrder = targetColumn.cards.length;
    
    // Si se está soltando sobre otra tarjeta, insertarse en esa posición
    const overCardIndex = targetColumn.cards.findIndex(c => c.id === overId);
    if (overCardIndex !== -1) {
      newOrder = overCardIndex;
    }

    // Actualizar store localmente para feedback visual inmediato
    moveCard(activeId, sourceColumn.id, targetColumn.id, newOrder);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Encontrar la columna de origen
    const sourceColumn = columns.find(col => 
      col.cards.some(card => card.id === activeId)
    );

    if (!sourceColumn) return;

    // Determinar la columna de destino
    let targetColumn = columns.find(col => col.id === overId);
    
    // Si overId no es una columna, buscar en qué columna está esa tarjeta
    if (!targetColumn) {
      targetColumn = columns.find(col => 
        col.cards.some(card => card.id === overId)
      );
    }

    if (!targetColumn) return;

    // Calcular el nuevo orden en la columna de destino
    let newOrder = targetColumn.cards.length;
    
    // Si se soltó sobre otra tarjeta, insertarse en esa posición
    const overCardIndex = targetColumn.cards.findIndex(c => c.id === overId);
    if (overCardIndex !== -1) {
      newOrder = overCardIndex;
    }

    // Solo enviar al backend si hay un cambio real de columna
    if (sourceColumn.id !== targetColumn.id) {
      socket.emit('moveCard', {
        id: activeId,
        columnId: targetColumn.id,
        order: newOrder
      });
    }
  };

  return (
    <main className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My G.Kanban</h1>
        <UserSwitch />
      </div>
      
      <DndContext
        sensors={sensors}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {columns.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              cards={column.cards}
            />
          ))}
        </div>
      </DndContext>
      
      <Toaster position="top-right" />
    </main>
  );
}