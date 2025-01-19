import { teamModelAction } from '../model/team/team-action';

class TeamController {
  async getAllTeam() {
    const actionResponse: any = await teamModelAction.getAllTeamAction();
    return actionResponse;
  }

  async getSingleTeam(_parent: any, { teamId, name }: { teamId: string; name: string }) {
    const actionResponse: any = await teamModelAction.getSingleTeamAction({ teamId, name });
    return actionResponse;
  }

  async createTeam(
    _parent: any,
    {
      teamData
    }: {
      teamData: {
        name: string;
        description: string;
        leader: string[];
        employee: string[];
        manager: string[];
        technologies: string[];
        createdUser: string;
      };
    }
  ) {
    const actionResponse: any = await teamModelAction.createTeamAction({
      name: teamData?.name,
      description: teamData?.description,
      leader: teamData?.leader,
      employee: teamData?.employee,
      manager: teamData?.manager,
      technologies: teamData?.technologies,
      createdUser: teamData?.createdUser
    });

    return actionResponse;
  }

  async updateTeam(_parent: any, { teamId, teamData }: { teamId: string; teamData: any }) {
    const actionResponse: any = await teamModelAction.updateTeamAction({
      teamId: teamId,
      name: teamData?.name,
      description: teamData?.description,
      leader: teamData?.leader,
      employee: teamData?.employee,
      manager: teamData?.manager,
      technologies: teamData?.technologies,
      createdUser: teamData?.createdUser
    });
    return actionResponse;
  }

  async changeStatusTeam(_parent: any, { teamData }: { teamData: any }) {
    const actionResponse: any = await teamModelAction.changeStatusTeamAction({
      name: teamData?.name,
      teamId: teamData?.teamId
    });

    return actionResponse;
  }

  async deleteTeam(_parent: any, { teamData }: { teamData: any }) {
    const actionResponse: any = await teamModelAction.deleteTeamAction({
      name: teamData?.name,
      teamId: teamData?.teamId
    });

    return actionResponse;
  }
}

export const teamController = new TeamController();
