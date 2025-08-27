'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  closestCorners,
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
      moveCard(data.id, data.sourceColumnId, data.targetColumnId, data.order);
    });

    return () => {
      socket.off('cardMoved');
    };
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeColumnId = columns.find(col => 
      col.cards.some(card => card.id === activeId)
    )?.id;

    const overColumnId = columns.find(col => 
      col.cards.some(card => card.id === overId)
    )?.id;

    if (!activeColumnId || !overColumnId) return;

    socket.emit('moveCard', {
      id: activeId.toString(),
      columnId: overColumnId,
      order: columns.find(col => col.id === overColumnId)
        ?.cards.findIndex(card => card.id === overId) ?? 0,
    });
  };

  return (
    <main className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Tablero Kanban</h1>
        <UserSwitch />
      </div>
      
      <DndContext
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