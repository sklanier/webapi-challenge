/*
play this: https://www.youtube.com/watch?v=d-diB65scQU

Sing along:

here's a little code I wrote, you might want to read it really slow, don't worry be happy
in every line there may be trouble, but if you worry you make it double, don't worry, be happy
ain't got no sense of what is REST? just concentrate on learning Express, don't worry, be happy
your file is getting way too big, bring a Router and make it thin, don't worry, be crafty
there is no data on that route, just write some code, you'll sort it out… don't worry, just API…
I need this code, just don't know where, perhaps should make some middleware, don't worry, be happy

Go code!
*/

const express = require('express');
const server = express();

const projectsDB = require('./data/helpers/projectModel');
const actionsDB = require('./data/helpers/actionModel');

server.use(express.json());

// get endpoints
server.get('/api/projects', async (req, res) => {
  try {
    const projects = await projectsDB.get();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({error: 'failed to get projects'});
  }
});

server.get('/api/actions', async (req, res) => {
  try {
    const actions = await actionsDB.get();
    res.status(200).json(actions);
  } catch (err) {
    res.status(500).json({error: 'failed to get actions'});
  }
});

// get by ID endpoints
server.get('/api/projects/:id', async (req, res) => {
  let { id } = req.params

  try {
    const project = await projectsDB.get(id);

    if (id) {
      res.status(200).json(project);
    } else {
      res.status(400).json({message: 'ID is required'});
    }

  } catch (err) {
    res.status(500).json({error: 'failed to get project'});
  }
});

server.get('/api/actions/:id', (req, res) => {
  let { id } = req.params;

  try {
    const action = actionsDB.get(id);

    if (id) {
      res.status(200).json(action);
    } else {
      res.status(400).json({message: 'ID is required'});
    }
    
  } catch (err) {
    res.status(500).json({error: 'failed to get action'});
  }
});

// post endpoints
server.post('/api/projects', async (req, res) => {
  let { name, description } = req.body;

  try {
    const newProject = projectsDB.insert({ name, description });
    
    if(name === undefined || description === undefined){
      res.status(400).json({error: 'name and description are required'});
    } else {
      res.status(201).json(newProject);
    }

  } catch (err) { 
    res.status(500).json({error: 'failed to post new project'});
  }
});

server.post('/api/actions', async (req, res) => {
  let { project_id, notes, description } = req.body;

  try {
    if (project_id && description && notes) {
      const newAction = actionsDB.insert(req.body);
      res.status(201).json(newAction);
    } else {
      res.status(500).json({error: 'failed to add action.'});
    }
  } catch (err) {
    res.status(500).json({error: 'failed to post new action'});
  }
});

// delete endpoints
server.delete('/api/projects/:id', async (req, res) => {
  let { id } = req.params;

  try {
    const project = await projectsDB.get(id);
    
    if (project) {
      await projectsDB.remove(id);
      res.status(200).json(project);
    } else {
      res.status(400).json({message: 'failed to get project'});
    }

  } catch (err) {
    res.status(500).json({error: 'failed to delete project'});
  }
});

server.delete('/api/actions/:id', async (req, res) => {
  let { id } = req.params;

  try {
    const action = await actionsDB.get(id);

    if (action) {
      await actionsDB.remove(id);
      res.status(200).json(action);
    } else {
      res.status(400).json({message: 'failed to get action'});
    }

  } catch {
    res.status(500).json({error: 'failed to delete action'});
  }
});

// update by ID endpoints
server.put('/api/projects/:id', async (req, res) => {
  let { id } = req.params;
  let { name, description, completed } = req.body;

  try {
    const project = await projectsDB.get(id);

    if (project) {
      await projectsDB.update(id, {name, description, completed });
      res.status(200).json(project);
    } else {
      res.status(400).json({message: 'failed to get project'});
    }

  } catch (err) {
    res.status(500).json({error: 'failed to update project'});
  }
});

server.put('/api/actions/:id', async (req, res) => {
  let { id } = req.params;
  let { project_id, notes, description } = req.body;

  try {
    const action = await actionsDB.get(id);

    if (action) {
      if (project_id && description && notes) {
        await actionsDB.update(id, req.body);
        res.status(200).json(action);
      } else {
        res.status(400).json({message: 'failed to get action'})
      }
    } else {
      res.status(400).json({message: 'failed to get action'});
    }

  } catch (err) {
    res.status(500).json({error: 'failed to update action'});
  }
});

// get actions by product endpoints
server.get('/api/projects/:id/actions', (req, res) => {
  const { id } = req.params;
  projectsDB.getProjectActions(id)
    .then(allActions => {
      if (!allActions.length) {
        res.status(404).json({ error: "WHOA, buddy. That action doesn't exist."});
      } else {
        res.status(200).json(allActions);
      }
    })
    .catch(err => res.status(500).json({ error: "Hmmm... I don't even know if I can do that, guy..." }));
});

server.listen(4000);