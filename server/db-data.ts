export const TASKS: any = {

    1: {
      id: 1,
      title: "Task title 1",
      description: 'Más información',
      tags: [{name: 'Tag1'}, {name: 'Tag2'}]
  
    },
    2: {
        id: 2,
        title: "Task title 2",
        description: 'Más información',
        tags: [{name: 'Tag1'}, {name: 'Tag2'}, {name: 'Tag3'}]
      },
    3: {
      id: 3,
      title: "Task title 3",
      description: 'Más información',
      tags: [{name: 'Tag1'}, {name: 'Tag2'}, {name: 'URGENTE'}]
    },
  
    4: {
      id: 4,
      title: "Task title 4",
      description: 'Más información',
      tags: [{name: 'Tag2'}]
    },
  
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