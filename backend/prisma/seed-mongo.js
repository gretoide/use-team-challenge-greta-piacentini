const { MongoClient, ObjectId } = require('mongodb');

async function main() {
  const uri = process.env.DATABASE_URL || "mongodb://localhost:27017/my-kanban-db";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();

    // Limpiar colecciones existentes
    await db.collection('User').deleteMany({});
    await db.collection('Column').deleteMany({});
    await db.collection('Card').deleteMany({});

    // Crear usuarios
    const user1 = {
      _id: new ObjectId(),
      name: 'Usuario 1',
      email: 'user1@test.com'
    };

    const user2 = {
      _id: new ObjectId(),
      name: 'Usuario 2',
      email: 'user2@test.com'
    };

    await db.collection('User').insertMany([user1, user2]);

    // Crear columnas
    const todoColumn = {
      _id: new ObjectId(),
      title: 'Por hacer',
      order: 0
    };

    const inProgressColumn = {
      _id: new ObjectId(),
      title: 'En progreso',
      order: 1
    };

    const doneColumn = {
      _id: new ObjectId(),
      title: 'Completado',
      order: 2
    };

    await db.collection('Column').insertMany([todoColumn, inProgressColumn, doneColumn]);

    // Crear tarjetas
    const cards = [
      {
        _id: new ObjectId(),
        title: 'Tarea 1',
        content: 'Descripción de la tarea 1',
        order: 0,
        columnId: todoColumn._id.toString(),
        userId: user1._id.toString()
      },
      {
        _id: new ObjectId(),
        title: 'Tarea 2',
        content: 'Descripción de la tarea 2',
        order: 1,
        columnId: todoColumn._id.toString(),
        userId: user2._id.toString()
      },
      {
        _id: new ObjectId(),
        title: 'Tarea en progreso',
        content: 'Esta tarea está en desarrollo',
        order: 0,
        columnId: inProgressColumn._id.toString(),
        userId: user1._id.toString()
      }
    ];

    await db.collection('Card').insertMany(cards);

    console.log('Datos de prueba creados con éxito');
  } finally {
    await client.close();
  }
}

main().catch(console.error);