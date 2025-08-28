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

    // Crear usuarios con nombres más realistas
    const user1 = {
      _id: new ObjectId(),
      name: 'Ana García',
      email: 'ana.garcia@empresa.com'
    };

    const user2 = {
      _id: new ObjectId(),
      name: 'Carlos López',
      email: 'carlos.lopez@empresa.com'
    };

    const user3 = {
      _id: new ObjectId(),
      name: 'María Rodríguez',
      email: 'maria.rodriguez@empresa.com'
    };

    await db.collection('User').insertMany([user1, user2, user3]);

    // Crear columnas con nombres más descriptivos
    const todoColumn = {
      _id: new ObjectId(),
      title: '📋 Por Hacer',
      order: 0
    };

    const inProgressColumn = {
      _id: new ObjectId(),
      title: '🔄 En Progreso',
      order: 1
    };

    const reviewColumn = {
      _id: new ObjectId(),
      title: '👀 En Revisión',
      order: 2
    };

    const doneColumn = {
      _id: new ObjectId(),
      title: '✅ Completado',
      order: 3
    };

    await db.collection('Column').insertMany([todoColumn, inProgressColumn, reviewColumn, doneColumn]);

    // Crear tarjetas más realistas y variadas
    const cards = [
      // Tarjetas en "Por Hacer"
      {
        _id: new ObjectId(),
        title: 'Diseñar mockups de la interfaz',
        content: 'Crear wireframes y mockups para la nueva funcionalidad de usuarios. Incluir pantallas de login, registro y perfil.',
        order: 0,
        columnId: todoColumn._id.toString(),
        userId: user1._id.toString()
      },
      {
        _id: new ObjectId(),
        title: 'Configurar base de datos',
        content: 'Preparar el esquema de la base de datos MongoDB. Crear índices y configurar conexiones.',
        order: 1,
        columnId: todoColumn._id.toString(),
        userId: user2._id.toString()
      },
      {
        _id: new ObjectId(),
        title: 'Planificar sprints del proyecto',
        content: 'Definir las tareas para los próximos 2 sprints. Estimar tiempos y asignar recursos.',
        order: 2,
        columnId: todoColumn._id.toString(),
        userId: user3._id.toString()
      },
      {
        _id: new ObjectId(),
        title: 'Revisar documentación técnica',
        content: 'Actualizar la documentación de la API. Agregar ejemplos de uso y casos de prueba.',
        order: 3,
        columnId: todoColumn._id.toString(),
        userId: user1._id.toString()
      },

      // Tarjetas en "En Progreso"
      {
        _id: new ObjectId(),
        title: 'Implementar autenticación JWT',
        content: 'Desarrollar el sistema de autenticación con tokens JWT. Incluir login, logout y refresh tokens.',
        order: 0,
        columnId: inProgressColumn._id.toString(),
        userId: user2._id.toString()
      },
      {
        _id: new ObjectId(),
        title: 'Crear componentes del frontend',
        content: 'Desarrollar los componentes React para el dashboard. Implementar formularios y validaciones.',
        order: 1,
        columnId: inProgressColumn._id.toString(),
        userId: user3._id.toString()
      },
      {
        _id: new ObjectId(),
        title: 'Configurar CI/CD pipeline',
        content: 'Implementar integración continua con GitHub Actions. Configurar tests automáticos y deployment.',
        order: 2,
        columnId: inProgressColumn._id.toString(),
        userId: user1._id.toString()
      },

      // Tarjetas en "En Revisión"
      {
        _id: new ObjectId(),
        title: 'Revisar código de la API',
        content: 'Code review del módulo de usuarios. Verificar buenas prácticas y cobertura de tests.',
        order: 0,
        columnId: reviewColumn._id.toString(),
        userId: user2._id.toString()
      },
      {
        _id: new ObjectId(),
        title: 'Validar diseño responsive',
        content: 'Probar la interfaz en diferentes dispositivos. Verificar que funcione bien en móvil y tablet.',
        order: 1,
        columnId: reviewColumn._id.toString(),
        userId: user3._id.toString()
      },

      // Tarjetas en "Completado"
      {
        _id: new ObjectId(),
        title: 'Setup inicial del proyecto',
        content: 'Configuración del entorno de desarrollo. Instalación de dependencias y configuración de herramientas.',
        order: 0,
        columnId: doneColumn._id.toString(),
        userId: user1._id.toString()
      },
      {
        _id: new ObjectId(),
        title: 'Crear repositorio Git',
        content: 'Inicializar repositorio con estructura de carpetas. Configurar .gitignore y README inicial.',
        order: 1,
        columnId: doneColumn._id.toString(),
        userId: user2._id.toString()
      }
    ];

    await db.collection('Card').insertMany(cards);

    console.log('✅ Seed mejorado creado con éxito!');
    console.log(`👥 Usuarios creados: ${[user1.name, user2.name, user3.name].join(', ')}`);
    console.log(`📋 Columnas creadas: ${[todoColumn.title, inProgressColumn.title, reviewColumn.title, doneColumn.title].join(', ')}`);
    console.log(`🎯 Tarjetas creadas: ${cards.length}`);
    console.log('\n🚀 ¡Tu tablero Kanban está listo para usar!');
  } finally {
    await client.close();
  }
}

main().catch(console.error);