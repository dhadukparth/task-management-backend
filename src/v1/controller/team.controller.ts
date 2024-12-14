import STATUS_CODE from '../../helper/statusCode';
import { teamModelAction } from '../model/team/team-action';
import { ServerError, ServerResponse } from '../utils/response';

class TeamController {
  async createTeam(_parent: any, { teamData }: { teamData: any }) {
    const apiResponse: any = await teamModelAction.createTeamAction({
      name: teamData?.name,
      description: teamData?.description,
      leader: teamData?.leader,
      employee: teamData?.employee,
      manager: teamData?.manager,
      technologies: teamData?.technologies,
      createdUser: teamData?.createdUser
    });

    if (apiResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(apiResponse?.status, apiResponse?.message, apiResponse?.data);
    }

    return ServerError(apiResponse?.status, apiResponse?.message, apiResponse?.error);
  }

  async updateTeam(_parent: any, { teamId, teamData }: { teamId: string; teamData: any }) {
    const apiResponse: any = await teamModelAction.updateTeamAction({
      teamId: teamId,
      name: teamData?.name,
      description: teamData?.description,
      leader: teamData?.leader,
      employee: teamData?.employee,
      manager: teamData?.manager,
      technologies: teamData?.technologies,
      createdUser: teamData?.createdUser
    });

    if (apiResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(apiResponse?.status, apiResponse?.message, apiResponse?.data);
    }

    return ServerError(apiResponse?.status, apiResponse?.message, apiResponse?.error);
  }

  async changeStatusTeam(_parent: any, { teamData }: { teamData: any }) {
    const apiResponse: any = await teamModelAction.changeStatusTeamAction({
      name: teamData?.name,
      teamId: teamData?.teamId
    });

    if (apiResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(apiResponse?.status, apiResponse?.message, apiResponse?.data);
    }

    return ServerError(apiResponse?.status, apiResponse?.message, apiResponse?.error);
  }

  async deleteTeam(_parent: any, { teamData }: { teamData: any }) {
    const apiResponse: any = await teamModelAction.deleteTeamAction({
      name: teamData?.name,
      teamId: teamData?.teamId
    });

    if (apiResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(apiResponse?.status, apiResponse?.message, apiResponse?.data);
    }

    return ServerError(apiResponse?.status, apiResponse?.message, apiResponse?.error);
  }
}

export const teamController = new TeamController();
