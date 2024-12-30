import mongoose from 'mongoose';
import STATUS_CODE from '../../helper/statusCode';
import ProjectModelAction from '../model/project/project-action';
import { ServerError, ServerResponse } from '../utils/response';
import DateTimeUtils from '../../helper/moment';

class ProjectController {
  async getAllProjects(_parent: any, { status }: { status: number }) {
    const payload = {
      status
    };

    const actionResponse = await ProjectModelAction.getAllProjectsAction(payload);
    return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
  }

  async getSingleProjects(_parent: any, { projectId, name }: { projectId: string; name: string }) {
    const actionResponse = await ProjectModelAction.getSingleProjects({
      id: projectId,
      name
    });
    return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
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
    if (actionResponse?.status !== STATUS_CODE.CODE_CREATED) {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    } else {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    }
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
    if (actionResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    }
  }

  async updateStatusProject(_parent: any, { id, status }: { id: string; status: boolean }) {
    const actionResponse = await ProjectModelAction.updateStatusProjectAction({
      projectId: id,
      status
    });

    if (actionResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    }
  }

  async deleteTempProject(_parent: any, { id, name }: { id: string; name: string }) {
    const actionResponse = await ProjectModelAction.deleteTempProjectAction({
      projectId: id,
      name
    });
    if (actionResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    }
  }

  async deletePermanentlyProject(_parent: any, { id, name }: { id: string; name: string }) {
    const actionResponse = await ProjectModelAction.deletePermanentlyProjectAction({
      projectId: id,
      name
    });
    if (actionResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    }
  }
}

export const projectController = new ProjectController();
