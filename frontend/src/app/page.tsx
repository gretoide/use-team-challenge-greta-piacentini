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
import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { Toaster, toast } from 'sonner';
import { useStore } from '../store/useStore';
import { Column } from '../components/Column';
import { UserSwitch } from '../components/UserSwitch';
import { CardSidebar } from '../components/CardSidebar';

const socket = io('http://localhost:3000');

export default function Home() {
  const { columns, setColumns, users, setUsers, moveCard } = useStore();
  const [selectedCard, setSelectedCard] = useState<{
    id: string;
    title: string;
    content: string;
    userId: string;
  } | null>(null);
  
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
      socket.emit('getColumns', {}, (response: any) => {
        if (response.success) {
          setColumns(response.data);
          toast.success('Tarjeta movida');
        }
      });
    });

    socket.on('cardUpdated', () => {
      socket.emit('getColumns', {}, (response: any) => {
        if (response.success) {
          setColumns(response.data);
        }
      });
    });

    return () => {
      socket.off('cardMoved');
      socket.off('cardUpdated');
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

    const cardId = active.id as string;
    const overId = over.id as string;

    // Encontrar la columna destino (puede ser el ID de la columna o una tarjeta en esa columna)
    let targetColumn = columns.find(col => col.id === overId);
    if (!targetColumn) {
      targetColumn = columns.find(col => 
        col.cards.some(card => card.id === overId)
      );
    }

    if (!targetColumn) return;

    // Calcular el nuevo orden
    let newOrder = targetColumn.cards.length;
    const overCardIndex = targetColumn.cards.findIndex(c => c.id === overId);
    if (overCardIndex !== -1) {
      newOrder = overCardIndex;
    }

    // 1. Actualizar estado local para feedback inmediato
    const sourceColumn = columns.find(col => 
      col.cards.some(card => card.id === cardId)
    );
    if (sourceColumn) {
      moveCard(cardId, sourceColumn.id, targetColumn.id, newOrder);
    }

    // 2. Enviar al backend para persistir el cambio
    socket.emit('moveCard', {
      id: cardId,
      columnId: targetColumn.id,
      order: newOrder
    }, (response: any) => {
      if (!response.success) {
        toast.error('Error al mover la tarjeta');
        // 3. Si falla, recargar estado desde el backend
        socket.emit('getColumns', {}, (response: any) => {
          if (response.success) {
            setColumns(response.data);
          }
        });
      }
    });
  };

  return (
    <>
      <Toaster richColors position="top-right" />
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
                    onCardClick={setSelectedCard}
                  />
          ))}
        </div>
      </DndContext>
      

      <CardSidebar 
        card={selectedCard} 
        onClose={() => setSelectedCard(null)}
        onEdit={(updatedCard) => {
          socket.emit('updateCard', {
            id: updatedCard.id,
            title: updatedCard.title,
            content: updatedCard.content,
            userId: updatedCard.userId
          }, (response: any) => {
            if (response.success) {
              toast.success('Tarjeta actualizada');
              setSelectedCard(null);
            } else {
              toast.error(response.error);
            }
          });
        }}
        onDelete={(cardId) => {
          socket.emit('deleteCard', { id: cardId }, (response: any) => {
            if (response.success) {
              toast.success('Tarjeta eliminada');
              socket.emit('getColumns', {}, (columnsResponse: any) => {
                if (columnsResponse.success) {
                  setColumns(columnsResponse.data);
                }
              });
            } else {
              toast.error('Error al eliminar la tarjeta');
            }
          });
        }}
      />
    </main>
    </>
  );
}