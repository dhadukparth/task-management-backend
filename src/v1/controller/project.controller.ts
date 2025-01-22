import mongoose from 'mongoose';
import DateTimeUtils from '../../helper/moment';
import ProjectModelAction from '../model/project/project-action';

class ProjectController {
  async getAllProjects(_parent: any, { status }: { status: number }) {
    const payload = {
      status
    };

    const actionResponse = await ProjectModelAction.getAllProjectsAction(payload);
    return actionResponse;
  }

  async getSingleProjects(_parent: any, { projectId, name }: { projectId: string; name: string }) {
    const actionResponse = await ProjectModelAction.getSingleProjects({
      id: projectId,
      name
    });
    return actionResponse;
  }

  async createProject(
    _parent: any,
    {
      data
    }: {
      data: {
        name: string;
        description: string;
        team: mongoose.Types.ObjectId;
        owner: mongoose.Types.ObjectId;
        startDate: string;
        endDate: string;
      };
    }
  ) {
    const startToUtc = DateTimeUtils.convertToUTC(data.startDate, 'UTC');
    const endToUtc = DateTimeUtils.convertToUTC(data.endDate, 'UTC');

    const actionResponse = await ProjectModelAction.createProjectAction({
      name: data.name,
      description: data.description,
      owner: data.owner,
      team: data.team,
      date: {
        startDate: startToUtc,
        endDate: endToUtc
      }
    });
    return actionResponse;
  }

  async updateProject(
    _parent: any,
    {
      id,
      data
    }: {
      id: string;
      data: {
        name: string;
        description: string;
        team: mongoose.Types.ObjectId;
        owner: mongoose.Types.ObjectId;
        startDate: string;
        endDate: string;
      };
    }
  ) {
    const startToUtc = DateTimeUtils.convertToUTC(data.startDate, 'UTC');
    const endToUtc = DateTimeUtils.convertToUTC(data.endDate, 'UTC');

    const actionResponse = await ProjectModelAction.updateProjectAction({
      projectId: id,
      name: data.name,
      description: data.description,
      owner: data.owner,
      team: data.team,
      date: {
        startDate: startToUtc,
        endDate: endToUtc
      }
    });
    return actionResponse;
  }

  async updateStatusProject(_parent: any, { id }: { id: string }) {
    const actionResponse = await ProjectModelAction.updateStatusProjectAction({
      projectId: id
    });

    return actionResponse;
  }

  async deleteTempProject(_parent: any, { id, name }: { id: string; name: string }) {
    const actionResponse = await ProjectModelAction.deleteTempProjectAction({
      projectId: id,
      name
    });
    return actionResponse;
  }

  async recoverTempProject(_parent: any, { id, name }: { id: string; name: string }) {
    const actionResponse = await ProjectModelAction.recoverTempProjectAction({
      projectId: id,
      name
    });
    return actionResponse;
  }

  async deletePermanentlyProject(_parent: any, { id, name }: { id: string; name: string }) {
    const actionResponse = await ProjectModelAction.deletePermanentlyProjectAction({
      projectId: id,
      name
    });
    return actionResponse;
  }
}

export const projectController = new ProjectController();
