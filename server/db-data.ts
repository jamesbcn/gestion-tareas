export const SERVER_DELAY: number = 500;

export const TASKS: any = {
  "1": {
    "id": 1,
    "title": "Completar informe mensual",
    "description": "Revisar datos y redactar el informe mensual para la presentación.",
    "tags": [{"name": "Administrativo"}, {"name": "Prioridad"}]
  },
  "2": {
    "id": 2,
    "title": "Llamar al cliente",
    "description": "Concretar una llamada con el cliente X para discutir los detalles del proyecto.",
    "tags": [{"name": "Llamada"}, {"name": "Proyecto"}]
  },
  "3": {
    "id": 3,
    "title": "Preparar presentación para reunión",
    "description": "Crear una presentación detallada para la próxima reunión del equipo.",
    "tags": [{"name": "Presentación"}, {"name": "Equipo"}]
  },
  "4": {
    "id": 4,
    "title": "Investigar nuevas herramientas",
    "description": "Investigar y evaluar nuevas herramientas que puedan mejorar la eficiencia del equipo.",
    "tags": [{"name": "Investigación"}, {"name": "Herramientas"}]
  },
  "5": {
    "id": 5,
    "title": "Actualizar el sitio web",
    "description": "Realizar actualizaciones y mejoras en el contenido del sitio web de la empresa.",
    "tags": [{"name": "Tecnología"}]
  },
  "6": {
    "id": 6,
    "title": "Revisar contratos pendientes",
    "description": "Revisar y aprobar los contratos pendientes con los proveedores antes del plazo límite.",
    "tags": [{"name": "Contratos"}, {"name": "Administrativo"}, {"name": "Finanzas"}]
  },
  "7": {
    "id": 7,
    "title": "Entrenamiento en nuevas tecnologías",
    "description": "Organizar sesiones de entrenamiento para el equipo en las últimas tecnologías relevantes.",
    "tags": [{"name": "Entrenamiento"}, {"name": "Tecnología"}]
  },
  "8": {
    "id": 8,
    "title": "Enviar informe de gastos",
    "description": "Compilar y enviar el informe de gastos del último trimestre al departamento financiero.",
    "tags": [{"name": "Gastos"}, {"name": "Finanzas"}]
  }
};
  
  
  export const USERS = {
    1: {
      id: 1,
      username: 'test',
      password: 'test'
    }
  
  };
  
  
  export function authenticate(username: string, password: string) {
  
    const user: any = Object.values(USERS).find(user => user.username === username);
  
    if (user && user.password == password) {
      return user;
    } else {
      return undefined;
    }
  
  }