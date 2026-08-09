import express, { Application } from 'express';
import cors from 'cors';
import { apiKeyMiddleware } from './middlewares/api-key.middleware';
import usersRoutes from './routes/users.repo.routes';

import workspacesRoutes from './routes/workspaces.repo.routes';

import processStepsRoutes from './routes/process-steps.repo.routes';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.configureRoutes();
  }

  private configureMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
    // Protect ALL /repo/* routes with API Key — only service-business can call these
    this.app.use('/repo', apiKeyMiddleware);
  }

  private configureRoutes(): void {
    // Health check — publicly accessible (no API key needed)
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK', service: 'CRUD Persistence Service', timestamp: new Date() });
    });

    // Repository routes (all protected by apiKeyMiddleware)
    this.app.use('/repo/users', usersRoutes);

    this.app.use('/repo/workspaces', workspacesRoutes);

    this.app.use('/repo/process-steps', processStepsRoutes);
  }
}

export default new App().app;
